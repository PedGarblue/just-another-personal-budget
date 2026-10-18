import { describe, expect, it } from 'vitest'
import { readJwtExpiryMs } from '../src/utils/jwt'

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

describe('readJwtExpiryMs', () => {
  it('reads exp as milliseconds', () => {
    const exp = 1_700_000_000
    expect(readJwtExpiryMs(makeJwt({ exp }))).toBe(exp * 1000)
  })

  it('returns null when exp is missing', () => {
    expect(readJwtExpiryMs(makeJwt({ sub: 'user' }))).toBeNull()
  })

  it('returns null for a non-JWT string', () => {
    expect(readJwtExpiryMs('not-a-jwt')).toBeNull()
  })
})
