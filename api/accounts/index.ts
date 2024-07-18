import { APIResourceResponse } from '~~/types/api'

export interface Account {
  id: number
  name: string
  currency: number
  balance: number
}

export interface AccountForm {
  name: string
  currency: number
}

export interface APIAccountResponse extends APIResourceResponse {
  results: Account[]
}

export default async function (): Promise<APIAccountResponse | null> {
  const urlAccounts = `/accounts/`
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
