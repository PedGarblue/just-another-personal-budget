import {
  ReportBase,
  IReportCurrencyItem,
  IReportCurrencyUpdateItem,
  IReportCurrencyApiItem,
} from '~~/types/reportsTypes'

export async function getReportByCurrencyList(): Promise<
  [IReportCurrencyApiItem] | null
> {
  const runtimeConfig = useRuntimeConfig()
  const query = new URLSearchParams()

  // we will always sort by from_date no need to pass it as a parameter
  // (for now)
  query.append('ordering', '-from_date')

  const url = `${
    runtimeConfig.public.apiUrl
  }/reports-currency/?${query.toString()}`
  const { data } = await useFetch<[IReportCurrencyApiItem]>(url)
  return data.value
}

export async function createReportByCurrency(
  report: IReportCurrencyItem
): Promise<IReportCurrencyApiItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/reports-currency/`
  const { data } = await useFetch<IReportCurrencyApiItem>(url, {
    method: 'POST',
    body: JSON.stringify(report),
  })
  return data.value
}
