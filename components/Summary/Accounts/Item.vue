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
  <div
    class="account"
    :class="{
      'grid-cols-6': account.balance_as_main_currency,
      'grid-cols-2': !account.balance_as_main_currency,
    }"
  >
    <div
      class="px-4 py-1 font-semibold"
      :class="{
        'col-span-3': account.balance_as_main_currency,
      }"
    >
      {{ account.name }}
    </div>
    <div
      class="flex items-center px-2 font-semibold ml-auto text-right"
      :class="{
        'col-span-2': account.balance_as_main_currency,
      }"
    >
      {{ `${account.currencyData.symbol} ${account.balance}` }}
    </div>
    <div
      v-if="account.balance_as_main_currency"
      class="flex items-center justify-end px-2 font-semibold bg-gray-600 text-white text-xs"
    >
      {{ `$${account.balance_as_main_currency}` }}
    </div>
  </div>
</template>

<style lang="postcss">
.account {
  @apply grid w-full;
}
.account:nth-child(odd) {
  @apply bg-gray-200 dark:bg-slate-800;
}
.account:nth-child(even) {
  @apply bg-gray-100 dark:bg-green-500 dark:text-gray-900;
}
</style>
