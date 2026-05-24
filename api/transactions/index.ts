import { fetchAPIAuth, useAPIAuth as useAPI } from '@/composables/useAPIAuth'
import type { ProductAPI } from '~~/types/products'
import type { APITransactionResponse } from '~~/types/transactionTypes'

export interface TransactionItemBase {
  product: number
  amount: number
}

export interface TransactionBase {
  amount: string | number
  to_main_currency_amount?: string
  description: string
  account: number
  category?: number
  date: Date | string
  transaction_items?: TransactionItemBase[]
  /** Loan expense: negative amount + is_loan + contact */
  is_loan?: boolean
  contact?: string
  /** ISO date string (date-only); backend may default from transaction date */
  loan_due_date?: string
  /** Debt collection: income linked to receivable */
  receivable?: number | null
}

// returns from the api
export interface TransactionAPI
  extends Omit<TransactionBase, 'is_loan' | 'loan_due_date'> {
  id: number
  contact_id?: number
}

export interface FetchTransactionsParams {
  page: number
  pageSize: number
  from?: string
  to?: string
  account?: number
  currency?: number
  excludeSameCurrencyTransactions?: boolean
  category?: number
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
    category,
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
  if (category) {
    params.append('category', category.toString())
  }
  const url = `${
    runtimeConfig.public.apiUrl
  }/transactions/?${params.toString()}`
  const { data: transactions } = await useAPI<APITransactionResponse>(url)
  return transactions.value
}

export async function createTransaction(
  data: TransactionBase,
  items: ProductAPI[] = []
): Promise<TransactionAPI[]> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/`
  const value = await fetchAPIAuth<TransactionAPI | TransactionAPI[]>(url, {
    method: 'POST',
    body: {
      ...data,
      transaction_items: items.map((item) => ({
        product: item.id,
        amount: 1,
      })),
    },
  })
  return Array.isArray(value) ? value : [value]
}

export async function updateTransaction(
  pk: number,
  data: TransactionBase,
  items: ProductAPI[] = []
): Promise<TransactionAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  return await fetchAPIAuth<TransactionAPI>(url, {
    method: 'PUT',
    body: {
      ...data,
      transaction_items: items.map((item) => ({
        product: item.id,
        amount: 1,
      })),
    },
  })
}

export async function deleteTransaction(pk: number) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  await fetchAPIAuth(url, {
    method: 'DELETE',
  })
}
