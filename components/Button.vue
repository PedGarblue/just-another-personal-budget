<script lang="ts" setup>
import { cn } from '~~/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: undefined,
  },
})

// state:styles
const defaultStyle = `
  cursor-pointer
  border transition-color duration-300
  focus:outline-none focus:ring-1 focus:ring-offset-1 focus:dark:ring-offset-gray-50 focus:dark:ring-gray-400 focus:ring-gray-600/[0.6] focus:ring-offset-gray-800/[0.6]
  flex items-center justify-center font-semibold
`
const styles = reactive<{
  [key: string]: string
}>({
  none: '',
  primary:
    'text-slate-900 bg-primary-500 hover:bg-primary-400 border-primary-500',
  secondary:
    'text-slate-800 bg-gray-200 border-gray-200 hover:bg-gray-300 dark:text-white dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700',
  opposite:
    'text-white bg-gray-800 hover:bg-white hover:text-gray-800 hover:border-gray-900 dark:text-gray-800 dark:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:border-white',
})
const sizes = reactive<{
  [key: string]: string
}>({
  lg: 'h-13 px-8 text-lg rounded-full',
  md: 'h-10 px-6 text-base rounded-full',
  sm: 'h-9 px-4 text-sm rounded-full',
  xs: 'h-6 px-3 text-xs rounded-full',
})

// state
const selectedStyle = computed(() =>
  props.type in styles ? styles[props.type] : styles.primary
)
const selectedSize = computed(() => sizes[props.size] || sizes.lg)

// methods
const onClick = (event: MouseEvent) => {
  const router = useRouter()
  if (props.to) {
    router.push(props.to)
  }
  if (!props.href) {
    event.preventDefault()
  }
}
</script>

<template>
  <NuxtLink
    v-if="to"
    tag="a"
    :to="to"
    :class="cn(`${defaultStyle} ${selectedStyle} ${selectedSize}`, props.class)"
  >
    <slot>{{ text }}</slot>
  </NuxtLink>
  <a
    v-else
    :class="cn(`${defaultStyle} ${selectedStyle} ${selectedSize}`, props.class)"
    :href="href"
    @click="onClick"
  >
    <slot>{{ text }}</slot>
  </a>
</template>
