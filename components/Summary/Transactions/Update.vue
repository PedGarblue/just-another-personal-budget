<script lang="ts" setup>
import { PropType } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { updateTransaction, TransactionBase } from '~~/api/transactions'
import { AccountComplete, useAccounts } from '~~/stores/accounts'
import { DisplayTransaction } from '~~/types/transactionTypes'
import Modal from '~~/components/Modal.vue'

enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

const emits = defineEmits(['form-finished'])

const props = defineProps({
  transaction: {
    type: Object as PropType<DisplayTransaction>,
    required: true,
  },
})

// data
const { t } = useLang()
const modal = ref<InstanceType<typeof Modal> | null>(null)
const accountsState = useAccounts()
const accountsList = accountsState.getAccounts
const getAccount = accountsState.getAccount
const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)
const defaultData = {
  description: '',
  date: new Date(),
  account: 0,
  amount: '',
}

// form data
const transactionData = reactive(props.transaction)
const date = ref<Date>(new Date(props.transaction.date))
const account = ref<AccountComplete>(getAccount(props.transaction.account))

// methods

const clearForm = () => {
  transactionData.description = defaultData.description
  transactionData.date = new Date()
  transactionData.account = defaultData.account
  transactionData.amount = defaultData.amount
  account.value = accountsList[0]
  loadingState.value = LoadingStatus.IDLE
}

const openModal = () => {
  modal.value?.open()
}

const closeModal = () => {
  clearForm()
  modal.value?.close()
}

const putTransaction = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const { description, amount, date } = transactionData
  const data: TransactionBase = {
    description,
    date,
    account: account.value.id,
    amount,
  }

  loadingState.value = LoadingStatus.LOADING

  try {
    const updated = await updateTransaction(props.transaction.id, data)
    loadingState.value = LoadingStatus.FINISHED
    emits('form-finished')
  } catch (error) {
    loadingState.value = LoadingStatus.ERROR
  }
}
</script>

<template>
  <div>
    <IconMdi:pencil-box-outline
      class="text-lg cursor-pointer"
      @click="openModal"
    />
    <Modal ref="modal">
      <template #header>
        <h3>
          {{ t('pages.summary.transactions.update.title') }}
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
            <VueDatePicker
              v-model="transactionData.date"
              required
            ></VueDatePicker>
          </div>
          <Select
            v-model="account"
            :options="accountsList"
            :default="account"
            title="Account"
            required
          >
            <template #selected-value="{ selected }">
              {{ selected ? selected.name : '' }}
            </template>
            <template #item-value="{ option }">
              {{ option.name }}
            </template>
          </Select>
          <FormTextInput
            v-model="transactionData.description"
            size="md"
            class="md:1/3"
            title="Description"
            required
          />
          <FormTextInput
            v-model="transactionData.amount"
            type="number"
            size="md"
            class="md:1/3"
            title="Amount"
            required
          >
            <template #prefix>
              {{ account.currencyData.name }}
            </template>
          </FormTextInput>
        </div>
      </template>
      <template #footer>
        <Button
          v-if="loadingState === LoadingStatus.FINISHED"
          @click="closeModal"
        >
          {{ t('others.close') }}</Button
        >
        <Button v-else @click="putTransaction">{{
          t('pages.summary.transactions.update.title')
        }}</Button>
      </template>
    </Modal>
  </div>
</template>
