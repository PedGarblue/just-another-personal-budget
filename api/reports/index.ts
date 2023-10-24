import { ReportBase, IReportApiItem } from '~~/types/reportsTypes'

export async function getReportList(): Promise<[IReportApiItem] | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/`
  const { data } = await useFetch<[IReportApiItem]>(url)
  return data.value
}

export async function createReport(
  report: ReportBase
): Promise<IReportApiItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/`
  const { data } = await useFetch<IReportApiItem>(url, {
    method: 'POST',
    body: JSON.stringify(report),
  })
  return data.value
}
