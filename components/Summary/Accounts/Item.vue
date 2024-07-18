<script lang="ts" setup>
import type { PropType } from 'vue'
import type { AccountComplete } from '~~/stores/accounts'

const props = defineProps({
  account: {
    type: Object as PropType<AccountComplete>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-row w-full">
    <div class="bg-emerald-800 px-4 py-1 w-1/2 font-semibold">
      {{ account.name }}
    </div>
    <div class="w-full flex items-center px-4 font-medium bg-gray-700">
      {{ account.currencyData.symbol }}{{ account.balance }}
    </div>
  </div>
</template>
