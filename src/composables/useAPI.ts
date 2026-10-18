import { api } from '@/api/client'
import { toAPIError } from '@/utils/apiError'

export async function fetchAPI<T>(
  url: string,
  options: Record<string, unknown> = {}
): Promise<T> {
  try {
    return await api<T>(url, options)
  } catch (error) {
    throw toAPIError(error)
  }
}
