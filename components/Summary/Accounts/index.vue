<script setup>
import { useAccounts } from '~/stores/accounts'

const { t } = useLang()
const accountsStore = useAccounts()

const currenciesData = computed(() => accountsStore.getCurrenciesWithAccounts)

onMounted(() => {
  accountsStore.fetchData()
})
</script>

<template>
  <PageSection>
    <div>
      <div class="grid lg:grid-cols-3 gap-4">
        <div
          v-for="currency in currenciesData"
          :key="currency.id"
          class="bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-gray-200 dark:border-gray-800"
        >
          <div class="flex flex-row">
            <div class="px-4 py-1 font-bold">
              {{ currency.name }}
            </div>
            <div class="flex items-center px-4 font-bold ml-auto">
              <span class="self-center">
                {{ `${currency.symbol} ${currency.balance}` }}
              </span>
            </div>
          </div>
          <div class="flex flex-col flex-wrap">
            <SummaryAccountsItem
              v-for="account in currency.accounts"
              :key="account.id"
              :account="account"
            />
          </div>
        </div>
        <SummaryAccountsCreate @form-finished="accountsStore.fetchData()">
          <template #button>
            <div
              class="flex flex-col items-center justify-center gap-2 min-w-60 w-full py-4 border border-gray-800 rounded-lg cursor-pointer transition-shadow hover:shadow hover:shadow-gray-700"
              :class="{
                'h-60': accountsStore.getAccounts.length < 3,
                'h-full': accountsStore.getAccounts.length >= 3,
              }"
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
