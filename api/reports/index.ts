import type {
  IReportAccountItem,
  IReportAccountUpdateItem,
  IReportAccountApiItem,
} from '~~/types/reportsTypes'

export async function getReportAccountList(): Promise<
  [IReportAccountApiItem] | null
> {
  const runtimeConfig = useRuntimeConfig()
  const query = new URLSearchParams()

  // we will always sort by from_date no need to pass it as a parameter
  // (for now)
  query.append('ordering', '-from_date')

  const url = `${runtimeConfig.public.apiUrl}/reports/?${query.toString()}`
  const { data } = await useFetch<[IReportAccountApiItem]>(url)
  return data.value
}

export async function createReportByAccount(
  report: IReportAccountItem
): Promise<IReportAccountApiItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/`
  const { data } = await useFetch<IReportAccountApiItem>(url, {
    method: 'POST',
    body: JSON.stringify(report),
  } as object)
  return data.value
}

export async function updateReportByAccount(
  report: IReportAccountUpdateItem
): Promise<IReportAccountApiItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports/${report.id}/`
  const { data } = await useFetch<IReportAccountApiItem>(url, {
    method: 'PUT',
    body: JSON.stringify(report),
  } as object)
  return data.value
}
