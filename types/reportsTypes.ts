import { AccountComplete } from '~~/stores/accounts'

export interface ReportBase {
  from_date: string
  to_date: string
  account: number
}

export interface IReportApiItem extends ReportBase {
  id: number
  initial_balance: number
  end_balance: number
  total_income: number
  total_expense: number
}

export interface IReportDisplayItem extends IReportApiItem {
  key: number
  accountData: AccountComplete
}
