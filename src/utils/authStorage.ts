import type { AppStoredToken, User } from '@/types/auth'
import { readJwtExpiryMs } from '@/utils/jwt'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) return false
  const user = value as Partial<User>
  return typeof user.id === 'number' && typeof user.username === 'string'
}

function isTokenShape(
  value: unknown
): value is { access: string; refresh: string } & Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false
  const token = value as Partial<AppStoredToken>
  return typeof token.access === 'string' && typeof token.refresh === 'string'
}

function readJson(key: string): unknown | undefined {
  const raw = localStorage.getItem(key)
  if (raw == null) return undefined

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(key)
    return undefined
  }
}

export function loadStoredUser(): User | null {
  const parsed = readJson(USER_KEY)
  if (parsed === undefined) return null
  if (!isUser(parsed)) {
    localStorage.removeItem(USER_KEY)
    return null
  }
  return parsed
}

export function loadStoredToken(): AppStoredToken | null {
  const parsed = readJson(TOKEN_KEY)
  if (parsed === undefined) return null
  if (!isTokenShape(parsed)) {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }

  const accessExpires =
    readJwtExpiryMs(parsed.access) ?? finiteNumber(parsed.access_expires)
  const refreshExpires =
    readJwtExpiryMs(parsed.refresh) ?? finiteNumber(parsed.refresh_expires)

  if (accessExpires == null || refreshExpires == null) {
    localStorage.removeItem(TOKEN_KEY)
    return null
  }

  const token: AppStoredToken = {
    access: parsed.access,
    refresh: parsed.refresh,
    access_expires: accessExpires,
    refresh_expires: refreshExpires,
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
  return token
}
