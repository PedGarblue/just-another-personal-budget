<script lang="ts" setup>
import { PropType } from 'vue'
import type { IReportCurrencyDisplayItem } from '~/types/reportsTypes'
import { useNotificationsStore } from '~~/stores/notifications'
import { updateReportByCurrency } from '~~/api/reports/currency'

// emits
const emits = defineEmits(['form-finished'])

// props
const props = defineProps({
  report: {
    type: Object as PropType<IReportCurrencyDisplayItem>,
    required: true,
  },
})

// data
const { t } = useLang()
const notifications = useNotificationsStore()

// methods
const submitUpdateReport = () => {
  updateReportByCurrency({
    id: props.report.id,
    currency: props.report.currency,
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
