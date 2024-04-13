<script setup lang="ts">
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table'

import type { ProductListAPI, ProductListItemAPI } from '~~/types/products'
import {
  getProductListItemIndex,
  getProductList,
  updateProductListItem,
} from '~~/api/products'
import { useNotificationsStore } from '~~/stores/notifications'
import { parseSortDataTableToSortAPI } from '~~/lib/utils'

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
const serverItemsLength = ref(0)
const loading = ref(false)
const headers: Header[] = [
  {
    text: 'Name',
    value: 'product_name',
    sortable: true,
  },
  {
    text: 'Category',
    value: 'product__category',
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
    sortable: true,
  },
]
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
  sortBy: ['product__category', 'total'],
  sortType: ['asc', 'desc'],
})
const rowsPerPageItems = [10, 20, 30]

// methods

const fetchProductList = async () => {
  const fetched = await getProductList(props.productListId)
  if (fetched) {
    productList.value = fetched
  }
}

const fetchProductListItems = async () => {
  loading.value = true
  const ordering = parseSortDataTableToSortAPI(
    serverOptions.value.sortBy || [],
    serverOptions.value.sortType || []
  )

  const fetched = await getProductListItemIndex(props.productListId, {
    page: serverOptions.value.page,
    limit: serverOptions.value.rowsPerPage,
    ordering,
  })
  if (fetched) {
    const { results, count } = fetched
    items.value = fetched.results
    serverItemsLength.value = count
  }
  loading.value = false
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

watch(
  () => serverOptions.value,
  () => {
    fetchProductListItems()
  },
  {
    deep: true,
  }
)

defineExpose({
  fetchAll,
})
</script>
<template>
  <div>
    <div class="w-full flex pt-4 pb-2">
      <GenericDataPill
        title="Total"
        :text="`${productList?.total}`"
        size="sm"
      />
    </div>
    <EasyDataTable
      v-model:server-options="serverOptions"
      :server-items-length="serverItemsLength"
      :loading="loading"
      :items="items"
      :headers="headers"
      :rows-items="rowsPerPageItems"
      multi-sort
    >
      <template #item-product_name="item">
        <ProductsListItemContextMenu
          :item="item"
          @product-list-item-removed="fetchAll"
        >
          {{ item.product_name }}
        </ProductsListItemContextMenu>
      </template>

      <template #item-product__category="item">
        <div
          class="border-2 rounded-md px-2 py-1 text-sm font-bold w-full text-center"
          :style="{
            'border-color': item.product_category_color,
            'background-color': item.product_category_color + '20',
          }"
        >
          {{ item.product__category }}
        </div>
      </template>

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

      <template #item-total="item">
        <b>{{ item.total }}</b>
      </template>
    </EasyDataTable>
  </div>
</template>
