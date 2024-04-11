<script setup lang="ts">
import { createProduct } from '~~/api/products'
import { useTransactions } from '~~/stores/transactions'
import { useNotificationsStore } from '~~/stores/notifications'
import type { ProductCreate } from '~~/types/products'
import type { CategoryAPI } from '~~/types/categories'

const notifications = useNotificationsStore()
const transactionsState = useTransactions()

const categories = computed(() => transactionsState.getCategories)
const category = ref<CategoryAPI>(categories.value[0])

const emits = defineEmits<{
  (e: 'created-product', payload: string | number): void
}>()

const product = ref<ProductCreate>({
  name: '',
  cost: '0',
  category: category.value.id,
})

const prodname = ref<HTMLInputElement | null>(null)

const submit = async () => {
  const data = {
    ...product.value,
    category: category.value.id,
  }
  const createdProduct = await createProduct(data).catch((error) => {
    notifications.addNotification({
      type: 'error',
      text: error.message,
    })
  })
  if (createdProduct) {
    emits('created-product', createdProduct.id)
    notifications.addNotification({
      type: 'success',
      text: 'Product created successfully',
    })
    // clear inputs
    product.value = { name: '', cost: '0' }

    // focus on the first input
    prodname.value?.focus()
  }
}
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <UiInput
        ref="prodname"
        v-model="product.name"
        type="text"
        class="table-input"
        placeholder="New Product"
      />
    </UiTableCell>
    <UiTableCell>
      <input v-model="product.cost" type="number" class="table-input" />
    </UiTableCell>
    <UiTableCell>
      <Select v-model="category" :options="categories" class="table-input">
        <template #selected-value="{ selected }">
          <span>{{ selected.name }}</span>
        </template>

        <template #item-value="{ option }">
          <span>{{ option.name }}</span>
        </template>
      </Select>
    </UiTableCell>
    <UiTableCell>
      <Button class="w-max mx-auto" size="xs" @click="() => submit()">+</Button>
    </UiTableCell>
  </UiTableRow>
</template>

<style lang="postcss" scoped>
.table-input {
  @apply w-full px-4 bg-transparent border-gray-600 text-gray-900 dark:text-white text-center placeholder-gray-400;
}
</style>
