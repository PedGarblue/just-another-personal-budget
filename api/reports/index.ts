import type {
  IReportAccountItem,
  IReportAccountUpdateItem,
  IReportAccountApiItem,
} from '~~/types/reportsTypes'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'
import { unwrapAPIResponse } from '~~/utils/apiError'

export async function getReportAccountList(): Promise<
  [IReportAccountApiItem] | null
> {
  const query = new URLSearchParams()
  // we will always sort by from_date no need to pass it as a parameter
  // (for now)
  query.append('ordering', '-from_date')

  const url = `/reports/?${query.toString()}`
  const { data } = await useAPI<[IReportAccountApiItem]>(url)
  return data.value
}

export async function createReportByAccount(
  report: IReportAccountItem
): Promise<IReportAccountApiItem | null> {
  const url = `/reports/`
  const result = await useAPI<IReportAccountApiItem>(url, {
    method: 'POST',
    body: JSON.stringify(report),
  } as object)
  return unwrapAPIResponse(result)
}

export async function updateReportByAccount(
  report: IReportAccountUpdateItem
): Promise<IReportAccountApiItem | null> {
  const url = `/reports/${report.id}/`
  const result = await useAPI<IReportAccountApiItem>(url, {
    method: 'PUT',
    body: JSON.stringify(report),
  } as object)
  return unwrapAPIResponse(result)
}
