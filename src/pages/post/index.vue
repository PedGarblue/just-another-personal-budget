<script lang="ts" setup>
import { capitalize } from '@/utils/str'

// composable
const { t } = useLang()

// compiler macro
useHead(() => ({
  title: capitalize(t('pages.post.title')),
  meta: [
    {
      name: 'description',
      content: t('pages.post.description'),
    },
  ],
}))
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="$t('pages.post.title')" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <h1>Post in empty</h1>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
