<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        'flex h-10 w-full rounded-full' +
          ' border border-slate-200 bg-white px-3 py-2 text-sm' +
          ' file:border-0 file:bg-transparent file:text-sm file:font-medium' +
          ' placeholder:text-slate-500' +
          ' focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2' +
          ' disabled:cursor-not-allowed disabled:opacity-50' +
          ' dark:border-slate-800 dark:bg-gray-900 dark:ring-offset-slate-800 dark:placeholder:text-slate-400',
        props.class
      )
    "
  />
</template>
