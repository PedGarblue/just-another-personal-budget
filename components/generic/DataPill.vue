<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
  },
})
</script>

<template>
  <span
    class="flex flex-row bg-white rounded-full overflow-hidden border border-light-900"
  >
    <div class="bg-emerald-600 text-white font-bold" :class="size">
      {{ title }}
    </div>
    <div class="bg-white text-gray-700" :class="size">
      {{ text }}
    </div>
  </span>
</template>

<style scoped lang="postcss">
.xs {
  @apply text-xs px-1;
}
.sm {
  @apply text-sm px-3 py-0.5;
}
.md {
  @apply text-md px-4 py-2;
}
.lg {
  @apply text-lg px-5 py-2;
}
</style>
