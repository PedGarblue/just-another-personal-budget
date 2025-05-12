<script setup>
import { ref, onMounted } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { getProductIndex } from '~~/api/products'
import { parseSortDataTableToSortAPI, debounce } from '~~/lib/utils'
import { useNotificationsStore } from '~~/stores/notifications'

const props = defineProps({
  defaultProducts: {
    type: Array,
    default: () => [],
  },
})

const modelValue = defineModel('modelValue', { type: Array, default: () => [] })
const notifications = useNotificationsStore()
const products = ref([])
const next = ref(null)
const prev = ref(null)
const searchTerm = ref('')
const loading = ref(false)

const fetchProducts = async (url = '') => {
  loading.value = true
  const ordering = parseSortDataTableToSortAPI('name', ['asc'])

  const data = await getProductIndex(url, {
    ordering,
    search: searchTerm.value,
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
  loading.value = false
}

const handleSearch = debounce(() => {
  fetchProducts()
}, 250)

const goToNextPage = () => {
  if (next.value) {
    fetchProducts(next.value)
  }
}

const goToPrevPage = () => {
  if (prev.value) {
    fetchProducts(prev.value)
  }
}

onMounted(async () => {
  await fetchProducts()
  if (props.defaultProducts) {
    // Get IDs of default products that aren't in the current products list
    const missingProductIds = props.defaultProducts
      .map((p) => p.product)
      .filter((id) => !products.value.some((p) => p.id === id))

    // Fetch missing products if any
    if (missingProductIds.length > 0) {
      const data = await getProductIndex('', {
        idsIn: missingProductIds,
      }).catch((error) => {
        notifications.addNotification({
          type: 'error',
          text: error.message,
        })
      })

      if (data) {
        // Add missing products to the products list
        products.value = [...products.value, ...data.results]
      }
    }

    // Now set the model value with all products
    modelValue.value = products.value.filter((product) =>
      props.defaultProducts.some((p) => p.product === product.id)
    )
  }
})
</script>

<template>
  <div class="space-y-2">
    <Listbox v-model="modelValue" by="id" multiple>
      <ListboxButton class="w-full rounded-full border border-gray-300 p-2">
        <div v-if="modelValue.length > 0">
          <span
            v-for="product in modelValue"
            :key="product.id"
            class="mx-1 rounded-md border border-gray-300 px-1 text-sm"
          >
            {{ product.name }}
          </span>
        </div>
        <span v-else>Select Product</span>
      </ListboxButton>

      <ListboxOptions class="w-full mt-2 px-2 py-1">
        <div class="flex items-center gap-2 mb-2">
          <UiInput
            v-model="searchTerm"
            type="text"
            placeholder="Search products..."
            @keyup="handleSearch"
          />
        </div>

        <div class="flex gap-4 mb-2">
          <Button
            :disabled="!prev"
            :class="{ 'opacity-50 cursor-not-allowed': !prev }"
            size="sm"
            @click="goToPrevPage"
          >
            <IconMdi:navigateBefore class="text-lg" />
          </Button>
          <Button
            :disabled="!next"
            :class="{ 'opacity-50 cursor-not-allowed': !next }"
            size="sm"
            @click="goToNextPage"
          >
            <IconMdi:navigateNext class="text-lg" />
          </Button>
        </div>

        <div class="flex flex-col py-1 px-2 border border-gray-700 rounded-md">
          <ListboxOption
            v-for="product in products"
            v-slot="{ selected }"
            :key="product.id"
            :value="product"
          >
            <div
              class="flex flex-row items-center gap-2"
              :class="{
                'font-bold': selected,
              }"
            >
              <IconMdi:check v-if="selected" class="text-green-500" />
              {{ product.name }}
            </div>
          </ListboxOption>
        </div>

        <div
          v-if="products.length === 0"
          class="py-2 text-center text-gray-500"
        >
          No products found
        </div>
      </ListboxOptions>
    </Listbox>
  </div>
</template>

<style lang="scss" scoped></style>
