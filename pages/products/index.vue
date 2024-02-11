<script lang="ts" setup>
import { createProductListItem } from '@/api/products'
import type ProductsListView from '~~/components/Products/ListView.vue'
import type ProductsListSelect from '~~/components/Products/ListSelect.vue'
import { useNotificationsStore } from '~~/stores/notifications'
import { ProductListAPI } from '~~/types/products'

definePageMeta({
  layout: 'dashboard',
})

const notifications = useNotificationsStore()
const selectedProductList = ref<ProductListAPI | undefined>(undefined)
const listViewComponent = ref<InstanceType<typeof ProductsListView> | null>(
  null
)
const listSelectComponent = ref<InstanceType<typeof ProductsListSelect> | null>(
  null
)

const updateProductList = () => {
  if (listViewComponent.value && listSelectComponent.value) {
    listSelectComponent.value.fetchProductLists()
    listViewComponent.value.fetchAll()
  }
}

const setProductList = (productList: ProductListAPI) => {
  selectedProductList.value = productList
  updateProductList()
}

const addProductToList = (productId: string) => {
  if (!selectedProductList.value) {
    notifications.addNotification({
      type: 'error',
      text: 'Please select a product list first',
    })
    return
  }
  createProductListItem({
    product_list: selectedProductList.value.id,
    product: parseInt(productId, 10),
    quantity: 1,
  })
    .then(() => {
      notifications.addNotification({
        type: 'success',
        text: 'Product added to list successfully',
      })

      updateProductList()
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
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.products.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <div class="grid grid-cols-2 w-full gap-4">
        <div>
          <!-- Select of Product/Purchase List -->
          <div class="flex flex-col gap-3">
            <ProductsListSelect
              ref="listSelectComponent"
              v-model="selectedProductList"
            />
            <ProductsListCreate @list-created="setProductList" />
          </div>
          <ProductsListView
            v-if="selectedProductList?.id"
            ref="listViewComponent"
            :product-list-id="selectedProductList.id"
          />
        </div>
        <Products
          v-if="selectedProductList?.id"
          @product-selected="addProductToList"
          @products-updated="updateProductList"
        />
      </div>
    </PageBody>
  </PageWrapper>
</template>
