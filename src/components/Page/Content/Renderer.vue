<script setup>
const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  pageTitle: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <PageWrapper>
    <PageHeader>
      <PageTitle :text="pageTitle" class="capitalize" />
    </PageHeader>
    <PageBody>
      <PageSection>
        <h1>Post in empty</h1>
      </PageSection>
    </PageBody>
  </PageWrapper>
</template>
