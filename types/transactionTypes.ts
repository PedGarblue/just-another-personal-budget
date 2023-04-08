import { TransactionAPI } from '~~/api/transactions'
import { AccountComplete } from '~~/stores/accounts'

export interface DisplayTransaction extends TransactionAPI {
  key: number // needed for Vue3EasyDataTable
  dateFormatted: string
  accountData: AccountComplete
  amountWithCurrency: string
}
