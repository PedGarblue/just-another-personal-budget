<script lang="ts" setup>
import { FolderPlus, Trash2, Edit2, X, Check } from 'lucide-vue-next'
import type { Ref } from 'vue'
import type { Header, SortType } from 'vue3-easy-data-table'
import type { CategoryAPI, CategoryForm } from '~~/types/categories'
import Modal from '~~/components/Modal.vue'
import { createCategory, deleteCategory } from '~~/api/categories'
import { useNotificationsStore } from '~~/stores/notifications'
import { useTransactions } from '~~/stores/transactions'

const { t } = useLang()
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

// Error state
const createError = ref<string | null>(null)
const editingItemId = ref<number | null>(null)
const editErrors = ref<Record<number, string>>({})
const deletingItemId = ref<number | null>(null)

const sortBy: string[] = ['name', 'type', 'parentCategoryData.name']
const sortType: SortType[] = ['desc', 'desc', 'desc']

const headers: Header[] = [
  {
    text: t('categories.table.name'),
    value: 'name',
    sortable: true,
  },
  {
    text: t('categories.table.type'),
    value: 'type',
    sortable: true,
  },
  {
    text: t('categories.table.parent'),
    value: 'parentCategoryData.name',
    sortable: true,
  },
  {
    text: t('categories.table.color'),
    value: 'color',
  },
  {
    text: t('categories.table.actions'),
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

// Get available parent categories (exclude self and descendants)
const getAvailableParents = (currentCategoryId: number) => {
  return categories.value.filter(
    (c) => c.id !== currentCategoryId && c.parent_category !== currentCategoryId
  )
}

// methods
const openModal = () => {
  modal.value?.open()
  createError.value = null
  // Reset form
  newCategory.name = ''
  newCategory.color = '#000000'
  newCategory.description = ''
  newCategory.type = 'expense'
  newCategory.parentData = undefined
}

const submit = async () => {
  createError.value = null
  try {
    if (!newCategory.name || newCategory.name.trim() === '') {
      createError.value =
        t('categories.errors.nameRequired') || 'Name is required'
      return
    }
    await transactionsStore.createCategory({
      ...newCategory,
      description: newCategory.description || newCategory.name,
      parent_category: newCategory.parentData?.id,
    })
    notifications.addNotification({
      type: 'success',
      text: t('categories.create.success') || 'Category created successfully',
    })
    // Reset form
    newCategory.name = ''
    newCategory.color = '#000000'
    newCategory.description = ''
    newCategory.type = 'expense'
    newCategory.parentData = undefined
  } catch (error: any) {
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      t('categories.errors.createFailed') ||
      'Failed to create category'
    createError.value = errorMessage
    notifications.addNotification({
      type: 'error',
      text: errorMessage,
    })
    throw error
  }
}

const confirmDelete = (item: CategoryAPI) => {
  deletingItemId.value = item.id
}

const cancelDelete = () => {
  deletingItemId.value = null
}

const deleteItem = async (item: CategoryAPI) => {
  try {
    await transactionsStore.deleteCategory(item.id)
    deletingItemId.value = null
    notifications.addNotification({
      type: 'success',
      text: t('categories.delete.success') || 'Category deleted successfully',
    })
  } catch (error: any) {
    deletingItemId.value = null
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      t('categories.errors.deleteFailed') ||
      'Failed to delete category'
    notifications.addNotification({
      type: 'error',
      text: errorMessage,
    })
  }
}

const startEdit = (item: CategoryAPI) => {
  editingItemId.value = item.id
  deletingItemId.value = null // Cancel any pending delete
  delete editErrors.value[item.id]
}

const cancelEdit = () => {
  const itemId = editingItemId.value
  editingItemId.value = null
  // Clear any errors for this item
  if (itemId) {
    delete editErrors.value[itemId]
  }
}

const updateItem = async (item: CategoryAPI, field: string, value: any) => {
  if (editingItemId.value !== item.id) return

  const updateData: any = {}

  if (field === 'parent_category') {
    updateData.parent_category = value?.id || null
  } else if (field === 'name') {
    if (!value || value.trim() === '') {
      editErrors.value[item.id] =
        t('categories.errors.nameRequired') || 'Name is required'
      return
    }
    updateData.name = value
    updateData.description = value // Update description if name changes
  } else if (field === 'type') {
    updateData.type = value
  } else if (field === 'color') {
    updateData.color = value
  }

  try {
    delete editErrors.value[item.id]
    await transactionsStore.updateCategory(item.id, updateData)
    notifications.addNotification({
      type: 'success',
      text: t('categories.update.success') || 'Category updated successfully',
    })
  } catch (error: any) {
    const errorMessage =
      error?.data?.message ||
      error?.message ||
      t('categories.errors.updateFailed') ||
      'Failed to update category'
    editErrors.value[item.id] = errorMessage
    notifications.addNotification({
      type: 'error',
      text: errorMessage,
    })
  }
}
</script>

<template>
  <div>
    <Button @click="openModal">
      <FolderPlus class="mx-auto mr-1 text" />
      {{ t('categories.title') }}
    </Button>
    <Modal ref="modal">
      <template #contents>
        <Card class="form-card form-card-modal">
          <div class="p-4">
            <div>
              <h3 class="text-2xl font-bold">{{ t('categories.title') }}</h3>
            </div>
            <!-- Create Category Inline Form -->
            <div class="py-2 mb-2">
              <div
                v-if="createError"
                class="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded"
              >
                {{ createError }}
              </div>
              <div class="flex flex-row gap-2 pb-2">
                <FormInput
                  v-model="newCategory.name"
                  :placeholder="t('categories.create.form.name')"
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
              <Button class="w-full" @click="submit">
                <FolderPlus class="mr-1 text" />
                {{ t('categories.create.title') }}
              </Button>
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
                <template #item-name="item">
                  <div
                    v-if="editingItemId === item.id"
                    class="flex items-center gap-2"
                  >
                    <FormInput
                      :model-value="item.name"
                      size="xs"
                      class="flex-1"
                      @blur="(e: FocusEvent) => {
                        const target = e.target as HTMLInputElement;
                        if (target.value && target.value.trim() !== '' && target.value !== item.name) {
                          updateItem(item, 'name', target.value);
                        }
                      }"
                    />
                  </div>
                  <div v-else>{{ item.name }}</div>
                </template>

                <template #item-type="item">
                  <div
                    v-if="editingItemId === item.id"
                    class="flex items-center gap-2"
                  >
                    <Select
                      :model-value="item.type"
                      size="xs"
                      :options="['expense', 'income']"
                      @update:model-value="
                        (val) => updateItem(item, 'type', val)
                      "
                    />
                  </div>
                  <div v-else>{{ item.type }}</div>
                </template>

                <template #[`item-parentCategoryData.name`]="item">
                  <div
                    v-if="editingItemId === item.id"
                    class="flex items-center gap-2"
                  >
                    <Select
                      :model-value="item.parentCategoryData"
                      size="xs"
                      :options="getAvailableParents(item.id)"
                      @update:model-value="
                        (val) => updateItem(item, 'parent_category', val)
                      "
                    >
                      <template #selected-value="slotItem">
                        {{
                          typeof slotItem.selected === 'object'
                            ? (slotItem.selected as CategoryAPI).name
                            : 'None'
                        }}
                      </template>
                      <template #item-value="slotItem">
                        {{
                          typeof slotItem.option === 'object'
                            ? (slotItem.option as CategoryAPI).name
                            : 'None'
                        }}
                      </template>
                    </Select>
                  </div>
                  <div v-else>
                    {{ item.parentCategoryData?.name || 'None' }}
                  </div>
                </template>

                <template #item-color="item">
                  <div
                    v-if="editingItemId === item.id"
                    class="flex items-center gap-2"
                  >
                    <FormInput
                      :model-value="item.color"
                      type="color"
                      size="xs"
                      input-class="h-8 w-8"
                      @update:model-value="
                        (val) => updateItem(item, 'color', val)
                      "
                    />
                  </div>
                  <div
                    v-else
                    class="rounded-lg p-4"
                    :style="{
                      backgroundColor: item.color,
                    }"
                  ></div>
                </template>

                <template #item-operation="item">
                  <div class="flex flex-col items-center gap-1" :class="{}">
                    <div class="flex justify-center gap-2">
                      <template v-if="editingItemId === item.id">
                        <Button
                          size="xs"
                          type="secondary"
                          class="px-1"
                          @click="cancelEdit"
                        >
                          <X class="py-1" />
                        </Button>
                      </template>
                      <template v-else-if="deletingItemId === item.id">
                        <Button
                          size="xs"
                          type="danger"
                          class="px-1"
                          @click="deleteItem(item)"
                        >
                          <Check class="py-1 text-white" />
                        </Button>
                        <Button
                          size="xs"
                          type="secondary"
                          class="px-1"
                          @click="cancelDelete"
                        >
                          <X class="py-1" />
                        </Button>
                      </template>
                      <template v-else>
                        <Button
                          size="xs"
                          type="primary"
                          class="px-1"
                          @click="startEdit(item)"
                        >
                          <Edit2 class="py-1 text-white" />
                        </Button>
                        <Button
                          size="xs"
                          type="danger"
                          class="px-1"
                          @click="confirmDelete(item)"
                        >
                          <Trash2 class="py-1 text-white" />
                        </Button>
                      </template>
                    </div>
                    <div
                      v-if="editErrors[item.id]"
                      class="text-xs text-red-600 text-center max-w-[150px]"
                    >
                      {{ editErrors[item.id] }}
                    </div>
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
