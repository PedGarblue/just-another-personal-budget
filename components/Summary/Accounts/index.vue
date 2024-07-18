<script setup>
import { useAccounts } from '~/stores/accounts'
import DataPill from '~~/components/generic/DataPill.vue'

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
      <div
        v-if="accountsStore.getAccounts.length > 0"
        class="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="currency in currenciesData"
          :key="currency.id"
          class="bg-gray-100 dark:bg-gray-900 rounded-md border-2 border-gray-200 dark:border-gray-800"
        >
          <div class="flex flex-row">
            <div class="bg-green-600 px-4 py-1 font-bold">
              {{ currency.name }}
            </div>
            <div
              class="w-full flex items-center bg-gray-800 px-4 font-semibold"
            >
              <span class="self-center">
                {{ currency.balance }}
              </span>
            </div>
          </div>
          <div class="flex flex-col flex-wrap gap-4 pb-4 pt-4 px-4">
            <div
              v-for="account in currency.accounts"
              :key="account.id"
              class="lg:w-auto"
            >
              <SummaryAccountsItem :account="account" />
            </div>
          </div>
        </div>
        <SummaryAccountsCreate @form-finished="accountsStore.fetchData()">
          <template #button>
            <div
              class="flex flex-col items-center justify-center gap-2 w-60 py-4 border border-gray-800 rounded-lg cursor-pointer transition-shadow hover:shadow hover:shadow-gray-700"
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
