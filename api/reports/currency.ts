import type {
  IReportCurrencyItem,
  IReportCurrencyUpdateItem,
  IReportCurrencyApiItem,
} from '~~/types/reportsTypes'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export async function getReportByCurrencyList(): Promise<
  [IReportCurrencyApiItem] | null
> {
  const query = new URLSearchParams()

  // we will always sort by from_date no need to pass it as a parameter
  // (for now)
  query.append('ordering', '-from_date')

  const url = `/reports-currency/?${query.toString()}`
  const { data } = await useAPI<[IReportCurrencyApiItem]>(url)
  return data.value
}

export async function createReportByCurrency(
  report: IReportCurrencyItem
): Promise<IReportCurrencyApiItem | null> {
  const url = `/reports-currency/`
  const { data } = await useAPI<IReportCurrencyApiItem>(url, {
    method: 'POST',
    body: JSON.stringify(report),
  } as object)
  return data.value
}

export async function updateReportByCurrency(
  report: IReportCurrencyUpdateItem
): Promise<IReportCurrencyApiItem | null> {
  const url = `/reports-currency/${report.id}/`
  const { data } = await useAPI<IReportCurrencyApiItem>(url, {
    method: 'PUT',
    body: JSON.stringify(report),
  } as object)
  return data.value
}
