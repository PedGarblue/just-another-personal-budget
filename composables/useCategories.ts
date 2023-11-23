import { CategoryAPI, CategoryBase } from '~~/types/categories'
import { getCategoryList, createCategory } from '~~/api/categories'

export function useCategories() {
  const categories = ref<CategoryAPI[] | null>([])

  const loadCategories = async () => {
    categories.value = await getCategoryList()
  }

  const categoryCreate = async (data: CategoryBase) => {
    await createCategory(data)
    await loadCategories()
  }

  return {
    categories,
    loadCategories,
    categoryCreate,
  }
}
