import { ref } from 'vue'
import { fetchAPI } from './useAPI'
import { useAuthStore } from '@/stores/auth'

function withAuthHeaders(
  options: Record<string, unknown>,
  accessToken?: string
): Record<string, unknown> {
  if (!accessToken) {
    return options
  }

  const headers = {
    ...(options.headers as Record<string, string> | undefined),
    Authorization: `Bearer ${accessToken}`,
  }

  return {
    ...options,
    headers,
  }
}

export async function fetchAPIAuth<T>(
  url: string,
  options: Record<string, unknown> = {}
): Promise<T> {
  const authStore = useAuthStore()
  await authStore.ensureValidAccessToken()

  return fetchAPI<T>(url, withAuthHeaders(options, authStore.getToken?.access))
}

/** Same call as fetchAPIAuth, returned as a ref for existing callers. */
export async function useAPIAuth<T>(
  url: string,
  options: Record<string, unknown> = {}
) {
  try {
    const value = await fetchAPIAuth<T>(url, options)
    return { data: ref(value), error: ref<Error | null>(null) }
  } catch (error) {
    return {
      data: ref<T | null>(null),
      error: ref(error instanceof Error ? error : new Error('Request failed')),
    }
  }
}
