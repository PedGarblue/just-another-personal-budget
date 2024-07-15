<script lang="ts" setup>
import { useAuthStore } from '~~/stores/auth'
import { RegisterForm } from '~~/types/auth'

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

const user = ref<RegisterFormClient>({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
})

const passwordsMatch = computed(
  () => user.value.password === user.value.confirmPassword
)
const register = async () => {
  if (!passwordsMatch.value) {
    return
  }
  const register = await auth.register(user.value)
  if (register) {
    // login the user
    const login = await auth.login({
      username: user.value.username,
      password: user.value.password,
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
      <div
        class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20"
      >
        <div class="max-w-md mx-auto">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">
              {{ t('pages.sign-up.title') }}
            </h1>
            <div>
              <!-- alerts -->
              <div v-if="!passwordsMatch" class="text-red-500">
                {{ t('pages.sign-up.password.mismatch') }}
              </div>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
            >
              <div class="relative">
                <input
                  id="username"
                  v-model="user.username"
                  name="username"
                  type="text"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  :placeholder="t('pages.sign-up.username')"
                />
                <label
                  for="username"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >{{ t('pages.sign-up.username') }}</label
                >
              </div>
              <div class="relative">
                <input
                  id="email"
                  v-model="user.email"
                  name="email"
                  type="email"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  :placeholder="t('pages.sign-up.email')"
                />
                <label
                  for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >{{ t('pages.sign-up.email') }}</label
                >
              </div>
              <div class="relative">
                <input
                  id="password"
                  v-model="user.password"
                  autocomplete="off"
                  name="password"
                  type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  :placeholder="t('pages.sign-up.password.label')"
                />
                <label
                  for="password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >{{ t('pages.sign-up.password.label') }}</label
                >
              </div>
              <div class="relative">
                <input
                  id="confirm-password"
                  v-model="user.confirmPassword"
                  autocomplete="off"
                  name="confirm-password"
                  type="password"
                  class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                  :placeholder="t('pages.sign-up.password.confirm')"
                />
                <label
                  for="confirm-password"
                  class="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >{{ t('pages.sign-up.password.confirm') }}</label
                >
              </div>
              <div class="relative">
                <button
                  class="bg-cyan-500 text-white rounded-md px-4 py-1"
                  @click="register"
                >
                  {{ t('pages.sign-up.submit') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
