<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { format } from 'date-fns'
import { createExchange } from '@/api/exchanges'
import { AccountComplete, useAccounts } from '~~/stores/accounts'
import Modal from '~~/components/Modal.vue'

enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

const emits = defineEmits(['form-finished'])

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const accountsList = accountsState.getAccounts
const defaultData = {
  description: '',
  date: new Date(),
  fromAmount: '',
  toAmount: '',
}
const transactionData = reactive({ ...defaultData })
const accountFrom = ref<AccountComplete>(accountsList[0])
const accountTo = ref<AccountComplete>(accountsList[1])
const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  clearForm()
  modal.value?.close()
}
const clearForm = () => {
  transactionData.description = defaultData.description
  transactionData.date = defaultData.date
  accountFrom.value = accountsList[0]
  accountTo.value = accountsList[1]
  transactionData.fromAmount = defaultData.fromAmount
  transactionData.toAmount = defaultData.toAmount
  loadingState.value = LoadingStatus.IDLE
}

const addExchange = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const { description, date, fromAmount, toAmount } = transactionData
  const data = {
    description,
    date: format(new Date(date), 'yyyy-MM-dd'),
    from_account: accountFrom.value.id,
    to_account: accountTo.value.id,
    from_amount: fromAmount,
    to_amount: toAmount,
  }

  loadingState.value = LoadingStatus.LOADING

  try {
    await createExchange(data)
    loadingState.value = LoadingStatus.FINISHED
    emits('form-finished')
  } catch (error) {
    loadingState.value = LoadingStatus.ERROR
  }
}
</script>

<template>
  <div>
    <Button @click="openModal">{{
      t('pages.summary.exchanges.create.title')
    }}</Button>
    <Modal ref="modal">
      <template #header>
        <h3>
          {{ t('pages.summary.exchanges.create.title') }}
        </h3>
        {{ transactionData }}
      </template>
      <template #body>
        <template v-if="loadingState === LoadingStatus.LOADING">
          <div class="flex w-full h-full items-center justify-center p-16">
            <IconMdi:loading class="text-[5rem] animate-spin" />
          </div>
        </template>
        <template v-else-if="loadingState === LoadingStatus.FINISHED">
          <div class="flex w-full h-full items-center justify-center p-16">
            <IconMdi:checkbox-marked-circle
              class="text-[5rem] text-green-500"
            />
          </div>
        </template>
        <div v-else class="flex flex-col gap-2">
          <div>
            <div class="text-base">Date</div>
            <VueDatePicker v-model="transactionData.date" />
          </div>
          <FormTextInput
            v-model="transactionData.description"
            size="md"
            class="md:1/3"
            title="Description"
          />
          <!-- Account From  -->
          <Select
            v-model="accountFrom"
            :options="accountsList"
            title="Sender Account"
          >
            <template #selected-value="{ selected }">
              {{ selected ? selected.name : '' }}
            </template>
            <template #item-value="{ option }">
              {{ option.name }}
            </template>
          </Select>
          <FormTextInput
            v-model="transactionData.fromAmount"
            type="number"
            size="md"
            class="md:1/3"
            title="Sender Account Amount"
          >
            <template #prefix>
              {{ accountFrom.currencyData.name }}
            </template>
          </FormTextInput>

          <!-- Account To  -->
          <Select
            v-model="accountTo"
            :options="accountsList"
            title="Recipient Account"
          >
            <template #selected-value="{ selected }">
              {{ selected ? selected.name : '' }}
            </template>
            <template #item-value="{ option }">
              {{ option.name }}
            </template>
          </Select>
          <FormTextInput
            v-model="transactionData.toAmount"
            type="number"
            size="md"
            class="md:1/3"
            title="Recipient Account Amount"
          >
            <template #prefix>
              {{ accountTo.currencyData.name }}
            </template>
          </FormTextInput>
        </div>
      </template>
      <template #footer>
        <div
          v-if="loadingState === LoadingStatus.FINISHED"
          class="flex flex-row gap-6"
        >
          <Button @click="() => clearForm()">
            {{ t('pages.summary.exchanges.create.restart') }}
          </Button>
          <Button @click="() => closeModal()">
            {{ t('others.close') }}
          </Button>
        </div>
        <Button v-else @click="() => addExchange()">{{
          t('pages.summary.exchanges.create.title')
        }}</Button>
      </template>
    </Modal>
  </div>
</template>
