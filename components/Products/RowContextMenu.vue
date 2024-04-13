<script setup lang="ts">
import type { ProductAPI } from '~~/types/products'

const emits = defineEmits<{
  (e: 'product-contextmenu-selection-update', id: string): void
  (e: 'product-contextmenu-selection-delete', id: string): void
}>()

const props = defineProps<{
  product: ProductAPI
}>()

// methods
const deleteSelected = () => {
  emits('product-contextmenu-selection-delete', '1')
}

const updateSelected = () => {
  emits('product-contextmenu-selection-update', '1')
}
</script>

<template>
  <UiContextMenu>
    <UiContextMenuTrigger>
      <slot />
    </UiContextMenuTrigger>
    <UiContextMenuContent class="w-64 bg-white">
      <UiContextMenuItem @click="updateSelected">
        <IconMdi:pencilCircleOutline class="text-blue-600 mr-2 mb-0.5" />
        <span>Update</span>
      </UiContextMenuItem>
      <UiContextMenuItem @click="deleteSelected">
        <IconMdi:trashOutline class="text-red-600 mr-2 mb-0.5" />
        <span>Delete</span>
      </UiContextMenuItem>
    </UiContextMenuContent>
  </UiContextMenu>
</template>
