import { useAPI } from '~~/composables/useAPI'
import type { CategoryAPI, CategoryBase } from '~~/types/categories'

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
  const { data: created } = await useAPI<CategoryAPI>(url, options as object)
  return created.value
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
  const { data: updated } = await useAPI<CategoryAPI>(url, options as object)
  return updated.value
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
  const { data: updated } = await useAPI<CategoryAPI>(url, options as object)
  return updated.value
}

export async function deleteCategory(pk: number) {
  const url = `/categories/${pk}/`
  await useAPI(url, {
    method: 'DELETE',
  })
}
