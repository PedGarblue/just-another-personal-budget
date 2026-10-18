import { fetchAPIAuth, useAPIAuth as useAPI } from '@/composables/useAPIAuth'
import type { CategoryAPI, CategoryBase } from '@/types/categories'

export async function getCategoryList(): Promise<CategoryAPI[] | null> {
  const url = `/categories/`
  const { data } = await useAPI<[CategoryAPI]>(url)
  return data.value
}

export async function createCategory(
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const url = `/categories/`
  const options = {
    method: 'POST',
    body: data,
  }
  return await fetchAPIAuth<CategoryAPI>(url, options)
}

export async function updateCategory(
  pk: number,
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const url = `/categories/${pk}/`
  const options = {
    method: 'PUT',
    body: data,
  }
  return await fetchAPIAuth<CategoryAPI>(url, options)
}

export async function patchCategory(
  pk: number,
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const url = `/categories/${pk}/`
  const options = {
    method: 'PATCH',
    body: data,
  }
  return await fetchAPIAuth<CategoryAPI>(url, options)
}

export async function deleteCategory(pk: number) {
  const url = `/categories/${pk}/`
  await fetchAPIAuth(url, {
    method: 'DELETE',
  })
}
