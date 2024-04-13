import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SortType } from 'vue3-easy-data-table'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSortDataTableToSortAPI(
  sortBy: string | string[],
  sortType: SortType | SortType[] | string | string[]
) {
  return (typeof sortBy === 'string' ? [sortBy] : sortBy)?.map((field, index) =>
    sortType?.[index] === 'desc' ? `-${field}` : field
  )
}
