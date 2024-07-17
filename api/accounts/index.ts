import { APIResourceResponse } from '~~/types/api'

export interface Account {
  id: number
  name: string
  currency: number
  balance: number
}

export interface APIAccountResponse extends APIResourceResponse {
  results: Account[]
}

export default async function (): Promise<APIAccountResponse | null> {
  const urlAccounts = `/accounts/`
  const { data: accounts } = await useAPI<APIAccountResponse>(urlAccounts)
  return accounts.value
}
