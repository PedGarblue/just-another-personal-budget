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
    class="flex flex-row bg-white rounded-full overflow-hidden border border-light-600"
    :class="{
      'text-xs': size === 'xs',
      'text-sm': size === 'sm',
      'text-md': size === 'md',
      'text-lg': size === 'lg',
    }"
  >
    <div class="bg-emerald-600 text-white font-bold px-4 py-2">
      {{ title }}
    </div>
    <div class="px-4 py-2 bg-white text-gray-700">
      {{ text }}
    </div>
  </span>
</template>
