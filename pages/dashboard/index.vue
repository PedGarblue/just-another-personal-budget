<script lang="ts" setup>
definePageMeta({
  layout: 'dashboard',
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.summary.index.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <Summary></Summary>
    </PageBody>
  </PageWrapper>
</template>
