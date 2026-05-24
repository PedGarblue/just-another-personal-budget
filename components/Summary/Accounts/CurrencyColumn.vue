<script lang="ts" setup>
import type { PropType } from 'vue'
import { PlusCircle } from 'lucide-vue-next'
import type { Currency } from '~~/api/currencies'
import type { AccountComplete } from '~~/stores/accounts'

export type CurrencyWithAccounts = Currency & {
  accounts: AccountComplete[]
}

const { t } = useLang()

const props = defineProps({
  currency: {
    type: Object as PropType<CurrencyWithAccounts>,
    required: true,
  },
  currencyConversions: {
    type: Object as PropType<Record<string, unknown>>,
    required: true,
  },
})

const emit = defineEmits<{
  'accounts-updated': []
}>()

const conversions = computed(
  () =>
    props.currencyConversions as Record<
      string,
      Record<
        string,
        {
          rates?: Record<string, string>
          gap?: string
        }
      >
    >
)

const headerDecimalPlaces = computed(() => {
  const c = props.currency
  if (c.default_decimal_places != null) return c.default_decimal_places
  return c.asset_kind === 'crypto' ? 8 : 2
})

const formattedCurrencyBalance = computed(() => {
  const n = parseFloat(props.currency.balance)
  if (Number.isNaN(n))
    return `${props.currency.symbol} ${props.currency.balance}`
  return `${props.currency.symbol} ${n.toFixed(headerDecimalPlaces.value)}`
})

const getConvertedBalance = (
  currency: CurrencyWithAccounts,
  targetCurrency: string,
  rateKey: string
) => {
  const conv = conversions.value[currency.name]?.[targetCurrency]
  if (conv?.rates?.[rateKey]) {
    const rate = conv.rates[rateKey]
    return (parseFloat(currency.balance) / parseFloat(rate)).toFixed(2)
  }
  return null
}

const getGapPercentage = (
  currency: CurrencyWithAccounts,
  targetCurrency: string
) => {
  const gap = conversions.value[currency.name]?.[targetCurrency]?.gap
  return gap ?? null
}

const getAvailableTargetCurrencies = (currency: CurrencyWithAccounts) => {
  if (conversions.value[currency.name]) {
    return Object.keys(conversions.value[currency.name])
  }
  return []
}

const isCrypto = computed(() => props.currency.asset_kind === 'crypto')

const usdPerCoin = computed(() => {
  const r = props.currency.latest_conversion_rate_to_main
  if (r == null || r === 0) return null
  return 1 / r
})

const formattedUsdPerCoin = computed(() => {
  const n = usdPerCoin.value
  if (n == null) return null
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
})

const cryptoUsdApprox = computed(() => {
  const raw = props.currency.balance_as_main_currency
  if (raw == null || raw === '') return null
  const n = parseFloat(raw)
  if (Number.isNaN(n)) return null
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const sortedAccounts = computed(() =>
  [...props.currency.accounts].sort(
    (a, b) => parseFloat(b.balance) - parseFloat(a.balance)
  )
)
</script>

<template>
  <div
    class="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div class="grid grid-cols-6">
      <div class="px-4 py-1 font-bold">
        {{ currency.name }}
      </div>
      <div class="flex items-center px-2 font-bold ml-auto col-span-5">
        <span class="self-right">
          {{ formattedCurrencyBalance }}
        </span>
      </div>
    </div>
    <template v-if="getAvailableTargetCurrencies(currency).length > 0">
      <div class="px-2">
        <template
          v-for="targetCurrency in getAvailableTargetCurrencies(currency)"
          :key="targetCurrency"
        >
          <template v-if="conversions[currency.name]?.[targetCurrency]?.rates">
            <div
              v-for="(rate, rateKey) in conversions[currency.name][
                targetCurrency
              ].rates"
              :key="`rate-${targetCurrency}-${rateKey}`"
              class="grid grid-cols-4 py-1 text-xs border-b border-gray-300 dark:border-gray-700 last:border-b-0"
            >
              <div class="font-semibold capitalize">
                {{ rateKey }} ({{
                  targetCurrency === 'USD'
                    ? '$'
                    : targetCurrency === 'EUR'
                    ? '€'
                    : targetCurrency
                }})
              </div>
              <div class="text-gray-700 dark:text-gray-300">
                {{ `${currency.symbol}${rate}` }}
              </div>
              <div
                class="text-orange-600 dark:text-orange-400 text-right font-bold"
              >
                {{
                  getGapPercentage(currency, targetCurrency)
                    ? `${getGapPercentage(currency, targetCurrency)}%`
                    : '-'
                }}
              </div>
              <div class="font-bold text-right text-sm">
                {{
                  `${
                    targetCurrency === 'USD'
                      ? '$'
                      : targetCurrency === 'EUR'
                      ? '€'
                      : targetCurrency
                  }${getConvertedBalance(currency, targetCurrency, rateKey)}`
                }}
              </div>
            </div>
          </template>
        </template>
      </div>
    </template>

    <div
      v-if="isCrypto"
      class="px-2 py-1 text-xs border-b border-gray-300 dark:border-gray-700 space-y-1"
    >
      <template v-if="cryptoUsdApprox">
        <div
          class="grid grid-cols-2 gap-1 font-semibold"
          :title="t('pages.summary.accounts.balance_to_main_currency_tooltip')"
        >
          <span class="text-gray-600 dark:text-gray-400">
            {{ t('pages.summary.accounts.crypto.usd_approx_label') }}
          </span>
          <span class="text-right font-bold">${{ cryptoUsdApprox }}</span>
        </div>
        <div
          v-if="formattedUsdPerCoin"
          class="grid grid-cols-2 gap-1 text-gray-700 dark:text-gray-300"
        >
          <span>{{ t('pages.summary.accounts.crypto.spot_label') }}</span>
          <span class="text-right">
            {{
              t('pages.summary.accounts.crypto.spot_usd_per_unit', {
                price: formattedUsdPerCoin,
              })
            }}
          </span>
        </div>
      </template>
      <p v-else class="text-gray-600 dark:text-gray-400 italic">
        {{ t('pages.summary.accounts.crypto.rate_pending') }}
      </p>
    </div>

    <div class="flex flex-1 flex-col flex-wrap">
      <SummaryAccountsItem
        v-for="account in sortedAccounts"
        :key="account.id"
        :account="account"
      />
      <SummaryAccountsCreate
        :currency="currency"
        class="flex mt-auto"
        @form-finished="emit('accounts-updated')"
      >
        <template #button>
          <div
            class="flex w-full bg-gray-400 dark:bg-gray-700 py-1 text-green-500 transition-colors hover:text-green-400 dark:hover:bg-gray-600"
          >
            <PlusCircle class="mx-auto text-lg" />
          </div>
        </template>
      </SummaryAccountsCreate>
    </div>
  </div>
</template>
