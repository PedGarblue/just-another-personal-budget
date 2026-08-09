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
  /** Discriminator for mixed feed; missing type is treated as transaction */
  type?: 'transaction'
  id: number
  contact_id?: number
  /** Nullable group PK when this transaction belongs to a group */
  group?: number | null
}

/** Collapsed group row in the mixed transaction feed */
export interface TransactionGroupAPI {
  type: 'group'
  id: number
  name: string
  date: string
  transaction_count: number
  /** USD / main-currency total, or null if any member lacks conversion */
  total_main_currency_amount: string | null
  /** Native total when all members share one currency; otherwise null */
  total_amount?: string | null
  /** Currency PK when total_amount is set; otherwise null */
  currency?: number | null
}

export type TransactionListItem = TransactionAPI | TransactionGroupAPI

export function isTransactionItem(
  item: TransactionListItem
): item is TransactionAPI {
  return item.type !== 'group'
}

export function isGroupItem(
  item: TransactionListItem
): item is TransactionGroupAPI {
  return item.type === 'group'
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
  /** When set, returns only that group's member transactions (no collapse) */
  group?: number
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
    group,
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
  if (group) {
    params.append('group', group.toString())
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

/** Create a group and bind member transactions' group_id in one request */
export interface CreateTransactionGroupBody {
  group: true
  name: string
  /** Optional; backend defaults to the oldest member transaction date */
  date?: string
  transactions: number[]
}

export async function createTransactionGroup(
  body: CreateTransactionGroupBody
): Promise<TransactionGroupAPI> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/`
  return await fetchAPIAuth<TransactionGroupAPI>(url, {
    method: 'POST',
    body,
  })
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
