import { APIResourceResponse } from '~~/types/api'

export interface Currency {
  id: number
  name: string
  symbol: string
  balance: number
}

export interface APICurrencyResponse extends APIResourceResponse {
  results: Currency[]
}

export default async function (): Promise<APICurrencyResponse | null> {
  const urlAccounts = `/currencies/`
  const { data: currencies } = await useAPI<APICurrencyResponse>(urlAccounts)
  return currencies.value
}
