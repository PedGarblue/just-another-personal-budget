<script lang="ts" setup>
import type { PropType } from 'vue'
import type { AccountComplete } from '@/stores/accounts'

const props = defineProps({
  account: {
    type: Object as PropType<AccountComplete>,
    required: true,
  },
})

const displayDecimalPlaces = computed(() => {
  const a = props.account
  if (a.decimal_places != null) return a.decimal_places
  const c = a.currencyData
  if (c.default_decimal_places != null) return c.default_decimal_places
  return c.asset_kind === 'crypto' ? 8 : 2
})

const formattedAccountBalance = computed(() => {
  const n = parseFloat(props.account.balance)
  if (Number.isNaN(n)) return props.account.balance
  return n.toFixed(displayDecimalPlaces.value)
})
</script>

<template>
  <div
    class="grid w-full odd:bg-gray-200 even:bg-gray-100 dark:odd:bg-slate-800 dark:even:bg-green-500 dark:even:text-gray-900"
    :class="account.balance_as_main_currency ? 'grid-cols-6' : 'grid-cols-2'"
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
      {{ `${account.currencyData.symbol} ${formattedAccountBalance}` }}
    </div>
    <div
      v-if="account.balance_as_main_currency"
      class="flex items-center justify-end px-2 font-semibold bg-gray-600 text-white text-xs"
    >
      {{ `$${account.balance_as_main_currency}` }}
    </div>
  </div>
</template>
