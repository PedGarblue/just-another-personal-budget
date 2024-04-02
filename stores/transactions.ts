import { defineStore } from 'pinia'
import type { CategoryAPI, CategoryBase } from '~~/types/categories'
import {
  getCategoryList,
  createCategory,
  deleteCategory,
} from '~~/api/categories'

export interface ItransactionsState {
  categories: CategoryAPI[]
}

export const useTransactions = defineStore('transactions', {
  state: (): ItransactionsState => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      const categoriesData = await getCategoryList()
      if (categoriesData) {
        this.categories = categoriesData
        return this.categories
      }
    },
    async createCategory(data: CategoryBase) {
      await createCategory(data)
      await this.fetchCategories()
    },
    async deleteCategory(id: number) {
      await deleteCategory(id)
      await this.fetchCategories()
    },
  },
  getters: {
    getCategories(): CategoryAPI[] {
      return this.categories
    },
    getCategory(state): (id: number) => CategoryAPI | undefined {
      return (pk: number) => this.getCategories.find((c) => c.id === pk)
    },
  },
})
