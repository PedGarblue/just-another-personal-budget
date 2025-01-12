import { useAPIAuth } from '~~/composables/useAPIAuth'
import { APIResourceResponse } from '~~/types/api'

export interface Currency {
  id: number
  name: string
  symbol: string
  balance: string
  balance_as_main_currency?: string
  latest_conversion_rate_to_main?: string
}

export interface APICurrencyResponse extends APIResourceResponse {
  results: Currency[]
}

export default async function (): Promise<APICurrencyResponse | null> {
  const urlAccounts = `/currencies/`
  const { data: currencies } = await useAPIAuth<APICurrencyResponse>(
    urlAccounts
  )
  return currencies.value
}
