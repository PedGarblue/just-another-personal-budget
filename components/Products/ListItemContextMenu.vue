<script setup lang="ts">
import type { ProductListItemAPI } from '~~/types/products'
import { deleteProductListItem } from '~~/api/products'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits<{
  (e: 'product-list-item-removed', id: string): void
}>()

const props = defineProps<{
  item: ProductListItemAPI
}>()

const notifications = useNotificationsStore()

const removeProductFromList = async () => {
  if (!confirm('Are you sure you want to delete this item?')) return

  await deleteProductListItem(props.item.id)
    .then(() => {
      notifications.addNotification({
        type: 'success',
        text: 'Product removed from list successfully',
      })
      emits('product-list-item-removed', props.item.id.toString())
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
}
</script>

<template>
  <UiContextMenu>
    <UiContextMenuTrigger>
      <slot />
    </UiContextMenuTrigger>
    <UiContextMenuContent class="w-64 bg-white">
      <UiContextMenuItem @click="removeProductFromList">
        <IconMdi:trashOutline class="text-red-600 mr-2 mb-0.5" />
        <span>Delete</span>
      </UiContextMenuItem>
    </UiContextMenuContent>
  </UiContextMenu>
</template>
