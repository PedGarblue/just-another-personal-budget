import type {
  CategoryTrendResponse,
  CategoryTrendParams,
} from '~~/types/categoryTrend'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export async function getCategoryTrend(
  params: CategoryTrendParams
): Promise<CategoryTrendResponse | null> {
  const query = new URLSearchParams()
  query.append('category', String(params.category))
  query.append('start_date', params.start_date)
  query.append('end_date', params.end_date)

  if (params.granularity) {
    query.append('granularity', params.granularity)
  }
  if (params.exclude_categories) {
    query.append('exclude_categories', params.exclude_categories)
  }
  if (params.include_categories) {
    query.append('include_categories', params.include_categories)
  }

  const url = `/category-trend/?${query.toString()}`
  const { data } = await useAPI<CategoryTrendResponse>(url)
  return data.value
}
