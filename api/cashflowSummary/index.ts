import type {
  CashflowPeriod,
  CashflowSummaryResponse,
} from '~~/types/cashflowSummary'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export async function getCashflowSummary(
  period: CashflowPeriod = 'current_month'
): Promise<CashflowSummaryResponse | null> {
  const query = new URLSearchParams()
  query.append('period', period)

  const url = `/cashflow-summary/?${query.toString()}`
  const { data } = await useAPI<CashflowSummaryResponse>(url)
  return data.value
}
