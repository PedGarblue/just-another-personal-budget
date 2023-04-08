<script lang="ts" setup>
import { PropType } from 'vue'
import { deleteTransaction } from '~~/api/transactions'
import { DisplayTransaction } from '~~/types/transactionTypes'

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
const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)

// methods
const removeTransaction = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const { id } = props.transaction

  loadingState.value = LoadingStatus.LOADING

  try {
    await deleteTransaction(id)
    loadingState.value = LoadingStatus.FINISHED
    emits('form-finished')
  } catch (error) {
    loadingState.value = LoadingStatus.ERROR
  }
}
</script>

<template>
  <IconMdi:delete-outline
    class="text-lg text-red-600 cursor-pointer"
    @click="() => removeTransaction()"
  />
</template>
