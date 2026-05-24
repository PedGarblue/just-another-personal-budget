import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'
import type { CategoryAPI, CategoryBase } from '~~/types/categories'
import { assertAPIOk, unwrapAPIResponse } from '~~/utils/apiError'

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
  const result = await useAPI<CategoryAPI>(url, options as object)
  return unwrapAPIResponse(result)
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
  const result = await useAPI<CategoryAPI>(url, options as object)
  return unwrapAPIResponse(result)
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
  const result = await useAPI<CategoryAPI>(url, options as object)
  return unwrapAPIResponse(result)
}

export async function deleteCategory(pk: number) {
  const url = `/categories/${pk}/`
  const result = await useAPI(url, {
    method: 'DELETE',
  })
  assertAPIOk(result)
}
