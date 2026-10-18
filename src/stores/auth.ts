// store/auth.ts
import { defineStore } from 'pinia'
import { fetchAPI } from '@/composables/useAPI'
import { tokenLifetime } from '@/config'
import { loadStoredToken, loadStoredUser } from '@/utils/authStorage'
import { toAPIError } from '@/utils/apiError'
import { readJwtExpiryMs } from '@/utils/jwt'
import {
  AuthState,
  APIToken,
  APITokenRefresh,
  LoginForm,
  User,
  AppStoredToken,
  RegisterForm,
} from '@/types/auth'

function expiryFromJwt(token: string, fallbackMs: number): number {
  return readJwtExpiryMs(token) ?? Date.now() + fallbackMs
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: loadStoredUser(),
    token: loadStoredToken(),
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

      const token: AppStoredToken = {
        ...apiToken,
        access_expires: expiryFromJwt(
          apiToken.access,
          tokenLifetime.accessExpires
        ),
        refresh_expires: expiryFromJwt(
          apiToken.refresh,
          tokenLifetime.refreshExpires
        ),
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
        this.token.access_expires = expiryFromJwt(
          data.access,
          tokenLifetime.accessExpires
        )

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
