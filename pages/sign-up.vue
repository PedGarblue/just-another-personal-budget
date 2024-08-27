<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'
import { RegisterForm } from '~~/types/auth'
import type { FormField } from '~~/types/formTypes'

interface RegisterFormClient extends RegisterForm {
  confirmPassword: string
}

definePageMeta({
  name: 'sign-up',
  layout: 'page',
})

useHead({
  title: 'Sign Up',
})

const router = useRouter()
const auth = useAuthStore()
const { t } = useLang()

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
    key: 'email',
    title: 'Email',
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
  {
    key: 'confirmPassword',
    title: 'Confirm Password',
    default: '',
    value: '',
    componentProps: {
      required: true,
      type: 'password',
    },
  },
])

const passwordsMatch = (pass1: string, pass2: string) => pass1 === pass2

const register = async (data: any) => {
  if (!passwordsMatch(data.password, data.confirmPassword)) {
    throw new Error('Passwords do not match')
  }
  const user = {
    email: data.email,
    username: data.username,
    password: data.password,
  }
  const register = await auth.register(user)
  if (register) {
    // login the user
    const login = await auth.login({
      username: data.username,
      password: data.password,
    })
    if (login) {
      router.push({
        name: 'dashboard',
      })
    }
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
      :form-submit-fn="register"
      :form-title="`Register`"
      :submit-title="`Sign Up`"
    />
  </div>
</template>
