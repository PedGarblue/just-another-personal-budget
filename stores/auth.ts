// store/auth.ts
import { defineStore } from 'pinia'
import { fetchAPI } from '~~/composables/useAPI'
import { toAPIError } from '~~/utils/apiError'
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
    isAccessTokenExpired: (state) =>
      !!state.token && Date.now() > state.token.access_expires,
    isAccessTokenExpiringSoon: (state) =>
      state.token && Date.now() + 60 * 1000 > state.token.access_expires,
    getStatus: (state) => state.status,
    getToken: (state) => state.token,
    getRefreshTokenPromise: (state) => state.refreshTokenPromise,
  },
  actions: {
    async fetchToken(loginForm: LoginForm): Promise<boolean> {
      const apiToken = await fetchAPI<APIToken>('/token/', {
        method: 'POST',
        body: loginForm,
      })

      const runtimeConfig = useRuntimeConfig()
      const token: AppStoredToken = {
        ...apiToken,
        access_expires: Date.now() + runtimeConfig.public.token.accessExpires,
        refresh_expires: Date.now() + runtimeConfig.public.token.refreshExpires,
      }

      this.token = token
      localStorage.setItem('token', JSON.stringify(this.token))
      return true
    },
    async fetchUser(): Promise<User> {
      const token = this.getToken
      const apiUser = await fetchAPI<User>('/user/me/', {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      })

      this.user = apiUser
      localStorage.setItem('user', JSON.stringify(this.user))

      return apiUser
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
      await fetchAPI('/users/', {
        method: 'POST',
        body: registerForm,
      })
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

      try {
        const data = await fetchAPI<APITokenRefresh>('/token/refresh/', {
          method: 'POST',
          body: { refresh: this.token.refresh },
        })

        this.token.access = data.access

        const runtimeConfig = useRuntimeConfig()
        this.token.access_expires =
          Date.now() + runtimeConfig.public.token.accessExpires

        localStorage.setItem('token', JSON.stringify(this.token))
        this.status = 'idle'
        return data
      } catch (error) {
        this.logout()
        this.status = 'error'
        throw toAPIError(error)
      }
    },
    async ensureValidAccessToken(): Promise<void> {
      if (!this.token?.access) return
      if (!this.isAccessTokenExpiringSoon) return

      if (this.refreshTokenPromise) {
        await this.refreshTokenPromise
        return
      }

      this.refreshTokenPromise = this.refreshToken()
      try {
        await this.refreshTokenPromise
      } finally {
        this.refreshTokenPromise = null
      }
    },
    async checkAndRefreshToken(): Promise<void> {
      await this.ensureValidAccessToken()
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
