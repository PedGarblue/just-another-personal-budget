<template>
  <Transition name="bounce">
    <div
      v-show="visible"
      class="notification"
      :class="[getTypeClass]"
      @click="visible = false"
    >
      <IconMdi:checkCircle
        v-if="type === 'success'"
        class="notification-icon"
      />
      <IconMdi:closeOutline
        v-else-if="type === 'error'"
        class="notification-icon"
      />
      <IconMdi:alert v-else-if="type === 'warning'" class="notification-icon" />
      <IconMdi:messageTextOutline v-else class="notification-icon" />
      <span>
        {{ text }}
      </span>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String as () => 'success' | 'error' | 'warning' | 'info',
    default: 'info',
  },
  text: {
    type: String,
    required: true,
  },
})
const visible = ref(true)

const getTypeClass = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}[props.type]
</script>

<style lang="postcss" scoped>
.notification {
  @apply fixed
    flex flex-row
    items-center
    gap-2
    z-50
    top-0
    right-0
    m-4
    p-4
    text-center
    bg-opacity-90
    rounded
    font-bold
    border-l-6
    cursor-pointer;
}
.success {
  @apply bg-green-500 text-white border-green-600;
}
.error {
  @apply bg-red-500 text-white border-red-600;
}
.warning {
  @apply bg-yellow-500 text-white border-yellow-600;
}
.info {
  @apply bg-gray-500 text-white border-gray-600;
}
.notification-icon {
  @apply text-2xl;
}
.bounce-enter-active,
.bounce-leave-active,
.bounce-enter,
.bounce-leave-to {
  transition: transform 0.5s;
}

.bounce-enter,
.bounce-leave-to {
  transform: translateY(-50px);
}
</style>
