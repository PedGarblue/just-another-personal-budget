<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default() {
      return ''
    },
  },
  options: {
    type: Array<String | Object>,
    required: true,
  },
  default: {
    type: [String, Object],
    required: false,
    default: null,
  },
  tabindex: {
    type: Number,
    required: false,
    default: 0,
  },
  size: {
    type: String,
    default: 'md',
  },
  title: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue', 'selection'])

// data

const selected = ref(
  props.default
    ? props.default
    : props.options.length > 0
    ? props.options[0]
    : null
)

const open = ref(false)

// v-model update

const updateValue = (option: String | Object) => {
  selected.value = option !== '' ? option : props.default
  open.value = false
  emits('update:modelValue', option)
  emits('selection', option)
}

// methods

const openSelect = () => {
  open.value = true
}

const closeSelect = () => {
  open.value = false
}

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

const selectedPaddingStyle = computed(
  () => paddingStyles[props.size] || paddingStyles.md
)
const selectedFontSizeStyle = computed(
  () => fontSizeStyles[props.size] || fontSizeStyles.md
)
</script>

<template>
  <div>
    <div v-if="title" :class="`${selectedFontSizeStyle}`">
      {{ title }}
    </div>
    <div class="custom-select" :tabindex="tabindex" @blur="closeSelect">
      <div
        class="selected"
        :class="[
          { open: open },
          `${selectedFontSizeStyle} ${selectedPaddingStyle}`,
        ]"
        @click="($event) => (open = !open)"
      >
        <slot name="selected-value" :selected="selected">
          {{ selected }}
        </slot>
      </div>
      <div class="items" :class="{ selectHide: !open }">
        <div
          key="default"
          class="item bg-gray-100"
          @click="($event) => updateValue('')"
        >
          None
        </div>
        <div
          v-for="(option, i) of options"
          :key="i"
          class="item"
          :class="{ active: selected === option }"
          @click="($event) => updateValue(option)"
        >
          <slot name="item-value" :option="option">
            {{ option }}
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.custom-select {
  @apply relative h-full w-full text-left outline-none border rounded px-2;
  line-height: 1.5rem;
}

.custom-select .selected {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

/* 
.custom-select .selected.open {
}
*/

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 1.5rem;
  right: 1em;
  width: 0;
  height: 0;
}

.items {
  @apply flex flex-col w-max p-4 bg-white border border-t-0 rounded rounded-t-none gap-2 shadow-lg;
  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
}

.items.selectHide {
  display: none;
}

.item {
  @apply text-gray-800 rounded-md border text-center py-1 px-2 transition min-w-full;
  cursor: pointer;
  box-shadow: 0 4px 6px 0 rgb(191, 219, 254, 0.75);
  user-select: none;
}

.item.active {
  @apply bg-blue-450 text-white;
}

.item:hover {
  @apply bg-blue-100 text-gray-800;
}
</style>
