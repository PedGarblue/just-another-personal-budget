<script setup lang="ts">
import { createProduct } from '~~/api/products'
import { useNotificationsStore } from '~~/stores/notifications'
import type { ProductCreate } from '~~/types/products'

const notifications = useNotificationsStore()

const emits = defineEmits<{
  (e: 'created-product', payload: string | number): void
}>()

const product = ref<ProductCreate>({
  name: '',
  cost: '0',
})

const prodname = ref<HTMLInputElement | null>(null)

const submit = async () => {
  const createdProduct = await createProduct(product.value).catch((error) => {
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
      <Button class="w-max mx-auto" size="xs" @click="() => submit()">+</Button>
    </UiTableCell>
  </UiTableRow>
</template>

<style lang="postcss" scoped>
.table-input {
  @apply w-full px-4 bg-transparent border-gray-600 text-gray-900 dark:text-white text-center placeholder-gray-400;
}
</style>
