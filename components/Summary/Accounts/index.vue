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
            <div class="flex items-center px-2 font-bold ml-auto col-span-5">
              <span class="self-right">
                {{ `${currency.symbol} ${currency.balance}` }}
              </span>
            </div>
          </div>
          <template v-if="getAvailableTargetCurrencies(currency).length > 0">
            <div class="px-2">
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
                        }${getConvertedBalance(
                          currency,
                          targetCurrency,
                          rateKey
                        )}`
                      }}
                    </div>
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
