<script lang="ts" setup>
import { PropType } from 'vue'
import { AccountComplete } from '~~/stores/accounts'

const props = defineProps({
  account: {
    type: Object as PropType<AccountComplete>,
    required: true,
  },
})
</script>

<template>
  <Card>
    <CardTitle class="px-2 py-1 lg:px-6 lg:py-2 !text-base lg:text-lg">{{
      account.name
    }}</CardTitle>
    <CardContent class="px-2 py-1 lg:px-6 lg:py-6">
      {{ account.currencyData.symbol }}{{ account.balance }}
    </CardContent>
  </Card>
</template>
