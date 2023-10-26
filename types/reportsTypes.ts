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
  initial_balance: string
  end_balance: string
  balance_status: string
  total_income: string
  total_expenses: string
}

export interface IReportDisplayItem extends IReportApiItem {
  key: number
  accountData: AccountComplete
}
