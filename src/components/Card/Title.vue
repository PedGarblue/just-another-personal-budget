<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="text-xl font-semibold py-2 px-6">
    <slot>{{ text }}</slot>
  </div>
</template>
