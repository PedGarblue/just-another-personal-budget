<script lang="ts" setup>
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'
import { deleteProduct, updateProduct } from '~~/api/products'
import type { ProductAPI } from '~~/types/products'
import type { CategoryAPI } from '~~/types/categories'

const emits = defineEmits<{
  (e: 'product-selected', payload: string | number): void
  (e: 'product-updated', payload: string | number): void
  (e: 'product-deleted', payload: string | number): void
}>()

const props = defineProps<{
  product: ProductAPI
}>()

// data
const notifications = useNotificationsStore()
const transactionsState = useTransactions()
const isUpdating = ref(false)
const productData = ref(props.product)

const category = ref<CategoryAPI | undefined>(
  transactionsState.getCategory(
    props.product.category ? props.product.category : -1
  )
)

const categories = computed(() => transactionsState.getCategories)

// methods
const onSelectedProduct = (id: string | number) => {
  emits('product-selected', id)
}

const toggleUpdating = () => {
  isUpdating.value = !isUpdating.value
}

const submitDeleteProduct = async () => {
  if (!confirm('Are you sure you want to delete this product?')) return
  const deletedProduct = await deleteProduct(props.product.id).catch(
    (error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    }
  )
  if (deletedProduct) {
    notifications.addNotification({
      type: 'success',
      text: 'Product deleted successfully',
    })
    emits('product-deleted', props.product.id)
  }
}

const onUpdateProduct = () => {
  const data = {
    ...productData.value,
    category: category.value?.id,
  }

  updateProduct(props.product.id, data)
    .then((updatedProduct) => {
      notifications.addNotification({
        type: 'success',
        text: 'Product updated successfully',
      })
      emits('product-updated', props.product.id)
      toggleUpdating()
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
  <UiTableRow>
    <UiTableCell class="flex gap-4 items-center text-center font-bold">
      <template v-if="isUpdating">
        <IconMdi:checkCircleOutline
          class="text-green-600 hover:text-green-400 transition cursor-pointer text-base h-6 w-6"
          @click="() => onUpdateProduct()"
        />
      </template>
      <template v-else>
        <IconMdi:plusCircleOutline
          class="text-green-500 hover:text-green-600 cursor-pointer transition text-base h-6 w-6"
          @click="() => onSelectedProduct(product.id)"
        />
      </template>
      <span class="w-full">
        <template v-if="isUpdating">
          <UiInput
            v-model="productData.name"
            type="text"
            class="h-5 text-center"
          ></UiInput>
        </template>
        <template v-else>
          <ProductsRowContextMenu
            :product="product"
            @product-contextmenu-selection-update="() => toggleUpdating()"
            @product-contextmenu-selection-delete="() => submitDeleteProduct()"
          >
            {{ product.name }}
          </ProductsRowContextMenu>
        </template>
      </span>
    </UiTableCell>

    <UiTableCell class="flex-inline text-center">
      <template v-if="isUpdating">
        <Select v-model="category" :options="categories" class="table-input">
          <template #selected-value="{ selected }">
            <span>{{ selected.name }}</span>
          </template>

          <template #item-value="{ option }">
            <span>{{ option.name }}</span>
          </template>
        </Select>
      </template>
      <template v-else>
        <span
          class="rounded-md px-4 py-1 font-bold mx-auto border-2"
          :style="{
            backgroundColor: `${category?.color}20`,
            borderColor: category?.color,
          }"
          >{{ category?.name }}</span
        >
      </template>
    </UiTableCell>

    <UiTableCell class="text-center">
      <span class="w-full">
        <template v-if="isUpdating">
          <UiInput
            v-model="productData.cost"
            type="number"
            class="h-5 text-center"
          ></UiInput>
        </template>
        <template v-else>
          {{ product.cost }}
        </template>
      </span>
    </UiTableCell>
  </UiTableRow>
</template>
