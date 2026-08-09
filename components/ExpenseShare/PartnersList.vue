<script lang="ts" setup>
import { Pencil } from 'lucide-vue-next'
import PartnerForm from './PartnerForm.vue'
import {
  getExpenseSharePartnerList,
  patchExpenseSharePartner,
} from '~~/api/expenseSharePartners'
import type { ExpenseSharePartner } from '~~/types/expenseShareTypes'
import { toAPIError } from '~~/utils/apiError'
import { useNotificationsStore } from '~~/stores/notifications'

const { t } = useLang()
const notifications = useNotificationsStore()

const partners = ref<ExpenseSharePartner[]>([])
const loading = ref(false)
const errorMessage = ref('')
const onlyActive = ref(true)
const formPartner = ref<ExpenseSharePartner | null>(null)
const formRef = ref<InstanceType<typeof PartnerForm> | null>(null)

async function loadPartners() {
  loading.value = true
  errorMessage.value = ''
  try {
    partners.value = await getExpenseSharePartnerList(
      onlyActive.value ? { is_active: true } : undefined
    )
  } catch (e) {
    errorMessage.value = toAPIError(e).message
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formPartner.value = null
  nextTick(() => formRef.value?.open())
}

function openEdit(partner: ExpenseSharePartner) {
  formPartner.value = partner
  nextTick(() => formRef.value?.open())
}

async function toggleActive(partner: ExpenseSharePartner) {
  try {
    await patchExpenseSharePartner(partner.id, {
      contact: partner.contact_name,
      is_active: !partner.is_active,
      default_partner_percent: partner.default_partner_percent,
      includes: [...(partner.include_ids ?? [])],
      excludes: [...(partner.exclude_ids ?? [])],
    })
    notifications.addNotification({
      type: 'success',
      text: t('pages.expenseShare.partners.update.success'),
    })
    await loadPartners()
  } catch (e) {
    notifications.addNotification({
      type: 'error',
      text: toAPIError(e).message,
    })
  }
}

watch(onlyActive, () => {
  loadPartners()
})

onMounted(() => {
  loadPartners()
})

defineExpose({ refresh: loadPartners })
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center gap-3 mb-4">
      <Button size="sm" @click="openCreate">
        {{ t('pages.expenseShare.partners.create.button') }}
      </Button>
      <label class="flex items-center gap-2 text-sm cursor-pointer">
        <input v-model="onlyActive" type="checkbox" class="rounded" />
        <span>{{ t('pages.expenseShare.partners.filter.active_only') }}</span>
      </label>
    </div>

    <div v-if="errorMessage" class="mb-3 text-sm text-red-500">
      {{ errorMessage }}
    </div>
    <div v-if="loading" class="py-6 text-sm text-muted-foreground">
      {{ t('pages.expenseShare.common.loading') }}
    </div>
    <div
      v-else-if="partners.length === 0"
      class="py-8 text-center text-muted-foreground"
    >
      {{ t('pages.expenseShare.partners.empty') }}
    </div>
    <div v-else class="overflow-x-auto rounded-lg border border-border">
      <table class="w-full text-sm">
        <thead class="bg-muted/40 text-left">
          <tr>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.contact') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.default_percent') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.includes') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.excludes') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.active') }}
            </th>
            <th class="px-3 py-2 font-medium">
              {{ t('pages.expenseShare.partners.table.actions') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="partner in partners"
            :key="partner.id"
            class="border-t border-border"
          >
            <td class="px-3 py-2">{{ partner.contact_name }}</td>
            <td class="px-3 py-2">
              {{ partner.default_partner_percent ?? '—' }}%
            </td>
            <td class="px-3 py-2">
              {{ (partner.include_ids ?? []).length }}
            </td>
            <td class="px-3 py-2">
              {{ (partner.exclude_ids ?? []).length }}
            </td>
            <td class="px-3 py-2">
              <button
                type="button"
                class="text-sky-500 hover:underline"
                @click="toggleActive(partner)"
              >
                {{
                  partner.is_active
                    ? t('pages.expenseShare.common.yes')
                    : t('pages.expenseShare.common.no')
                }}
              </button>
            </td>
            <td class="px-3 py-2">
              <button
                type="button"
                class="p-1 rounded hover:bg-muted"
                :title="t('pages.expenseShare.partners.update.button')"
                @click="openEdit(partner)"
              >
                <Pencil class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <PartnerForm ref="formRef" :partner="formPartner" @saved="loadPartners" />
  </div>
</template>
