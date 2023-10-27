import {
  ReportBase,
  IReportUpdateItem,
  IReportApiItem,
} from '~~/types/reportsTypes'

export async function getReportList(): Promise<[IReportApiItem] | null> {
  const runtimeConfig = useRuntimeConfig()
  const query = new URLSearchParams()

  // we will always sort by from_date no need to pass it as a parameter
  // (for now)
  query.append('ordering', '-from_date')

  const url = `${runtimeConfig.public.apiUrl}/reports/?${query.toString()}`
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

export async function updateReport(
  report: IReportUpdateItem
): Promise<IReportApiItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/${report.id}/`
  const { data } = await useFetch<IReportApiItem>(url, {
    method: 'PUT',
    body: JSON.stringify(report),
  })
  return data.value
}
