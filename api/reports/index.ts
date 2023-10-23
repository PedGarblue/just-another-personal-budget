import { ReportBase } from '~~/types/reportsTypes'

export interface IReportViewItem extends ReportBase {
  id: number
  initial_balance: number
  end_balance: number
  total_income: number
  total_expense: number
}

export async function getReportList(): Promise<[IReportViewItem] | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/`
  const { data } = await useFetch<[IReportViewItem]>(url)
  return data.value
}
