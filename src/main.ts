import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import Vue3EasyDataTable from 'vue3-easy-data-table'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import 'vue3-easy-data-table/dist/style.css'
import '@vuepic/vue-datepicker/dist/main.css'
import './assets/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(createHead())
app.component('EasyDataTable', Vue3EasyDataTable)

app.mount('#app')
