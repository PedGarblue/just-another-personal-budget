import type { CategoryAPI } from './categories'
import type { TransactionAPI } from '~~/api/transactions'
import type { AccountComplete } from '~~/stores/accounts'
import type { APIResourceResponse } from '~~/types/api'

export interface APITransactionResponse extends APIResourceResponse {
  results: TransactionAPI[]
}

export interface DisplayTransaction extends TransactionAPI {
  key: number // needed for Vue3EasyDataTable
  dateFormatted: string
  accountData: AccountComplete
  amountWithCurrency: string
  toMainCurrencyAmount?: string
  categoryData?: CategoryAPI
}
