import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { assertAPIOk, toAPIError, unwrapAPIResponse } from '../utils/apiError'

describe('toAPIError', () => {
  it('returns the same Error instance', () => {
    const error = new Error('Invalid credentials')
    expect(toAPIError(error)).toBe(error)
  })

  it('formats FetchError-like objects with a message', () => {
    const error = toAPIError({
      message: '[POST] "/token/": 401 Unauthorized',
    })
    expect(error.message).toBe('[POST] "/token/": 401 Unauthorized')
  })

  it('formats validation payloads from real FetchError instances', async () => {
    const { FetchError } = await import('ofetch')
    const fetchError = new FetchError(
      '[PUT] "http://localhost:8000/api/v1/transactions/2186/": 400 Bad Request'
    )
    fetchError.data = {
      contact: ['No open receivables for this contact.'],
    }

    expect(toAPIError(fetchError).message).toBe(
      'contact: No open receivables for this contact.'
    )
  })

  it('formats DRF validation payloads on plain objects', () => {
    const error = toAPIError({
      data: {
        amount: ['This field is required.'],
        non_field_errors: ['Unable to save transaction.'],
      },
    })
    expect(error.message).toBe(
      'amount: This field is required., Unable to save transaction.'
    )
  })

  it('falls back to a generic message for unknown values', () => {
    expect(toAPIError(null).message).toBe('Request failed')
  })
})

describe('unwrapAPIResponse', () => {
  it('returns data when the request succeeds', () => {
    const result = unwrapAPIResponse({
      data: ref({ id: 1 }),
      error: ref(null),
    })

    expect(result).toEqual({ id: 1 })
  })

  it('throws when the API returns an error', () => {
    expect(() =>
      unwrapAPIResponse({
        data: ref(null),
        error: ref(new Error('Bad Request')),
      })
    ).toThrow('Bad Request')
  })

  it('throws when data is null without an error', () => {
    expect(() =>
      unwrapAPIResponse({
        data: ref(null),
        error: ref(null),
      })
    ).toThrow('Request failed')
  })
})

describe('assertAPIOk', () => {
  it('does nothing when there is no error', () => {
    expect(() =>
      assertAPIOk({
        error: ref(null),
      })
    ).not.toThrow()
  })

  it('throws when there is an error', () => {
    expect(() =>
      assertAPIOk({
        error: ref(new Error('Delete failed')),
      })
    ).toThrow('Delete failed')
  })
})
