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
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export async function getProductIndex(
  baseUrlString: string | null = null,
  {
    ordering = [],
    search = '',
    category = undefined,
    idsIn = undefined,
    minPrice = undefined,
    maxPrice = undefined,
  }: {
    ordering?: Array<string>
    search?: string
    category?: number
    minPrice?: number
    maxPrice?: number
    idsIn?: Array<number>
  }
): Promise<ProductAPIResponse | null> {
  const baseUrlStringQuery =
    baseUrlString && baseUrlString.includes('?')
      ? `?${baseUrlString.split('?')[1]}`
      : ''
  const query = new URLSearchParams(baseUrlStringQuery)

  query.set('ordering', ordering.join(','))
  query.set('search', search)
  if (category) {
    query.set('category', category.toString())
  }
  if (minPrice) {
    query.set('min_price', minPrice.toString())
  }
  if (maxPrice) {
    query.set('max_price', maxPrice.toString())
  }
  if (idsIn) {
    query.set('id', idsIn.join(','))
  }

  let url = `/products/`

  if (query.size > 0) {
    url = `${url}?${query.toString()}`
  }

  const { data } = await useAPI<ProductAPIResponse>(url.toString())
  return data.value
}

export async function getProduct(pk: number): Promise<ProductAPI | null> {
  const url = `/products/${pk}/`
  const { data: product } = await useAPI<ProductAPI>(url)
  return product.value
}

export async function createProduct(
  data: ProductCreate
): Promise<ProductAPI | null> {
  const url = `/products/`
  const options = {
    method: 'POST',
    body: data,
  }
  const { data: created } = await useAPI<ProductAPI>(url, options as object)
  return created.value
}

export async function updateProduct(
  pk: number,
  data: ProductBase
): Promise<ProductAPI | null> {
  const url = `/products/${pk}/`
  const options = {
    method: 'PUT',
    body: data,
  }
  const { data: updated } = await useAPI<ProductAPI>(url, options as object)
  return updated.value
}

export async function getProductListIndex(): Promise<ProductListAPIResponse | null> {
  const query = new URLSearchParams()
  query.append('ordering', '-updated_at')
  const url = `/products-list/?${query.toString()}`
  const { data } = await useAPI<ProductListAPIResponse>(url)
  return data.value
}

export async function getProductList(
  pk: number
): Promise<ProductListAPI | null> {
  const url = `/products-list/${pk}/`
  const { data: product } = await useAPI<ProductListAPI>(url)
  return product.value
}

export async function createProductList(
  data: ProductListCreate
): Promise<ProductListAPI | null> {
  const url = `/products-list/`
  const { data: created } = await useAPI<ProductListAPI>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateProductList(
  pk: number,
  data: ProductListBase
): Promise<ProductListAPI | null> {
  const url = `/products-list/${pk}/`
  const { data: updated } = await useAPI<ProductListAPI>(url, {
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
  const query = new URLSearchParams()
  if (productListId) {
    query.set('product_list', productListId.toString())
  }

  query.set('page', page.toString())
  query.set('page_size', limit.toString())
  query.set('ordering', ordering?.join(','))

  const url = `/products-list-item/?${query.toString()}`
  const { data } = await useAPI<ProductListItemAPIResponse>(url)
  return data.value
}

export async function getProductListItem(
  pk: number
): Promise<ProductListItemAPI | null> {
  const url = `/products-list-item/${pk}/`
  const { data: product } = await useAPI<ProductListItemAPI>(url)
  return product.value
}

export async function createProductListItem(
  data: ProductListItemCreate
): Promise<ProductListItemAPI | null> {
  const url = `/products-list-item/`
  const { data: created } = await useAPI<ProductListItemAPI>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateProductListItem(
  pk: number,
  data: ProductListItemBase
): Promise<ProductListItemAPI | null> {
  const url = `/products-list-item/${pk}/`
  const { data: updated } = await useAPI<ProductListItemAPI>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function deleteProduct(pk: number): Promise<boolean> {
  const url = `/products/${pk}/`
  await useAPI(url, {
    method: 'DELETE',
  })
  return true
}

export async function deleteProductListItem(pk: number): Promise<boolean> {
  const url = `/products-list-item/${pk}/`
  await useAPI(url, {
    method: 'DELETE',
  })
  return true
}
