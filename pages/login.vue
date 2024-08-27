<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'
import { LoginForm } from '~~/types/auth'
import type { FormField } from '~~/types/formTypes'

const router = useRouter()
const auth = useAuthStore()
definePageMeta({
  layout: 'page',
})

useHead({
  title: 'Sign-in',
})

const fields = computed<FormField[]>(() => [
  {
    key: 'username',
    title: 'Username',
    default: '',
    value: '',
    componentProps: {
      required: true,
    },
  },
  {
    key: 'password',
    title: 'Password',
    default: '',
    value: '',
    componentProps: {
      required: true,
      type: 'password',
    },
  },
])

const submit = async (data: any) => {
  const login = await auth.login(data)
  if (login) {
    router.push({
      name: 'dashboard',
    })
  }
}
</script>

<template>
  <div class="py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div
        class="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
      ></div>
    </div>
    <Form
      as-modal
      :fields="fields"
      :form-submit-fn="submit"
      :form-title="`Login`"
      :restart-title="`Login`"
      :submit-title="`Sign In`"
    />
  </div>
</template>
