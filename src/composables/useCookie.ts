import { ref, watch } from 'vue'

export function useCookie<T extends string>(name: string) {
  const read = (): T | undefined => {
    if (typeof document === 'undefined') return undefined
    const match = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`
      )
    )
    return match ? (decodeURIComponent(match[1]) as T) : undefined
  }

  const state = ref<T | null | undefined>(read())

  watch(state, (value) => {
    if (typeof document === 'undefined') return
    if (value == null || value === '') {
      document.cookie = `${name}=; path=/; max-age=0`
      return
    }
    document.cookie = `${name}=${encodeURIComponent(
      value
    )}; path=/; max-age=31536000`
  })

  return state
}
