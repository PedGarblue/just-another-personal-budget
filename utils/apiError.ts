import type { Ref } from 'vue'

type APIResult<T> = {
  data: Ref<T | null>
  error: Ref<Error | null>
}

function formatValidationMessages(data: unknown): string | null {
  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (Array.isArray(data)) {
    const messages = data
      .map((item) => formatValidationMessages(item))
      .filter((message): message is string => !!message)
    return messages.length > 0 ? messages.join(', ') : null
  }

  if (typeof data === 'object' && data !== null) {
    const messages = Object.entries(data).flatMap(([field, value]) => {
      const formatted = formatValidationMessages(value)
      if (!formatted) return []
      return field === 'detail' || field === 'non_field_errors'
        ? [formatted]
        : [`${field}: ${formatted}`]
    })
    return messages.length > 0 ? messages.join(', ') : null
  }

  return null
}

export function toAPIError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }

  if (typeof error === 'string' && error.trim()) {
    return new Error(error)
  }

  if (typeof error === 'object' && error !== null) {
    const fetchError = error as {
      data?: unknown
      message?: string
      statusMessage?: string
      status?: number
    }

    const validationMessage = formatValidationMessages(fetchError.data)
    if (validationMessage) {
      return new Error(validationMessage)
    }

    if (fetchError.message) {
      return new Error(fetchError.message)
    }

    if (fetchError.statusMessage) {
      return new Error(fetchError.statusMessage)
    }

    if (fetchError.status) {
      return new Error(`Request failed with status ${fetchError.status}`)
    }
  }

  return new Error('Request failed')
}

export function unwrapAPIResponse<T>(result: APIResult<T>): T {
  if (result.error.value) {
    throw toAPIError(result.error.value)
  }

  if (result.data.value == null) {
    throw new Error('Request failed')
  }

  return result.data.value
}

export function assertAPIOk(result: Pick<APIResult<unknown>, 'error'>): void {
  if (result.error.value) {
    throw toAPIError(result.error.value)
  }
}
