import type { CategoryAPI } from './categories'
import type {
  TransactionAPI,
  TransactionGroupAPI,
  TransactionListItem,
} from '@/api/transactions'
import type { AccountComplete } from '@/stores/accounts'
import type { APIResourceResponse } from '@/types/api'

export interface APITransactionResponse extends APIResourceResponse {
  results: TransactionListItem[]
}

export interface DisplayTransaction extends TransactionAPI {
  type?: 'transaction'
  /** Stable Vue3EasyDataTable / Vue key */
  key: string | number
  dateFormatted: string
  accountData: AccountComplete
  amountWithCurrency: string
  toMainCurrencyAmount?: string
  categoryData?: CategoryAPI
  /** Loan vs collection label when linked to a receivable */
  receivableDisplay: string
}

export interface DisplayTransactionGroup extends TransactionGroupAPI {
  type: 'group'
  key: string
  dateFormatted: string
  /** Shown in the description column */
  description: string
  /** Native total with currency symbol, or em dash when mixed/unknown */
  amountWithCurrency: string
  /** Formatted main-currency total or em dash */
  toMainCurrencyAmount: string
  /** Count label for the category/count column */
  countDisplay: string
  accountData?: undefined
  categoryData?: undefined
  receivableDisplay: string
}

export type DisplayTransactionListItem =
  | DisplayTransaction
  | DisplayTransactionGroup

export type { TransactionListItem }
