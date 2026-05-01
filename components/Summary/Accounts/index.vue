<script setup>
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-vue-next'
import { useAccounts } from '~/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()
const currencyConversions = ref({})
const cryptoSectionOpen = ref(false)

const currenciesData = computed(() =>
  accountsStore.getCurrenciesWithAccounts.filter(
    (currency) => currency.accounts.length > 0
  )
)

const isCryptoCurrency = (currency) => currency.asset_kind === 'crypto'

const fiatCurrenciesData = computed(() =>
  currenciesData.value.filter((c) => !isCryptoCurrency(c))
)

const cryptoCurrenciesData = computed(() =>
  currenciesData.value.filter((c) => isCryptoCurrency(c))
)

const cryptoTotalUsd = computed(() => {
  let sum = 0
  let any = false
  for (const c of cryptoCurrenciesData.value) {
    const raw = c.balance_as_main_currency
    if (raw == null || raw === '') continue
    const n = parseFloat(raw)
    if (Number.isNaN(n)) continue
    sum += n
    any = true
  }
  return any ? sum : null
})

const cryptoTotalUsdAmountFormatted = computed(() => {
  const n = cryptoTotalUsd.value
  if (n == null) return null
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
})

const getCurrencyExchanges = async () => {
  const { data } = await useAPIAuth('/currency-conversion/')
  currencyConversions.value = data.value
}

const onAccountsUpdated = () => {
  accountsStore.fetchData()
}

onMounted(() => {
  getCurrencyExchanges()
  accountsStore.fetchData()
})
</script>

<template>
  <PageSection>
    <div>
      <div class="mb-4">
        <SummaryAccountsCreate
          v-if="
            accountsStore.getCurrenciesWithAccounts.length <
              accountsStore.getCurrencies.length &&
            accountsStore.getCurrenciesWithAccounts.length >= 3
          "
          button-class="w-auto flex items-center py-2 px-4 justify-center gap-2 border border-gray-800 rounded-full cursor-pointer transition-shadow hover:shadow hover:shadow-gray-700 font-semibold"
          @form-finished="onAccountsUpdated"
        >
          <template #button>
            <PlusCircle class="text-xl text-green-500" />
            {{ t('pages.summary.accounts.create.button') }}
          </template>
        </SummaryAccountsCreate>
      </div>
      <div class="grid lg:grid-cols-3 gap-4">
        <SummaryAccountsCurrencyColumn
          v-for="currency in fiatCurrenciesData"
          :key="currency.id"
          :currency="currency"
          :currency-conversions="currencyConversions"
          @accounts-updated="onAccountsUpdated"
        />
        <SummaryAccountsCreate
          v-if="
            accountsStore.getCurrenciesWithAccounts.length <
              accountsStore.getCurrencies.length &&
            accountsStore.getCurrenciesWithAccounts.length < 3
          "
          @form-finished="onAccountsUpdated"
        >
          <template #button>
            <div
              class="h-60 flex flex-col items-center justify-center gap-2 min-w-60 w-full py-4 border border-gray-800 rounded-lg cursor-pointer transition-shadow hover:shadow hover:shadow-gray-700"
            >
              <div>
                <PlusCircle class="text-4xl text-green-500" />
              </div>
              <p
                class="text-xs font-bold max-w-40 text-center text-gray-500 select-none"
              >
                <template v-if="accountsStore.hasAccounts">
                  {{ t('pages.summary.accounts.create.card_description') }}
                </template>
                <template v-else>
                  {{
                    t(
                      'pages.summary.accounts.create.card_description_no_accounts'
                    )
                  }}
                </template>
              </p>
            </div>
          </template>
        </SummaryAccountsCreate>
      </div>

      <div v-if="cryptoCurrenciesData.length > 0" class="mt-8">
        <button
          type="button"
          class="flex w-full items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          :aria-expanded="cryptoSectionOpen"
          :aria-label="
            cryptoSectionOpen
              ? t('pages.summary.accounts.crypto.collapse')
              : t('pages.summary.accounts.crypto.expand')
          "
          @click="cryptoSectionOpen = !cryptoSectionOpen"
        >
          <div
            class="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3"
          >
            <span>{{ t('pages.summary.accounts.crypto.section_title') }}</span>
            <span
              v-if="cryptoTotalUsdAmountFormatted"
              class="text-sm font-semibold tabular-nums text-gray-700 dark:text-gray-300"
              :title="
                t('pages.summary.accounts.balance_to_main_currency_tooltip')
              "
            >
              {{
                t('pages.summary.accounts.crypto.total_usd_approx', {
                  amount: cryptoTotalUsdAmountFormatted,
                })
              }}
            </span>
            <span
              v-else
              class="text-sm font-normal text-gray-500 dark:text-gray-400"
            >
              {{ t('pages.summary.accounts.crypto.total_usd_pending') }}
            </span>
          </div>
          <ChevronUp v-if="cryptoSectionOpen" class="h-5 w-5 shrink-0" />
          <ChevronDown v-else class="h-5 w-5 shrink-0" />
        </button>
        <div v-show="cryptoSectionOpen" class="mt-4 grid gap-4 lg:grid-cols-3">
          <SummaryAccountsCurrencyColumn
            v-for="currency in cryptoCurrenciesData"
            :key="currency.id"
            :currency="currency"
            :currency-conversions="currencyConversions"
            @accounts-updated="onAccountsUpdated"
          />
        </div>
      </div>
    </div>
  </PageSection>
</template>

<style></style>
