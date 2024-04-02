<script lang="ts" setup>
import type { PropType } from 'vue'
import type { IReportAccountDisplayItem } from '~/types/reportsTypes'
import { useNotificationsStore } from '~~/stores/notifications'
import { updateReportByAccount } from '~~/api/reports'

// emits
const emits = defineEmits(['form-finished'])

// props
const props = defineProps({
  report: {
    type: Object as PropType<IReportAccountDisplayItem>,
    required: true,
  },
})

// data
const { t } = useLang()
const notifications = useNotificationsStore()

// methods
const submitUpdateReport = () => {
  updateReportByAccount({
    id: props.report.id,
    account: props.report.account,
    from_date: props.report.from_date,
    to_date: props.report.to_date,
  })
    .then(() => {
      notifications.addNotification({
        type: 'success',
        text: t('pages.reports.update.success'),
      })
      emits('form-finished')
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
}
</script>

<template>
  <div>
    <IconMdi:refresh
      class="text-xl cursor-pointer"
      @click="submitUpdateReport"
    />
  </div>
</template>
