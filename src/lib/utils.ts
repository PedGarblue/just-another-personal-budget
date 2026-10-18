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

export function debounce(func: Function, delay: number) {
  let timeout: ReturnType<typeof setTimeout>
  return function (this: unknown, ...args: any[]) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}
