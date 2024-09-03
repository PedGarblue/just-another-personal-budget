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
  <div class="account">
    <div class="px-4 py-1 font-semibold">
      {{ account.name }}
    </div>
    <div class="flex items-center px-4 font-semibold ml-auto">
      {{ `${account.currencyData.symbol} ${account.balance}` }}
    </div>
  </div>
</template>

<style lang="postcss">
.account {
  @apply flex flex-row w-full;
}
.account:nth-child(odd) {
  @apply bg-gray-200 dark:bg-slate-800;
}
.account:nth-child(even) {
  @apply bg-gray-100 dark:bg-green-500 dark:text-gray-900;
}
</style>
