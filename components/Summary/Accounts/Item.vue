<script lang="ts" setup>
import type { PropType } from 'vue'
import DataPill from '~~/components/generic/DataPill.vue'
import type { AccountComplete } from '~~/stores/accounts'

const props = defineProps({
  account: {
    type: Object as PropType<AccountComplete>,
    required: true,
  },
})
</script>

<template>
  <DataPill
    :title="account.name"
    :text="`${account.currencyData.symbol}${account.balance}`"
    size="sm"
  />
</template>
