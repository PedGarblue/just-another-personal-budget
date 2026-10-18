export type CashflowPeriod = 'current_month' | 'this_quarter' | 'this_year'

export interface CashflowMalformedTransaction {
  id: number
  description: string
  date: string
  reason: string
  amount?: number
  currency?: string
}

export interface CashflowSummaryResponse {
  period: CashflowPeriod
  from_date: string
  to_date: string
  income_total_usd: number
  expense_total_usd: number
  free_cash_flow_usd: number
  malformed_transactions: CashflowMalformedTransaction[]
}
