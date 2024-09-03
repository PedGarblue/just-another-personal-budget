// store/auth.ts
import { defineStore } from 'pinia'
import { useAPI } from '~~/composables/useAPI'
import {
  AuthState,
  APIToken,
  APITokenRefresh,
  LoginForm,
  User,
  AppStoredToken,
  RegisterForm,
} from '~~/types/auth'

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    /* Initialize state from local storage to enable user to stay logged in */
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    token: JSON.parse(localStorage.getItem('token') || '{}'),
    status: 'idle',
    refreshTokenPromise: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token?.access,
    isAccessTokenExpiringSoon: (state) =>
      state.token && Date.now() + 60 * 1000 > state.token.access_expires,
    getStatus: (state) => state.status,
    getToken: (state) => state.token,
    getRefreshTokenPromise: (state) => state.refreshTokenPromise,
  },
  actions: {
    async fetchToken(loginForm: LoginForm): Promise<boolean> {
      const { data: apiToken, error: apiTokenError } = await useAPI<APIToken>(
        '/token/',
        {
          method: 'POST',
          body: loginForm,
        } as object
      )

      if (apiTokenError.value || !apiToken.value) {
        throw apiTokenError.value
      }

      const runtimeConfig = useRuntimeConfig()
      const token: AppStoredToken = {
        ...apiToken.value,
        access_expires: Date.now() + runtimeConfig.public.token.accessExpires,
        refresh_expires: Date.now() + runtimeConfig.public.token.refreshExpires,
      }

      this.token = token
      localStorage.setItem('token', JSON.stringify(this.token))
      return true
    },
    async fetchUser(): Promise<User> {
      const token = this.getToken
      const { data: apiUser, error } = await useAPI<User>('/user/me/', {
        onRequest({ options }) {
          options.headers = {
            Authorization: `Bearer ${token?.access}`,
          }
        },
      })
      if (error.value || !apiUser.value) {
        throw error.value
      }

      this.user = apiUser.value
      localStorage.setItem('user', JSON.stringify(this.user))

      return apiUser.value
    },
    async login(loginForm: LoginForm): Promise<boolean> {
      this.status = 'loading'
      try {
        await this.fetchToken(loginForm)
        await this.fetchUser()
      } catch (error) {
        this.status = 'error'
        throw error
      }
      this.status = 'idle'
      return true
    },
    async register(registerForm: RegisterForm): Promise<boolean> {
      await useAPI('/users/', {
        method: 'POST',
        body: registerForm,
      } as object)
      return true
    },
    async refreshToken(): Promise<APITokenRefresh> {
      this.status = 'loading'
      if (!this.token || Date.now() > this.token.refresh_expires) {
        // make the user login again if the refresh token is expired
        this.logout()
        this.status = 'idle'
        throw new Error('Token expired')
      }
      const { data, error } = await useAPI<APITokenRefresh>('/token/refresh/', {
        method: 'POST',
        body: { refresh: this.token.refresh },
      } as object)

      if (error.value || !data.value) {
        // remove tokens if the refresh token is invalid
        this.logout()
        this.status = 'error'
        throw error.value
      }

      this.token.access = data.value.access

      const runtimeConfig = useRuntimeConfig()
      this.token.access_expires =
        Date.now() + runtimeConfig.public.token.accessExpires

      localStorage.setItem('token', JSON.stringify(this.token))
      this.status = 'idle'
      return data.value
    },
    async checkAndRefreshToken(): Promise<void> {
      if (this.isAccessTokenExpiringSoon) {
        this.refreshTokenPromise = this.refreshToken()

        await this.refreshTokenPromise
          .then(() => {
            this.refreshTokenPromise = null
          })
          .catch(() => {
            this.refreshTokenPromise = null
          })
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
