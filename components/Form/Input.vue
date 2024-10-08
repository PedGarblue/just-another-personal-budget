<script lang="ts" setup>
// compiler macro
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  inputClass: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'text',
  },
  title: {
    type: String,
    default: null,
    required: false,
  },
  tabindex: {
    type: Number,
    default: 0,
  },
  step: {
    type: String,
    default: 'any',
  },
})
const emit = defineEmits(['update:modelValue'])
const slots = useSlots()

// list styles
const paddingStyles = reactive<{
  [key: string]: string
}>({
  xs: 'px-1 py-0.5',
  sm: 'px-2 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-5 py-3',
})
const fontSizeStyles = reactive<{
  [key: string]: string
}>({
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
})

// states
const modelValue = useSyncProps<string>(props, 'modelValue', emit)
const havePreEl = computed(
  () =>
    typeof slots.prefix !== 'undefined' ||
    typeof slots['prefix-disabled'] !== 'undefined'
)
const haveSuEl = computed(() => typeof slots.suffix !== 'undefined')
const selectedBorderStyle = computed(
  () => 'border-gray-900/10 dark:border-gray-600/[0.2]'
)
const selectedOnHoverBorderStyle = computed(
  () => 'dark:focus:border-slate-600 focus:border-gray-900'
)
const selectedPaddingStyle = computed(
  () => paddingStyles[props.size] || paddingStyles.md
)
const selectedFontSizeStyle = computed(
  () => fontSizeStyles[props.size] || fontSizeStyles.md
)
</script>

<template>
  <div class="flex flex-col">
    <div v-if="title" :class="`${selectedFontSizeStyle}`">
      {{ title }}
    </div>
    <div :class="`text-input-container relative flex`">
      <div
        v-if="slots['prefix-disabled']"
        :class="`flex rounded-l bg-gray-100 dark:bg-slate-800 text-gray-500 border ${selectedBorderStyle}`"
      >
        <slot name="prefix-disabled" />
      </div>
      <div
        v-if="slots.prefix"
        :class="`flex rounded-l border items-center ${selectedBorderStyle} ${selectedPaddingStyle}`"
      >
        <slot name="prefix" />
      </div>
      <div class="text-input-wrapper relative flex flex-1">
        <input
          v-model="modelValue"
          :class="`transition-colors text-input w-full flex-1 bg-transparent outline-none border ${
            havePreEl ? '' : 'rounded-l-full'
          } ${
            haveSuEl ? '' : 'rounded-r-full'
          } ${selectedBorderStyle} ${selectedOnHoverBorderStyle} ${selectedPaddingStyle} ${selectedFontSizeStyle}
          ${inputClass}`"
          :type="type"
          :placeholder="placeholder"
          :tabindex="tabindex"
          :step="step"
          :required="required"
        />
      </div>
      <div
        v-if="slots.suffix"
        :class="`flex rounded-r border ${selectedBorderStyle}`"
      >
        <slot name="suffix" />
      </div>
    </div>
  </div>
</template>
