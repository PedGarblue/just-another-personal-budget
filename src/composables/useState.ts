import { ref, type Ref } from 'vue'

const states = new Map<string, Ref<unknown>>()

export function useState<T>(key: string, init?: () => T): Ref<T> {
  const existing = states.get(key) as Ref<T> | undefined
  if (existing) return existing

  const value = ref(init ? init() : undefined) as Ref<T>
  states.set(key, value)
  return value
}
