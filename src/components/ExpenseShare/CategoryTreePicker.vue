<script lang="ts" setup>
import type { CategoryAPI } from '@/types/categories'
import { useTransactions } from '@/stores/transactions'

const props = defineProps<{
  includes: number[]
  excludes: number[]
}>()

const emit = defineEmits<{
  (e: 'update:includes', value: number[]): void
  (e: 'update:excludes', value: number[]): void
}>()

const { t } = useLang()
const transactionsStore = useTransactions()

onMounted(async () => {
  if (transactionsStore.getCategories.length === 0) {
    await transactionsStore.fetchCategories()
  }
})

const expenseCategories = computed(() =>
  transactionsStore.getCategories.filter((c) => c.type === 'expense')
)

interface CategoryNode {
  category: CategoryAPI
  children: CategoryAPI[]
}

const tree = computed((): CategoryNode[] => {
  const cats = expenseCategories.value
  const roots = cats.filter((c) => !c.parent_category)
  return roots.map((root) => ({
    category: root,
    children: cats.filter((c) => c.parent_category === root.id),
  }))
})

const includeSet = computed(() => new Set(props.includes))
const excludeSet = computed(() => new Set(props.excludes))

function descendantsOf(parentId: number): number[] {
  const cats = expenseCategories.value
  const result: number[] = []
  const queue = cats
    .filter((c) => c.parent_category === parentId)
    .map((c) => c.id)
  while (queue.length) {
    const id = queue.shift()!
    result.push(id)
    for (const child of cats.filter((c) => c.parent_category === id)) {
      queue.push(child.id)
    }
  }
  return result
}

function isUnderIncludedParent(categoryId: number): boolean {
  const cat = expenseCategories.value.find((c) => c.id === categoryId)
  if (!cat?.parent_category) return false
  let current: number | undefined = cat.parent_category
  while (current) {
    if (includeSet.value.has(current)) return true
    const parent = expenseCategories.value.find((c) => c.id === current)
    current = parent?.parent_category
  }
  return false
}

function toggleInclude(id: number, checked: boolean) {
  const next = new Set(props.includes)
  if (checked) {
    next.add(id)
  } else {
    next.delete(id)
    const desc = new Set(descendantsOf(id))
    const cleanedExcludes = props.excludes.filter((eid) => !desc.has(eid))
    emit('update:excludes', cleanedExcludes)
  }
  emit('update:includes', [...next])
}

function toggleExclude(id: number, checked: boolean) {
  if (!isUnderIncludedParent(id)) return
  const next = new Set(props.excludes)
  if (checked) {
    next.add(id)
  } else {
    next.delete(id)
  }
  emit('update:excludes', [...next])
}

function isIncluded(id: number) {
  return includeSet.value.has(id)
}

function isExcluded(id: number) {
  return excludeSet.value.has(id)
}

function canExclude(id: number) {
  return isUnderIncludedParent(id)
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <p class="text-sm font-semibold mb-1">
        {{ t('pages.expenseShare.partners.form.includes') }}
      </p>
      <p class="text-xs text-muted-foreground mb-2">
        {{ t('pages.expenseShare.partners.form.includes_help') }}
      </p>
      <div v-if="tree.length === 0" class="text-sm text-muted-foreground py-2">
        {{ t('pages.expenseShare.partners.form.no_categories') }}
      </div>
      <ul
        v-else
        class="space-y-2 max-h-64 overflow-y-auto border border-border rounded-md p-3"
      >
        <li v-for="node in tree" :key="node.category.id">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              class="rounded border-gray-300"
              :checked="isIncluded(node.category.id)"
              @change="
                toggleInclude(
                  node.category.id,
                  ($event.target as HTMLInputElement).checked
                )
              "
            />
            <span class="font-medium text-sm">{{ node.category.name }}</span>
          </label>
          <ul
            v-if="node.children.length"
            class="ml-6 mt-1 space-y-1 border-l border-border pl-3"
          >
            <li
              v-for="child in node.children"
              :key="child.id"
              class="flex items-center gap-2"
            >
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="rounded border-gray-300"
                  :checked="isIncluded(child.id)"
                  @change="
                    toggleInclude(
                      child.id,
                      ($event.target as HTMLInputElement).checked
                    )
                  "
                />
                <span class="text-sm">{{ child.name }}</span>
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div>
      <p class="text-sm font-semibold mb-1">
        {{ t('pages.expenseShare.partners.form.excludes') }}
      </p>
      <p class="text-xs text-muted-foreground mb-2">
        {{ t('pages.expenseShare.partners.form.excludes_help') }}
      </p>
      <ul
        class="space-y-2 max-h-48 overflow-y-auto border border-border rounded-md p-3"
      >
        <template v-for="node in tree" :key="`ex-${node.category.id}`">
          <li
            v-for="child in node.children"
            :key="`ex-child-${child.id}`"
            class="flex items-center gap-2"
          >
            <label
              class="flex items-center gap-2"
              :class="
                canExclude(child.id)
                  ? 'cursor-pointer'
                  : 'opacity-40 cursor-not-allowed'
              "
            >
              <input
                type="checkbox"
                class="rounded border-gray-300"
                :checked="isExcluded(child.id)"
                :disabled="!canExclude(child.id)"
                @change="
                  toggleExclude(
                    child.id,
                    ($event.target as HTMLInputElement).checked
                  )
                "
              />
              <span class="text-sm">
                {{ node.category.name }} → {{ child.name }}
              </span>
            </label>
          </li>
        </template>
        <li
          v-if="tree.every((n) => n.children.length === 0)"
          class="text-sm text-muted-foreground"
        >
          {{ t('pages.expenseShare.partners.form.no_excludable') }}
        </li>
      </ul>
    </div>
  </div>
</template>
