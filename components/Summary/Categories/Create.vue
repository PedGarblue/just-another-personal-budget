<script lang="ts" setup>
import type { Ref } from 'vue'
import type { Header, SortType } from 'vue3-easy-data-table'
import type { CategoryAPI, CategoryForm } from '~~/types/categories'
import Modal from '~~/components/Modal.vue'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '~~/api/categories'
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'

const notifications = useNotificationsStore()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const transactionsStore = useTransactions()
const categories = computed(() => transactionsStore.getCategories)
const newCategory = reactive<CategoryForm>({
  name: '',
  color: '#000000',
  description: '',
  type: 'expense',
  parentData: undefined,
})

const sortBy: string[] = ['name', 'type', 'parentCategoryData.name']
const sortType: SortType[] = ['desc', 'desc', 'desc']

const headers: Header[] = [
  {
    text: 'Name',
    value: 'name',
    sortable: true,
  },
  {
    text: 'Type',
    value: 'type',
    sortable: true,
  },
  {
    text: 'Parent',
    value: 'parentCategoryData.name',
    sortable: true,
  },
  {
    text: 'Color',
    value: 'color',
  },
  {
    text: 'Actions',
    value: 'operation',
  },
]

const parsedCategories = computed(() => {
  return categories.value.map((category) => {
    return {
      ...category,
      parentCategoryData: categories.value.find(
        (c) => c.id === category.parent_category
      ),
    }
  })
})

// methods
const openModal = () => {
  modal.value?.open()
}

const submit = () => {
  return transactionsStore.createCategory({
    ...newCategory,
    description: newCategory.description || newCategory.name,
    parent_category: newCategory.parentData?.id,
  })
}

const deleteItem = (item: CategoryAPI) => {
  return transactionsStore.deleteCategory(item.id)
}
</script>

<template>
  <div>
    <Button @click="openModal">Categories</Button>
    <Modal ref="modal">
      <template #contents>
        <Card class="form-card form-card-modal">
          <div class="p-4">
            <div>
              <h3 class="text-2xl font-bold">Categories</h3>
            </div>
            <!-- Create Category Inline Form -->
            <div class="py-2 mb-2">
              <div class="flex flex-row gap-2 pb-2">
                <FormInput
                  v-model="newCategory.name"
                  placeholder="Name"
                  class="w-1/2 rounded-md"
                />
                <Select
                  v-model="newCategory.type"
                  size="sm"
                  default="expense"
                  :options="['expense', 'income']"
                />
                <Select
                  v-model="newCategory.parentData"
                  size="sm"
                  default="None"
                  :options="categories"
                >
                  <template #selected-value="item">
                    {{
                      typeof item.selected === 'object'
                        ? (item.selected as CategoryAPI).name
                        : 'None'
                    }}
                  </template>
                  <template #item-value="item">
                    {{
                      typeof item.option === 'object'
                        ? (item.option as CategoryAPI).name
                        : 'None'
                    }}
                  </template>
                </Select>
                <FormInput
                  v-model="newCategory.color"
                  type="color"
                  size="xs"
                  input-class="h-10 w-10"
                />
              </div>
              <Button class="w-full" @click="submit"> Create </Button>
            </div>
            <!-- Categories List -->
            <div>
              <EasyDataTable
                :headers="headers"
                :sort-by="sortBy"
                :sort-type="sortType"
                :items="parsedCategories"
                :rows-items="[10, 15]"
                :rows-per-page="10"
                class="h-full"
                multi-sort
              >
                <template #item-color="item">
                  <div
                    class="rounded-lg p-4"
                    :style="{
                      backgroundColor: item.color,
                    }"
                  ></div>
                </template>

                <template #item-operation="item">
                  <div class="flex justify-center gap-2">
                    <Button
                      size="xs"
                      class="bg-red-500"
                      @click="deleteItem(item)"
                    >
                      <IconMdi:delete-outline />
                    </Button>
                  </div>
                </template>
              </EasyDataTable>
            </div>
          </div>
        </Card>
      </template>
    </Modal>
  </div>
</template>
