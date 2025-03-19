import type { APIResourceResponse } from './api'

export interface ProductBase {
  name: string
  description?: string
  cost: string
  status: string
  category?: number
  created_at: string
  update_at: string
}

export interface ProductAPI extends ProductBase {
  id: number
}

export interface ProductListBase {
  name: string
  total: number
  description?: string
  perid_type?: string
  period_start?: string
  period_end?: string
  created_at: string
  update_at: string
}

// Create

export interface ProductCreate {
  name: string
  description?: string
  category?: number
  cost: string
}

export interface ProductListCreate {
  name: string
  description?: string
  period_type: string
  period_start?: string
  period_end?: string
}

export interface ProductListItemCreate {
  product_list: number
  product: number
  quantity: number
}

export interface ProductListAPI extends ProductListBase {
  id: number
}

export interface ProductListItemBase {
  product: number
  product_name: string
  product_cost: string
  product_list: number
  product__category: string
  product_category_color: string
  quantity: number
  total: number
  created_at: string
  update_at: string
}

export interface ProductListItemAPI extends ProductListItemBase {
  id: number
}

export interface ProductListItemAPIResponse extends APIResourceResponse {
  results: ProductListItemAPI[]
}

export interface ProductListAPIResponse extends APIResourceResponse {
  results: ProductListAPI[]
}

export interface ProductAPIResponse extends APIResourceResponse {
  results: ProductAPI[]
}
