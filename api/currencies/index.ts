import { useAuthStore } from '~~/stores/auth'
import { APIResourceResponse } from '~~/types/api'

export type AssetKind = 'fiat' | 'crypto'

export interface Currency {
  id: number
  name: string
  symbol: string
  balance: string
  balance_as_main_currency?: string | null
  latest_conversion_rate_to_main?: number | null
  asset_kind?: AssetKind
  default_decimal_places?: number
}

export interface APICurrencyResponse extends APIResourceResponse {
  results: Currency[]
}

export default async function (): Promise<APICurrencyResponse | null> {
  const authStore = useAuthStore()
  if (authStore.getRefreshTokenPromise) {
    await authStore.getRefreshTokenPromise
  }

  const api = useNuxtApp().$api

  let nextUrl: string | null = '/currencies/'
  const results: Currency[] = []
  let count = 0

  while (nextUrl) {
    const headers: Record<string, string> = {}
    if (authStore.getToken?.access) {
      headers.Authorization = `Bearer ${authStore.getToken.access}`
    }
    const page = await api<APICurrencyResponse>(nextUrl, { headers })
    results.push(...page.results)
    count = page.count
    nextUrl = page.next
  }

  return {
    count,
    next: null,
    previous: null,
    results,
  }
}
