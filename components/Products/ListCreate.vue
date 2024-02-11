<script lang="ts" setup>
import { ProductListAPI } from '~~/types/products'
import { createProductList } from '~~/api/products'
import { FormField } from '~~/types/formTypes'
import Modal from '~~/components/Modal.vue'
import { useNotificationsStore } from '~~/stores/notifications'

const emits = defineEmits(['list-created'])

const { t } = useLang()
const notifications = useNotificationsStore()
const modal = ref<InstanceType<typeof Modal> | null>(null)

const fields = computed<FormField[]>(() => [
  {
    key: 'name',
    title: 'Name',
    value: '',
  },
  {
    key: 'description',
    title: 'Description',
    value: '',
  },
])

// methods
const openModal = () => {
  modal.value?.open()
}
const closeModal = () => {
  modal.value?.close()
}

const submit = (data: any) => {
  const { name, description } = data

  return createProductList({ name, description })
    .then((response) => {
      emits('list-created', response)
      closeModal()
    })
    .catch((error) => {
      notifications.addNotification({
        type: 'error',
        text: error.message,
      })
    })
}

const finishCreate = () => {
  notifications.addNotification({
    type: 'success',
    text: t('pages.productsList.create.success'),
  })
}
</script>

<template>
  <div>
    <Button @click="openModal">
      {{ t('pages.products.createList.title') }}
    </Button>
    <Modal ref="modal">
      <template #contents>
        <Form
          as-modal
          :fields="fields"
          :form-submit-fn="submit"
          :form-title="`${t('pages.products.createList.title')}`"
          :restart-title="`${t('pages.products.createList.restart')}`"
          :submit-title="`${t('pages.products.createList.title')}`"
          @form-finished="() => finishCreate()"
        ></Form>
      </template>
    </Modal>
  </div>
</template>
