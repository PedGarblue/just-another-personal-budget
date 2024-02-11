<script setup lang="ts">
import { Header } from 'vue3-easy-data-table'

import { ProductListAPI, ProductListItemAPI } from '~~/types/products'
import {
  getProductListItemIndex,
  getProductList,
  updateProductListItem,
  deleteProductListItem,
} from '~~/api/products'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits<{
  (e: 'product-list-item-removed', id: string): void
}>()

const props = defineProps<{
  productListId: number
}>()

type ItemQuantityOperation = 'add' | 'subtract' | number

// data

const notifications = useNotificationsStore()
const productList = ref<ProductListAPI | undefined>(undefined)
const items = ref<ProductListItemAPI[]>([])
const headers: Header[] = [
  {
    text: 'Name',
    value: 'product_name',
    sortable: true,
  },
  {
    text: 'Quantity',
    value: 'quantity',
  },
  {
    text: 'Price',
    value: 'product_cost',
  },
  {
    text: 'Total',
    value: 'total',
  },
  {
    text: 'Actions',
    value: 'actions',
  },
]

// methods

const fetchProductList = async () => {
  const fetched = await getProductList(props.productListId)
  if (fetched) {
    productList.value = fetched
  }
}

const fetchProductListItems = async () => {
  const fetched = await getProductListItemIndex(props.productListId)
  if (fetched) {
    items.value = fetched.results
  }
}

const fetchAll = async () => {
  await fetchProductList()
  await fetchProductListItems()
}

const updateProductListItemQuantity = async (
  listItem: ProductListItemAPI,
  quantity: ItemQuantityOperation
) => {
  const amountQuantity: number =
    typeof quantity === 'string'
      ? quantity === 'add'
        ? listItem.quantity + 1
        : listItem.quantity - 1
      : quantity

  const data = {
    ...listItem,
    quantity: amountQuantity > 0 ? amountQuantity : 1,
  }

  await updateProductListItem(listItem.id, data)
    .then(() => {
      notifications.addNotification({
        type: 'success',
        text: 'Product quantity updated successfully',
      })
      fetchAll()
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
}

const removeProductFromList = async (id: string) => {
  alert('Are you sure you want to delete this item?')

  await deleteProductListItem(parseInt(id, 10))
    .then(() => {
      notifications.addNotification({
        type: 'success',
        text: 'Product removed from list successfully',
      })
      fetchAll()
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
  emits('product-list-item-removed', id)
}

// events

onMounted(() => {
  fetchAll()
})

// watchers

watch(
  () => props.productListId,
  () => {
    fetchAll()
  }
)

defineExpose({
  fetchAll,
  removeProductFromList,
})
</script>
<template>
  <div>
    <div class="w-full flex pt-4 pb-2">
      <GenericDataPill title="Total" :text="productList?.total" size="sm" />
    </div>
    <EasyDataTable :items="items" :headers="headers">
      <template #item-quantity="item">
        <div class="flex items-center">
          <IconMdi:minus
            class="text-red-800 hover:text-red-700 cursor-pointer transition"
            @click="() => updateProductListItemQuantity(item, 'subtract')"
          />
          <span class="font-bold mx-2 text-base">{{ item.quantity }}</span>
          <IconMdi:plus
            class="text-green-600 hover-green-500 cursor-pointer transition"
            @click="() => updateProductListItemQuantity(item, 'add')"
          />
        </div>
      </template>
      <template #item-actions="item">
        <span>
          <IconMdi:trashOutline
            class="cursor-pointer text-red-800 hover:text-red-500 text-base transition"
            @click="removeProductFromList(item.id)"
          />
        </span>
      </template>
    </EasyDataTable>
  </div>
</template>
