<script lang="ts" setup>
import type { ProductListAPI } from '@/types/products'
import { getProductListIndex } from '~~/api/products'

const productListSelected = defineModel<ProductListAPI>()
const productLists = ref<ProductListAPI[]>([])

const fetchProductLists = async () => {
  const products = await getProductListIndex()
  if (products) {
    productLists.value = products.results
  }
}

onMounted(() => {
  fetchProductLists()
})

watch(productListSelected, () => {
  fetchProductLists()
})

defineExpose({
  fetchProductLists,
})
</script>

<template>
  <Select v-model="productListSelected" :options="productLists">
    <template #selected-value="item">
      {{ item.selected ? item.selected.name : 'None' }}
    </template>
    <template #item-value="item">
      {{ item.option.name }}
    </template>
  </Select>
</template>
