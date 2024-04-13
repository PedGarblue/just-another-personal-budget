<script lang="ts" setup>
import { Ref } from 'vue'
import { useNotificationsStore } from '~~/stores/notifications'
import { getProductIndex } from '~~/api/products'
import type { ProductAPI } from '~~/types/products'
import { parseSortDataTableToSortAPI } from '~~/lib/utils'

// events
const emits = defineEmits<{
  (e: 'product-selected', payload: string | number): void
  (e: 'products-updated'): void
}>()

// data

const notifications = useNotificationsStore()
const products: Ref<ProductAPI[]> = ref([])
const next = ref<string | null>(null)
const prev = ref<string | null>(null)
const sortBy = ref<string[]>(['category', 'cost'])
const sortType = reactive<string[]>(['asc', 'desc'])

// methods

const fetchProducts = async (urlString: string = '') => {
  const ordering = parseSortDataTableToSortAPI(sortBy.value, sortType)
  const data = await getProductIndex(urlString, {
    ordering,
  }).catch((error) => {
    notifications.addNotification({
      type: 'error',
      text: error.message,
    })
  })
  if (data) {
    products.value = data.results
    next.value = data.next
    prev.value = data.previous
  }
}

const toggleSort = (index: number) => {
  if (sortBy.value[index]) {
    sortType[index] = sortType[index] === 'asc' ? 'desc' : 'asc'
  } else {
    sortType[index] = 'asc'
  }
  fetchProducts()
}

const onSelectedProduct = (id: string | number) => {
  emits('product-selected', id)
}

const onProductsUpdated = () => {
  emits('products-updated')
  fetchProducts()
}

// lifecycle

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <UiTable class="h-full">
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead class="text-center">Name</UiTableHead>
          <UiTableHead class="text-center">
            <div class="flex w-full items-center justify-center gap-1">
              <span>Category</span>
              <template v-if="sortType[0] === 'desc'">
                <IconMdi:arrowDownDropCircleOutline
                  class="cursor-pointer"
                  @click="() => toggleSort(0)"
                />
              </template>
              <template v-else>
                <IconMdi:arrowUpDropCircleOutline
                  class="cursor-pointer"
                  @click="() => toggleSort(0)"
                />
              </template>
            </div>
          </UiTableHead>
          <UiTableHead class="text-center">
            <div class="flex w-full items-center justify-center gap-1">
              <span>Price</span>
              <template v-if="sortType[1] === 'desc'">
                <IconMdi:arrowDownDropCircleOutline
                  class="cursor-pointer"
                  @click="() => toggleSort(1)"
                />
              </template>
              <template v-else>
                <IconMdi:arrowUpDropCircleOutline
                  class="cursor-pointer"
                  @click="() => toggleSort(1)"
                />
              </template>
            </div>
          </UiTableHead>
          <UiTableHead class="text-center">Actions</UiTableHead>
        </UiTableRow>
        <UiTableRow v-if="prev || next">
          <UiTableCell>
            <Button
              v-if="prev"
              size="xs"
              class="w-max mx-auto"
              @click="() => fetchProducts(prev ? prev : undefined)"
            >
              Prev
            </Button>
          </UiTableCell>
          <UiTableCell></UiTableCell>
          <UiTableCell>
            <Button
              v-if="next"
              size="xs"
              class="w-max mx-auto"
              @click="() => fetchProducts(next ? next : undefined)"
            >
              Next
            </Button>
          </UiTableCell>
        </UiTableRow>
      </UiTableHeader>

      <UiTableBody>
        <ProductsCreateRow @created-product="() => onProductsUpdated()" />
        <ProductsRow
          v-for="product in products"
          :key="product.id"
          :product="product"
          @product-selected="onSelectedProduct"
          @product-updated="() => onProductsUpdated()"
          @product-deleted="() => onProductsUpdated()"
        >
        </ProductsRow>
      </UiTableBody>
      <UiTableFooter>
        <UiTableRow v-if="prev || next">
          <UiTableCell>
            <Button
              v-if="prev"
              size="xs"
              class="w-max mx-auto"
              @click="() => fetchProducts(prev ? prev : undefined)"
            >
              Prev
            </Button>
          </UiTableCell>
          <UiTableCell></UiTableCell>
          <UiTableCell>
            <Button
              v-if="next"
              size="xs"
              class="w-max mx-auto"
              @click="() => fetchProducts(next ? next : undefined)"
            >
              Next
            </Button>
          </UiTableCell>
        </UiTableRow>
      </UiTableFooter>
    </UiTable>
  </div>
</template>
