export interface CategoryBase {
  name: string
  description?: string
  parent_category?: number
  color: string
  type: string
}

export interface CategoryAPI extends CategoryBase {
  id: number
}
