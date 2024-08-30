import { useAPI } from '@/composables/useAPI'
import { APITransactionResponse } from '~~/types/transactionTypes'

export interface TransactionBase {
  amount: string
  description: string
  account: number
  category?: number
  date: Date
}

// returns from the api
export interface TransactionAPI extends TransactionBase {
  id: number
}

export interface FetchTransactionsParams {
  page: number
  pageSize: number
  from?: string
  to?: string
  account?: number
  currency?: number
  excludeSameCurrencyTransactions?: boolean
}

export default async function fetchTransactions(
  {
    page,
    pageSize,
    from,
    to,
    account,
    currency,
    excludeSameCurrencyTransactions,
  }: FetchTransactionsParams = {
    page: 1,
    pageSize: 10,
  }
): Promise<APITransactionResponse | null> {
  const runtimeConfig = useRuntimeConfig()
  const params = new URLSearchParams()

  if (page) {
    params.append('page', page.toString())
  }
  if (pageSize) {
    params.append('page_size', pageSize.toString())
  }

  if (from) {
    params.append('start_date', from)
  }
  if (to) {
    params.append('end_date', to)
  }
  if (account) {
    params.append('account', account.toString())
  }
  if (currency) {
    params.append('currency', currency.toString())
  }
  if (excludeSameCurrencyTransactions) {
    params.append('exclude_same_currency_exchanges', 'true')
  }
  const url = `${
    runtimeConfig.public.apiUrl
  }/transactions/?${params.toString()}`
  const { data: transactions } = await useAPI<APITransactionResponse>(url)
  return transactions.value
}

export async function createTransaction(
  data: TransactionBase
): Promise<TransactionAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/`
  const { data: created } = await useAPI<TransactionAPI>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateTransaction(
  pk: number,
  data: TransactionBase
): Promise<TransactionAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  const { data: updated } = await useAPI<TransactionAPI>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function deleteTransaction(pk: number) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  await useAPI(url, {
    method: 'DELETE',
  })
}
