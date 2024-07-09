export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface APIToken {
  refresh: string
  access: string
}

export interface AppStoredToken extends APIToken {
  access_expires: number
  refresh_expires: number
}

export interface APITokenRefresh {
  access: string
}

export interface AuthState {
  user: User | null
  token: AppStoredToken | null
}
