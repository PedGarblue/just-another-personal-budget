<template>
  <Teleport to="body" @keydown.esc="close">
    <Transition name="fade">
      <div v-if="isVisible" class="modal-mask">
        <div class="modal-wrapper">
          <div class="fixed inset-0 transform transition-all" @click="close">
            <div class="absolute inset-0 bg-gray-800 opacity-50"></div>
          </div>
          <div class="modal-contents">
            <slot name="contents">
              <Card class="modal-card">
                <CardTitle>
                  <slot name="header"> </slot>
                </CardTitle>
                <CardContent>
                  <slot name="body"> </slot>
                </CardContent>
                <CardFooter>
                  <slot name="footer"> </slot>
                </CardFooter>
              </Card>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
const isVisible = ref(false)

const open = () => {
  isVisible.value = true
}
const close = () => {
  isVisible.value = false
}

const onEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

const onMobileBack = (e: Event) => {
  e.preventDefault()
  close()
}
defineExpose({
  open,
  close,
})

onMounted(() => {
  window.addEventListener('keydown', onEscape)
  window.addEventListener('popstate', onMobileBack)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
  window.removeEventListener('popstate', onMobileBack)
})
</script>

<style scoped lang="postcss">
.modal-mask {
  position: fixed;
  z-index: 9997;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  @apply align-top md:align-middle;
  display: table-cell;
}

.modal-card {
  z-index: 9998;
  margin: auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow: visible;
}
</style>

<style lang="postcss">
.fade-enter-active .modal-contents {
  transition: all 0.1s ease-out;
}
.fade-leave-active .modal-contents {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter-from .modal-contents,
.fade-leave-to .modal-contents {
  transform: translateY(5rem);
  opacity: 0;
}
</style>
