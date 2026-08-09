<script lang="ts" setup>
import { formatUsd } from './formatUsd'
import type { ExpenseSharePeriodLine } from '~~/types/expenseShareTypes'

defineProps<{
  lines: ExpenseSharePeriodLine[]
}>()

const { t } = useLang()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-border">
    <table class="w-full text-sm">
      <thead class="bg-muted/40 text-left">
        <tr>
          <th class="px-3 py-2 font-medium">
            {{ t('pages.expenseShare.lines.category') }}
          </th>
          <th class="px-3 py-2 font-medium text-right">
            {{ t('pages.expenseShare.lines.expense_total') }}
          </th>
          <th class="px-3 py-2 font-medium text-right">
            {{ t('pages.expenseShare.lines.partner_share') }}
          </th>
          <th class="px-3 py-2 font-medium text-right">
            {{ t('pages.expenseShare.lines.tx_count') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="lines.length === 0">
          <td colspan="4" class="px-3 py-4 text-center text-muted-foreground">
            {{ t('pages.expenseShare.lines.empty') }}
          </td>
        </tr>
        <tr
          v-for="(line, idx) in lines"
          :key="line.id ?? `${line.category_id}-${idx}`"
          class="border-t border-border"
        >
          <td class="px-3 py-2">{{ line.category_name }}</td>
          <td class="px-3 py-2 text-right">
            {{ formatUsd(line.expense_total_usd) }}
          </td>
          <td class="px-3 py-2 text-right">
            {{ formatUsd(line.partner_share_usd) }}
          </td>
          <td class="px-3 py-2 text-right">
            {{ line.transaction_count }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
