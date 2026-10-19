<script lang="ts" setup>
import type { Contact } from '@/api/contacts'
import { getContactList } from '@/api/contacts'
import {
  createExpenseSharePartner,
  patchExpenseSharePartner,
} from '@/api/expenseSharePartners'
import type {
  ExpenseSharePartner,
  ExpenseSharePartnerWrite,
} from '@/types/expenseShareTypes'
import { toAPIError } from '@/utils/apiError'
import Modal from '@/components/Modal.vue'
import { useDataSync } from '@/stores/dataSync'
import { useNotificationsStore } from '@/stores/notifications'

const props = defineProps<{
  partner?: ExpenseSharePartner | null
}>()

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const { t } = useLang()
const notifications = useNotificationsStore()
const dataSync = useDataSync()
const modal = ref<InstanceType<typeof Modal> | null>(null)

const contact = ref('')
const isActive = ref(true)
const defaultPartnerPercent = ref('50.00')
const includes = ref<number[]>([])
const excludes = ref<number[]>([])
const contactRows = ref<Contact[]>([])
const saving = ref(false)
const errorMessage = ref('')

const isEdit = computed(() => !!props.partner?.id)

function resetFromPartner() {
  if (props.partner) {
    contact.value = props.partner.contact_name
    isActive.value = props.partner.is_active
    defaultPartnerPercent.value =
      props.partner.default_partner_percent ?? '50.00'
    includes.value = [...(props.partner.include_ids ?? [])]
    excludes.value = [...(props.partner.exclude_ids ?? [])]
  } else {
    contact.value = ''
    isActive.value = true
    defaultPartnerPercent.value = '50.00'
    includes.value = []
    excludes.value = []
  }
  errorMessage.value = ''
}

async function open() {
  resetFromPartner()
  const data = await getContactList({ page_size: 500 })
  contactRows.value = data?.results ?? []
  modal.value?.open()
}

function close() {
  modal.value?.close()
}

async function save() {
  if (!contact.value.trim()) {
    errorMessage.value = t('pages.expenseShare.partners.form.contact_required')
    return
  }
  saving.value = true
  errorMessage.value = ''
  const body: ExpenseSharePartnerWrite = {
    contact: contact.value.trim(),
    is_active: isActive.value,
    default_partner_percent: defaultPartnerPercent.value || null,
    includes: [...includes.value],
    excludes: [...excludes.value],
  }
  try {
    if (isEdit.value && props.partner) {
      await patchExpenseSharePartner(props.partner.id, body)
      notifications.addNotification({
        type: 'success',
        text: t('pages.expenseShare.partners.update.success'),
      })
    } else {
      await createExpenseSharePartner(body)
      notifications.addNotification({
        type: 'success',
        text: t('pages.expenseShare.partners.create.success'),
      })
    }
    close()
    dataSync.notifyExpenseShareChanged()
    emit('saved')
  } catch (e) {
    errorMessage.value = toAPIError(e).message
  } finally {
    saving.value = false
  }
}

defineExpose({ open, close })
</script>

<template>
  <Modal ref="modal">
    <template #header>
      {{
        isEdit
          ? t('pages.expenseShare.partners.update.title')
          : t('pages.expenseShare.partners.create.title')
      }}
    </template>
    <template #body>
      <div v-if="errorMessage" class="mb-3 text-sm text-red-500">
        {{ errorMessage }}
      </div>
      <div class="flex flex-col gap-4">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium">
            {{ t('pages.expenseShare.partners.form.contact') }}
          </span>
          <input
            v-model="contact"
            list="expense-share-contact-suggestions"
            type="text"
            class="rounded-md border border-border bg-background px-3 py-2"
            :placeholder="
              t('pages.expenseShare.partners.form.contact_placeholder')
            "
          />
          <datalist id="expense-share-contact-suggestions">
            <option v-for="c in contactRows" :key="c.id" :value="c.name" />
          </datalist>
        </label>

        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium">
            {{ t('pages.expenseShare.partners.form.default_percent') }}
          </span>
          <input
            v-model="defaultPartnerPercent"
            type="number"
            min="0"
            max="100"
            step="0.01"
            class="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>

        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input v-model="isActive" type="checkbox" class="rounded" />
          <span>{{ t('pages.expenseShare.partners.form.is_active') }}</span>
        </label>

        <ExpenseShareCategoryTreePicker
          v-model:includes="includes"
          v-model:excludes="excludes"
        />
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <Button type="secondary" size="sm" :disabled="saving" @click="close">
          {{ t('pages.expenseShare.common.cancel') }}
        </Button>
        <Button size="sm" :disabled="saving" @click="save">
          {{
            saving
              ? t('pages.expenseShare.common.saving')
              : t('pages.expenseShare.common.save')
          }}
        </Button>
      </div>
    </template>
  </Modal>
</template>
