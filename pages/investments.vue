<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle
        :text="$t('pages.investments.index.title')"
        class="capitalize"
      />
    </PageHeader>
    <PageBody>
      <Receivables></Receivables>
    </PageBody>
  </PageWrapper>
</template>
