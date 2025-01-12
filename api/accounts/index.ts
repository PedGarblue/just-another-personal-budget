import { APIResourceResponse } from '~~/types/api'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export interface Account {
  id: number
  name: string
  currency: number
  balance: string
  balance_as_main_currency?: string
}

export interface AccountForm {
  name: string
  currency: number
}

export interface APIAccountResponse extends APIResourceResponse {
  results: Account[]
}

export default async function (): Promise<APIAccountResponse | null> {
  const queryParams = new URLSearchParams()
  queryParams.set('page_size', '20')
  const urlAccounts = `/accounts/?${queryParams.toString()}`
  const { data: accounts } = await useAPI<APIAccountResponse>(urlAccounts)
  return accounts.value
}

export async function createAccount(
  form: AccountForm
): Promise<Account | null> {
  const urlAccounts = `/accounts/`
  const { data: account } = await useAPI<Account>(urlAccounts, {
    method: 'POST',
    body: form,
  } as object)
  return account.value
}
