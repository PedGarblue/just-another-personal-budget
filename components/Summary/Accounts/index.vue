<script setup>
import { useAccounts } from '~/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()
const currencyConversions = ref({})

const currenciesData = computed(() =>
  accountsStore.getCurrenciesWithAccounts.filter(
    (currency) => currency.accounts.length > 0
  )
)

const getConvertedBalance = (currency, targetCurrency, rateKey) => {
  if (
    currencyConversions.value[currency.name] &&
    currencyConversions.value[currency.name][targetCurrency] &&
    currencyConversions.value[currency.name][targetCurrency].rates &&
    currencyConversions.value[currency.name][targetCurrency].rates[rateKey]
  ) {
    const rate =
      currencyConversions.value[currency.name][targetCurrency].rates[rateKey]
    return (parseFloat(currency.balance) / rate).toFixed(2)
  }
  return null
}

const getGapPercentage = (currency, targetCurrency) => {
  if (
    currencyConversions.value[currency.name] &&
    currencyConversions.value[currency.name][targetCurrency] &&
    currencyConversions.value[currency.name][targetCurrency].gap
  ) {
    return currencyConversions.value[currency.name][targetCurrency].gap
  }
  return null
}

const getAvailableTargetCurrencies = (currency) => {
  if (currencyConversions.value[currency.name]) {
    return Object.keys(currencyConversions.value[currency.name])
  }
  return []
}

const getTotalRatesCount = (currency) => {
  if (!currencyConversions.value[currency.name]) {
    return 0
  }
  let total = 0
  const targetCurrencies = Object.keys(currencyConversions.value[currency.name])
  for (const targetCurrency of targetCurrencies) {
    if (currencyConversions.value[currency.name][targetCurrency]?.rates) {
      total += Object.keys(
        currencyConversions.value[currency.name][targetCurrency].rates
      ).length
    }
  }
  return total
}

const getCurrencyExchanges = async () => {
  const { data } = await useAPIAuth('/currency-conversion/')
  currencyConversions.value = data.value
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
        >
          <template #button>
            <IconMdi:plusCircleOutline class="text-xl text-green-500" />
            {{ t('pages.summary.accounts.create.button') }}
          </template>
        </SummaryAccountsCreate>
      </div>
      <div class="grid lg:grid-cols-3 gap-4">
        <div
          v-for="currency in currenciesData"
          :key="currency.id"
          class="flex flex-col bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div class="grid grid-cols-6">
            <div class="px-4 py-1 font-bold">
              {{ currency.name }}
            </div>
            <div
              class="flex items-center px-2 font-bold ml-auto"
              :class="{
                'col-span-5': getTotalRatesCount(currency) === 0,
                'col-span-4': getTotalRatesCount(currency) === 1,
                'col-span-3': getTotalRatesCount(currency) > 1,
              }"
            >
              <span class="self-right">
                {{ `${currency.symbol} ${currency.balance}` }}
              </span>
            </div>
            <template v-if="getTotalRatesCount(currency) > 0">
              <template
                v-for="targetCurrency in getAvailableTargetCurrencies(currency)"
                :key="targetCurrency"
              >
                <template
                  v-if="
                    currencyConversions[currency.name][targetCurrency]?.rates
                  "
                >
                  <div
                    v-for="(rate, rateKey) in currencyConversions[
                      currency.name
                    ][targetCurrency].rates"
                    :key="`balance-${targetCurrency}-${rateKey}`"
                    class="flex justify-center items-center px-0 py-1 font-bold bg-gray-600 text-white text-xs"
                    :class="{
                      'col-span-2': getTotalRatesCount(currency) === 1,
                      'col-span-1': getTotalRatesCount(currency) > 1,
                    }"
                    :title="
                      t(
                        'pages.summary.accounts.balance_to_main_currency_tooltip'
                      )
                    "
                  >
                    <span>
                      {{
                        `${
                          targetCurrency === 'USD' ? '$' : '€'
                        }${getConvertedBalance(
                          currency,
                          targetCurrency,
                          rateKey
                        )}`
                      }}
                    </span>
                  </div>
                </template>
              </template>
            </template>
          </div>
          <template v-if="getAvailableTargetCurrencies(currency).length > 0">
            <div class="flex flex-wrap gap-2 px-4 py-2">
              <template
                v-for="targetCurrency in getAvailableTargetCurrencies(currency)"
                :key="targetCurrency"
              >
                <template
                  v-if="
                    currencyConversions[currency.name][targetCurrency]?.rates
                  "
                >
                  <div
                    v-for="(rate, rateKey) in currencyConversions[
                      currency.name
                    ][targetCurrency].rates"
                    :key="`rate-${targetCurrency}-${rateKey}`"
                    class="flex items-center justify-end font-bold text-white text-xs rounded"
                    :title="
                      t('pages.summary.accounts.rate_tooltip', {
                        rate: rate,
                      })
                    "
                  >
                    <span
                      class="self-center capitalize px-1 py-1 bg-blue-800 rounded-l-md"
                    >
                      {{ rateKey }}
                    </span>
                    <span
                      class="self-center bg-green-600 py-1 px-1 rounded-r-md"
                    >
                      {{ `${currency.symbol}${rate}/${targetCurrency}` }}
                    </span>
                  </div>
                  <div
                    v-if="getGapPercentage(currency, targetCurrency)"
                    class="flex items-center justify-end font-bold text-white text-xs rounded"
                    :title="t('pages.summary.accounts.gap_tooltip')"
                  >
                    <span
                      class="self-center capitalize px-1 py-1 bg-orange-800 rounded-l-md"
                    >
                      {{ targetCurrency }} Gap
                    </span>
                    <span
                      class="self-center bg-orange-600 py-1 px-1 rounded-r-md"
                    >
                      {{ `${getGapPercentage(currency, targetCurrency)}%` }}
                    </span>
                  </div>
                </template>
              </template>
            </div>
          </template>

          <div class="flex flex-1 flex-col flex-wrap">
            <SummaryAccountsItem
              v-for="account in currency.accounts"
              :key="account.id"
              :account="account"
            />
            <SummaryAccountsCreate
              :currency="currency"
              class="flex mt-auto"
              @form-finished="accountsStore.fetchData()"
            >
              <template #button>
                <div
                  class="flex w-full bg-gray-400 dark:bg-gray-700 py-1 text-green-500 transition-colors hover:text-green-400 dark:hover:bg-gray-600"
                >
                  <IconMdi:plusCircleOutline class="mx-auto text-lg" />
                </div>
              </template>
            </SummaryAccountsCreate>
          </div>
        </div>
        <SummaryAccountsCreate
          v-if="
            accountsStore.getCurrenciesWithAccounts.length <
              accountsStore.getCurrencies.length &&
            accountsStore.getCurrenciesWithAccounts.length < 3
          "
          @form-finished="accountsStore.fetchData()"
        >
          <template #button>
            <div
              class="h-60 flex flex-col items-center justify-center gap-2 min-w-60 w-full py-4 border border-gray-800 rounded-lg cursor-pointer transition-shadow hover:shadow hover:shadow-gray-700"
            >
              <div>
                <IconMdi:plusCircleOutline class="text-4xl text-green-500" />
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
    </div>
  </PageSection>
</template>

<style></style>
