<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="text-xl font-semibold pb-2 px-6 pt-2">
    <slot>{{ text }}</slot>
  </div>
</template>
