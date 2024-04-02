import type { CategoryAPI } from './categories'
import type { TransactionAPI } from '~~/api/transactions'
import type { AccountComplete } from '~~/stores/accounts'

export interface DisplayTransaction extends TransactionAPI {
  key: number // needed for Vue3EasyDataTable
  dateFormatted: string
  accountData: AccountComplete
  amountWithCurrency: string
  categoryData?: CategoryAPI
}
