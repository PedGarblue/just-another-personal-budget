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
    <CardTitle>{{ account.name }}</CardTitle>
    <CardContent>
      {{ account.currencyData.name }}.{{ account.balance }}
    </CardContent>
  </Card>
</template>
