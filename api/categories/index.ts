import { CategoryAPI, CategoryBase } from '~~/types/categories'

export async function getCategoryList(): Promise<CategoryAPI[] | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/categories/`
  const { data } = await useFetch<[CategoryAPI]>(url)
  return data.value
}

export async function createCategory(
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/categories/`
  const { data: created } = await useFetch<CategoryAPI>(url, {
    method: 'POST',
    body: data,
  })
  return created.value
}

export async function updateCategory(
  pk: number,
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/categories/${pk}/`
  const { data: updated } = await useFetch<CategoryAPI>(url, {
    method: 'PUT',
    body: data,
  })
  return updated.value
}

export async function patchCategory(
  pk: number,
  data: CategoryBase
): Promise<CategoryAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/categories/${pk}/`
  const { data: updated } = await useFetch<CategoryAPI>(url, {
    method: 'PATCH',
    body: data,
  })
  return updated.value
}

export async function deleteCategory(pk: number) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/categories/${pk}/`
  await useFetch(url, {
    method: 'DELETE',
  })
}
