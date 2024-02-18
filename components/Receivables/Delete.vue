<script lang="ts" setup>
import type { PropType } from 'vue'
import type { DisplayTransaction } from '~~/types/transactionTypes'
import { deleteReceivable } from '~~/api/receivables'
import { useNotificationsStore } from '~~/stores/notifications'

enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

const emits = defineEmits(['form-finished'])

const props = defineProps({
  receivable: {
    type: Object as PropType<DisplayTransaction>,
    required: true,
  },
})

// data
const { t } = useLang()
const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)
const notification = useNotificationsStore()

// methods
const removeReceivable = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const { id } = props.receivable

  loadingState.value = LoadingStatus.LOADING

  try {
    await deleteReceivable(id)
    loadingState.value = LoadingStatus.FINISHED
    notification.addNotification({
      type: 'warning',
      text: t('pages.investments.receivables.delete.success'),
    })
    emits('form-finished')
  } catch (error) {
    loadingState.value = LoadingStatus.ERROR
  }
}
</script>

<template>
  <IconMdi:delete-outline
    class="text-lg text-red-600 cursor-pointer"
    @click="() => removeReceivable()"
  />
</template>
