import { AccountComplete } from '~~/stores/accounts'

export interface ReportBase {
  from_date: string
  to_date: string
  account: number
}

export interface IReportUpdateItem extends ReportBase {
  id: number
}
export interface IReportApiItem extends ReportBase {
  id: number
  initial_balance: number
  end_balance: number
  balance_status: string
  total_income: number
  total_expense: number
}

export interface IReportDisplayItem extends IReportApiItem {
  key: number
  accountData: AccountComplete
}
