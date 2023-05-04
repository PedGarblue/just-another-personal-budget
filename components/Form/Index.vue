<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import { PropType } from 'vue'

enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

interface IFormField {
  key: string
  title: string
  default?: any
  value: any
  componentProps?: Object
}

interface ISelectFormField extends IFormField {
  selectOptions: Array<Object | string>
  selectionKey?: string
  optionKey?: string
}

interface IDatePickerFormField extends IFormField {
  datePicker: boolean // type guard
}

type FormField = IFormField | ISelectFormField | IDatePickerFormField

const { t } = useLang()

const emits = defineEmits(['form-finished', 'form-error'])

const props = defineProps({
  formTitle: {
    type: String,
    required: false,
    default: () => '',
  },
  fields: {
    type: Array as PropType<Array<FormField>>,
    required: true,
  },
  formSubmitFn: {
    type: Function as PropType<(data: Object) => Promise<any>>,
    required: true,
  },
  restartTitle: {
    type: String,
    default: '',
  },
  submitTitle: {
    type: String,
    default: '',
  },
})

// data

const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)
const error = ref<any>()

const _fields = reactive<Array<FormField>>(
  props.fields.map((field: FormField) => {
    return {
      ...field,
      value: field.default || '',
    }
  })
)

// computed
const isDatePickerField = (field: FormField): field is IDatePickerFormField => {
  return 'datePicker' in field
}

const isSelectField = (field: FormField): field is ISelectFormField => {
  return 'selectOptions' in field
}

// methods
const clearForm = (): void => {
  for (let index = 0; index < _fields.length; index++) {
    const field = _fields[index]
    field.value = field.default || ''
  }
  loadingState.value = LoadingStatus.IDLE
}

const getFieldsValues = computed((): Object => {
  return _fields.reduce((prev, current) => {
    return {
      ...prev,
      [current.key]: current.value,
    }
  }, {})
})

const submit = async () => {
  if (loadingState.value !== LoadingStatus.IDLE) return
  const data = getFieldsValues.value
  loadingState.value = LoadingStatus.LOADING

  try {
    const response = await props.formSubmitFn(data)
    loadingState.value = LoadingStatus.FINISHED
    emits('form-finished')
  } catch (submitError) {
    emits('form-error', submitError)
    loadingState.value = LoadingStatus.ERROR
    error.value = submitError
  }
}
</script>

<template>
  <Card class="form-card">
    <CardTitle>
      <h3>{{ formTitle }}</h3>
      <div
        v-if="loadingState === LoadingStatus.ERROR"
        class="bg-white border-2 border-red-600 p-4 text-center rounded-md"
      >
        {{ error }}
      </div>
      {{ getFieldsValues }}
    </CardTitle>
    <CardContent>
      <template v-if="loadingState === LoadingStatus.LOADING">
        <div class="flex w-full h-full items-center justify-center p-16">
          <IconMdi:loading class="text-[5rem] animate-spin" />
        </div>
      </template>
      <template v-else-if="loadingState === LoadingStatus.FINISHED">
        <div class="flex w-full h-full items-center justify-center p-16">
          <IconMdi:checkbox-marked-circle class="text-[5rem] text-green-500" />
        </div>
      </template>
      <div v-else class="flex flex-col gap-2">
        <template v-for="field in _fields" :key="field.key">
          <div v-if="isDatePickerField(field)">
            <div v-bind="field.componentProps" class="text-base">
              {{ field.title || '' }}
            </div>
            <VueDatePicker
              v-model="field.value"
              v-bind="field.componentProps"
            />
          </div>
          <div v-else-if="isSelectField(field)">
            <Select
              v-model="field.value"
              v-bind="field.componentProps"
              :default="field.default"
              :options="field.selectOptions"
              :title="field.title"
            >
              <template #selected-value="{ selected }">
                {{
                  selected
                    ? typeof selected === 'object' && field.selectionKey
                      ? selected[field.selectionKey as keyof typeof selected]
                      : selected
                    : ''
                }}
              </template>
              <template #item-value="{ option }">
                {{
                  option
                    ? typeof option === 'object' && field.selectionKey
                      ? option[field.optionKey as keyof typeof option]
                      : option
                    : ''
                }}
              </template>
            </Select>
          </div>
          <div v-else>
            <FormTextInput
              v-model="field.value"
              :v-bind="field.componentProps"
              size="md"
              class="md:1/3"
              :title="field.title"
            >
              <slot name="input-contents"></slot>
            </FormTextInput>
          </div>
        </template>
      </div>
    </CardContent>
    <CardFooter>
      <div
        v-if="loadingState === LoadingStatus.FINISHED"
        class="flex flex-row gap-6"
      >
        <Button @click="() => clearForm()">
          {{ restartTitle || t('pages.summary.transactions.create.restart') }}
        </Button>
      </div>
      <Button v-else @click="() => submit()">{{
        submitTitle || t('others.submit')
      }}</Button>
    </CardFooter>
  </Card>
</template>

<style lang="postcss">
.form-card {
  overflow: visible;
}
</style>
