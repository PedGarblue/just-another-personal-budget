import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { loadStoredToken, loadStoredUser } from '../src/utils/authStorage'

function encodeSegment(value: object): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = encodeSegment({ alg: 'none', typ: 'JWT' })
  return `${header}.${encodeSegment(payload)}.sig`
}

function installStorage() {
  const store = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return store.size
    },
    clear() {
      store.clear()
    },
    getItem(key) {
      return store.has(key) ? store.get(key)! : null
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null
    },
    removeItem(key) {
      store.delete(key)
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
  }
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
  })
}

describe('auth storage', () => {
  beforeEach(() => {
    installStorage()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('drops corrupt token JSON', () => {
    localStorage.setItem('token', '{not json')
    expect(loadStoredToken()).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('loads a well-formed token and rewrites expiry from the JWT', () => {
    const accessExp = 1_800_000_000
    const refreshExp = 1_900_000_000
    localStorage.setItem(
      'token',
      JSON.stringify({
        access: makeJwt({ exp: accessExp }),
        refresh: makeJwt({ exp: refreshExp }),
        access_expires: 1,
        refresh_expires: 2,
      })
    )

    const token = loadStoredToken()
    expect(token?.access_expires).toBe(accessExp * 1000)
    expect(token?.refresh_expires).toBe(refreshExp * 1000)

    const stored = JSON.parse(localStorage.getItem('token') || '{}')
    expect(stored.access_expires).toBe(accessExp * 1000)
    expect(stored.refresh_expires).toBe(refreshExp * 1000)
  })

  it('drops a token with no usable expiry', () => {
    localStorage.setItem(
      'token',
      JSON.stringify({ access: 'opaque', refresh: 'opaque' })
    )
    expect(loadStoredToken()).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('drops corrupt user JSON', () => {
    localStorage.setItem('user', '{not json')
    expect(loadStoredUser()).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })
})
