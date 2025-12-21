import type { ExpensesSummaryResponse, ExpensesPeriod } from '~~/types/expenses'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export async function getExpensesSummary(
  period: ExpensesPeriod = 'current_month'
): Promise<ExpensesSummaryResponse | null> {
  const query = new URLSearchParams()
  query.append('period', period)

  const url = `/expenses-summary/?${query.toString()}`
  const { data } = await useAPI<ExpensesSummaryResponse>(url)
  return data.value
}
