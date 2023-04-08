<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isVisible" class="modal-mask">
        <div class="modal-wrapper">
          <transition name="modal">
            <div
              v-if="isVisible"
              class="fixed inset-0 transform transition-all"
              @click="close"
            >
              <div class="absolute inset-0 bg-gray-800 opacity-50"></div>
            </div>
          </transition>
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
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
const isVisible = ref(false)

const open = () => {
  isVisible.value = true
}
const close = () => {
  isVisible.value = false
}
defineExpose({
  open,
  close,
})
</script>

<style scoped>
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
  display: table-cell;
  vertical-align: middle;
}

.modal-card {
  z-index: 9998;
  margin: auto;
  max-width: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  overflow: visible;
}

/*
* The following styles are auto-applied to elements with
* transition="modal" when their visibility is toggled
* by Vue.js.
*
* You can easily play with the modal transition by editing
* these styles.
*/

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
