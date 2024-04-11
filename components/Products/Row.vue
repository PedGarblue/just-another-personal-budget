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
  alert('Are you sure you want to delete this product?')
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
      <IconMdi:plusCircleOutline
        class="text-green-500 hover:text-green-600 cursor-pointer transition text-base"
        @click="() => onSelectedProduct(product.id)"
      />
      <span class="w-full">
        <template v-if="isUpdating">
          <UiInput
            v-model="productData.name"
            type="text"
            class="h-5 text-center"
          ></UiInput>
        </template>
        <template v-else>
          {{ product.name }}
        </template>
      </span>
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

    <UiTableCell class="flex">
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
          class="rounded-md px-4 py-1 font-bold mx-auto"
          :style="{ backgroundColor: category?.color }"
          >{{ category?.name }}</span
        >
      </template>
    </UiTableCell>

    <UiTableCell>
      <div class="flex flex-row gap-4 justify-end">
        <div class="h-5 w-5">
          <IconMdi:pencilCircleOutline
            v-if="!isUpdating"
            class="text-blue-600 hover:text-blue-400 transition cursor-pointer text-base"
            @click="() => toggleUpdating()"
          />
          <IconMdi:checkCircleOutline
            v-else
            class="text-green-600 hover:text-green-400 transition cursor-pointer text-base"
            @click="() => onUpdateProduct()"
          />
        </div>
        <div class="h-5 w-5" @click="() => submitDeleteProduct()">
          <IconMdi:trashOutline
            class="text-red-800 hover:text-red-600 transition cursor-pointer text-base"
          />
        </div>
      </div>
    </UiTableCell>
  </UiTableRow>
</template>
