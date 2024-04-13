import type {
  ProductAPI,
  ProductAPIResponse,
  ProductBase,
  ProductCreate,
  ProductListAPI,
  ProductListAPIResponse,
  ProductListBase,
  ProductListCreate,
  ProductListItemAPI,
  ProductListItemAPIResponse,
  ProductListItemBase,
  ProductListItemCreate,
} from '../../types/products'

export async function getProductIndex(
  baseUrlString: string | null = null,
  { ordering = [] }: { ordering?: Array<string> }
): Promise<ProductAPIResponse | null> {
  const runtimeConfig = useRuntimeConfig()

  const baseUrlStringQuery = baseUrlString
    ? `?${baseUrlString.split('?')[1]}`
    : ''
  const query = new URLSearchParams(baseUrlStringQuery)
  const url = new URL(`${runtimeConfig.public.apiUrl}/products/`)

  query.set('ordering', ordering.join(','))

  if (query.size > 0) {
    url.search = query.toString()
  }

  const { data } = await useFetch<ProductAPIResponse>(url.toString())
  return data.value
}

export async function getProduct(pk: number): Promise<ProductAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products/${pk}/`
  const { data: product } = await useFetch<ProductAPI>(url)
  return product.value
}

export async function createProduct(
  data: ProductCreate
): Promise<ProductAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products/`
  const options = {
    method: 'POST',
    body: data,
  }
  const { data: created } = await useFetch<ProductAPI>(url, options as object)
  return created.value
}

export async function updateProduct(
  pk: number,
  data: ProductBase
): Promise<ProductAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products/${pk}/`
  const options = {
    method: 'PUT',
    body: data,
  }
  const { data: updated } = await useFetch<ProductAPI>(url, options as object)
  return updated.value
}

export async function getProductListIndex(): Promise<ProductListAPIResponse | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list/`
  const { data } = await useFetch<ProductListAPIResponse>(url)
  return data.value
}

export async function getProductList(
  pk: number
): Promise<ProductListAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list/${pk}/`
  const { data: product } = await useFetch<ProductListAPI>(url)
  return product.value
}

export async function createProductList(
  data: ProductListCreate
): Promise<ProductListAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list/`
  const { data: created } = await useFetch<ProductListAPI>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateProductList(
  pk: number,
  data: ProductListBase
): Promise<ProductListAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list/${pk}/`
  const { data: updated } = await useFetch<ProductListAPI>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function getProductListItemIndex(
  productListId: number | null = null,
  {
    page = 1,
    limit = 10,
    ordering = [],
  }: { page?: number; limit?: number; ordering?: Array<string> }
): Promise<ProductListItemAPIResponse | null> {
  const runtimeConfig = useRuntimeConfig()
  const query = new URLSearchParams()
  if (productListId) {
    query.set('product_list', productListId.toString())
  }

  query.set('page', page.toString())
  query.set('page_size', limit.toString())
  query.set('ordering', ordering?.join(','))

  const url = `${
    runtimeConfig.public.apiUrl
  }/products-list-item/?${query.toString()}`
  const { data } = await useFetch<ProductListItemAPIResponse>(url)
  return data.value
}

export async function getProductListItem(
  pk: number
): Promise<ProductListItemAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list-item/${pk}/`
  const { data: product } = await useFetch<ProductListItemAPI>(url)
  return product.value
}

export async function createProductListItem(
  data: ProductListItemCreate
): Promise<ProductListItemAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list-item/`
  const { data: created } = await useFetch<ProductListItemAPI>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateProductListItem(
  pk: number,
  data: ProductListItemBase
): Promise<ProductListItemAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list-item/${pk}/`
  const { data: updated } = await useFetch<ProductListItemAPI>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function deleteProduct(pk: number): Promise<boolean> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products/${pk}/`
  await useFetch(url, {
    method: 'DELETE',
  })
  return true
}

export async function deleteProductListItem(pk: number): Promise<boolean> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/products-list-item/${pk}/`
  await useFetch(url, {
    method: 'DELETE',
  })
  return true
}
