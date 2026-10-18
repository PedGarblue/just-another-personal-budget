<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Object, Number],
    default() {
      return ''
    },
  },
  options: {
    type: Array<String | Object>,
    required: true,
  },
  default: {
    type: [String, Object, Number],
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
  required: {
    type: Boolean,
    default() {
      return false
    },
  },
  selectionKey: {
    type: String,
    default: 'name',
  },
})

const emits = defineEmits(['update:modelValue', 'selection'])

// data

const selected = ref(
  props.modelValue !== ''
    ? props.modelValue
    : props.default
    ? props.default
    : props.options.length > 0
    ? props.options[0]
    : null
)

const searchInput = ref<HTMLInputElement | null>(null)
const open = ref(false)
const itemSearch = ref('')

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

// methods

const updateValue = (option: String | Object) => {
  selected.value = option !== '' ? option : props.default
  open.value = false
  itemSearch.value = ''
  emits('update:modelValue', option)
  emits('selection', option)
}

const openSelect = () => {
  if (!open.value) {
    open.value = true
  }
}

const closeSelect = () => {
  open.value = false
}

const focusSearch = () => {
  searchInput.value?.focus()
}

const onBlur = (e: FocusEvent) => {
  // if is clicking on the search input or selecting an item, do not close the select
  const whitelist = [searchInput]
  const whitelistClass = ['item']
  if (e.relatedTarget) {
    const relatedTarget = e.relatedTarget as Element
    if (
      whitelist.some((el) => e.relatedTarget === el.value) ||
      whitelistClass.some((c) => relatedTarget.classList.contains(c))
    ) {
      return
    }
  }

  closeSelect()
}

// computed

const selectedPaddingStyle = computed(
  () => paddingStyles[props.size] || paddingStyles.md
)
const selectedFontSizeStyle = computed(
  () => fontSizeStyles[props.size] || fontSizeStyles.md
)

const selectedDisplayValue = computed(() => {
  if (!selected.value || selected.value === '') {
    return 'None'
  }
  if (typeof selected.value === 'object') {
    return selected.value[
      props.selectionKey as keyof typeof selected.value
    ].toString()
  }
  return selected.value.toString() || ''
})

const displayOptions = computed(() => {
  return props.options
    .filter((option) => {
      if (typeof option === 'string') {
        return option.toLowerCase().includes(itemSearch.value.toLowerCase())
      } else {
        return option[props.selectionKey as keyof typeof option]
          .toString()
          .toLowerCase()
          .includes(itemSearch.value.toLowerCase())
      }
    })
    .sort((a, b) => {
      // sort to put the selected first always
      if (a === selected.value) {
        return -1
      }
      if (b === selected.value) {
        return 1
      }
      return 0
    })
})

// watch
watch(
  () => props.modelValue,
  (newValue) => {
    selected.value = newValue
  }
)

watch(open, (newValue, oldValue) => {
  if (newValue && !oldValue) {
    itemSearch.value = ''
    // TODO: find a way to focus searchInput after open.value is set to true
    // when open.value is updated, the Vue Tick has not yet updated the DOM
    // the setTimeout is a hack to wait for the DOM to update
    setTimeout(() => {
      focusSearch()
    }, 100)
  } else if (!newValue && oldValue) {
    itemSearch.value = selectedDisplayValue.value
  }
})
</script>

<template>
  <div>
    <div v-if="title" :class="`${selectedFontSizeStyle}`">
      {{ title }}
    </div>
    <div class="custom-select">
      <div
        class="selected"
        :class="[
          { open: open },
          `${selectedFontSizeStyle} ${selectedPaddingStyle}`,
        ]"
      >
        <input
          ref="searchInput"
          v-model="itemSearch"
          class="w-full bg-transparent outline-none"
          aria-label="Search Item"
          :placeholder="selectedDisplayValue"
          :tabindex="tabindex"
          @focus="() => openSelect()"
          @blur="onBlur"
        />
      </div>
      <Transition name="fade-from-top-left">
        <div v-if="open" ref="itemsListElement" class="items">
          <div
            v-if="!required"
            key="default"
            class="item"
            @click="($event) => updateValue('')"
          >
            None
          </div>
          <div
            v-for="(option, i) of displayOptions"
            :key="i"
            class="item"
            :class="{ active: selected === option }"
            :tabindex="tabindex + 1 + i"
            @click="($event) => updateValue(option)"
            @keydown.enter="($event) => updateValue(option)"
          >
            <slot name="item-value" :option="option">
              {{ option }}
            </slot>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  text-align: left;
  outline: none;
  border: 1px solid var(--color-gray-700);
  border-radius: 9999px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  line-height: 1.5rem;
}

.custom-select .selected {
  margin: auto 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

.custom-select .selected:after {
  position: absolute;
  content: '';
  top: 1.5rem;
  right: 1em;
  width: 0;
  height: 0;
}

.items {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: max-content;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid var(--color-gray-500);
  border-radius: 0.5rem;
  gap: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  max-height: 24rem;
  z-index: 10;
  overflow-y: auto;
  overflow-x: hidden;
  position: absolute;
  top: 2.75rem;
  left: 0.5rem;
  right: 0;
}

@media (min-width: 1024px) {
  .items {
    width: max-content;
  }
}

html.dark .items {
  background-color: var(--color-gray-900);
}

.item {
  color: var(--color-gray-800);
  border-radius: 0.375rem;
  text-align: center;
  padding: 0.25rem 0.5rem;
  transition: background-color 150ms, color 150ms;
  min-width: 100%;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

html.dark .item {
  color: white;
}

.item.active {
  background-color: var(--color-primary);
  color: white;
}

.item:hover {
  background-color: var(--color-primary-600);
  color: white;
}
</style>
