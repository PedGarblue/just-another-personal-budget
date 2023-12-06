import { Currency } from '~~/api/currencies'
import { AccountComplete } from '~~/stores/accounts'

export interface ReportBase {
  from_date: string
  to_date: string
}

export interface IReportAccountItem extends ReportBase {
  account: number
}

export interface IReportCurrencyItem extends ReportBase {
  currency: number
}

export interface IReportAccountUpdateItem extends IReportAccountItem {
  id: number
}
export interface IReportCurrencyUpdateItem extends IReportCurrencyItem {
  id: number
}
export interface IReportApiItem {
  id: number
  initial_balance: string
  end_balance: string
  balance_status: string
  total_income: string
  total_expenses: string
}

export interface IReportAccountApiItem
  extends IReportApiItem,
    IReportAccountItem {}
export interface IReportCurrencyApiItem
  extends IReportApiItem,
    IReportCurrencyItem {}

export interface IReportAccountDisplayItem extends IReportAccountApiItem {
  key: number
  accountData: AccountComplete
}
export interface IReportCurrencyDisplayItem extends IReportCurrencyApiItem {
  key: number
  currencyData: Currency
}
