export type CashflowPeriod = 'current_month' | 'this_quarter' | 'this_year'

export interface CashflowMalformedTransaction {
  id: number
  description: string
  date: string
  reason: string
  amount?: string
  currency?: string
}

export interface CashflowSummaryResponse {
  period: CashflowPeriod
  from_date: string
  to_date: string
  income_total_usd: string
  expense_total_usd: string
  free_cash_flow_usd: string
  malformed_transactions: CashflowMalformedTransaction[]
}
