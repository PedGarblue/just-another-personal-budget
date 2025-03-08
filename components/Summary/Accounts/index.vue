<script setup>
import { useAccounts } from '~/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()

const currenciesData = computed(() =>
  accountsStore.getCurrenciesWithAccounts.filter(
    (currency) => currency.accounts.length > 0
  )
)

onMounted(() => {
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
          <div
            class="grid"
            :class="{
              'grid-cols-6': currency.latest_conversion_rate_to_main,
              'grid-cols-2': !currency.latest_conversion_rate_to_main,
            }"
          >
            <div class="px-4 py-1 font-bold">
              {{ currency.name }}
            </div>
            <div
              class="flex items-center px-2 font-bold ml-auto"
              :class="{
                'col-span-3': currency.latest_conversion_rate_to_main,
              }"
            >
              <span class="self-right">
                {{ `${currency.symbol} ${currency.balance}` }}
              </span>
            </div>
            <div
              v-if="currency.latest_conversion_rate_to_main"
              class="flex items-center justify-end px-1 font-bold bg-green-600 text-white text-xs"
              :title="
                t('pages.summary.accounts.rate_tooltip', {
                  rate: currency.latest_conversion_rate_to_main,
                })
              "
            >
              <span class="self-center">
                {{
                  `${currency.symbol}${currency.latest_conversion_rate_to_main}`
                }}
              </span>
            </div>
            <div
              v-if="currency.balance_as_main_currency"
              class="flex items-center px-2 font-bold bg-gray-600 text-white text-xs"
              :title="
                t('pages.summary.accounts.balance_to_main_currency_tooltip')
              "
            >
              <span class="self-center">
                {{ `$${currency.balance_as_main_currency}` }}
              </span>
            </div>
          </div>
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
