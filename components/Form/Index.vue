<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import type { PropType } from 'vue'
import type {
  FormField,
  IDatePickerFormField,
  ISelectFormField,
} from '~~/types/formTypes'
import { LoadingStatus } from '~~/types/formTypes'

const isDatePickerField = (field: FormField): field is IDatePickerFormField => {
  return 'datePicker' in field
}

const isSelectField = (field: FormField): field is ISelectFormField => {
  return 'selectOptions' in field
}

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
  asModal: {
    type: Boolean,
    default: false,
  },
})

const tabindexCount = ref(1)

// data

const loadingState = ref<LoadingStatus>(LoadingStatus.IDLE)
const error = ref<any>()

const getFieldTotalTabindex = (field: FormField): number => {
  if (isSelectField(field)) {
    return tabindexCount.value + field.selectOptions.length
  }
  return tabindexCount.value
}

const _fields = reactive<Array<FormField>>(
  props.fields.map((field: FormField) => {
    const tabindex = tabindexCount.value
    tabindexCount.value = getFieldTotalTabindex(field) + 1

    return {
      ...field,
      value: field.default || '',
      tabindex,
    }
  })
)

// computed

// methods

const getSelectOptions = (field: ISelectFormField) => {
  if (field.selectOptionsMutator) {
    return field.selectOptionsMutator(field.selectOptions, _fields)
  }
  return field.selectOptions
}
const clearForm = (): void => {
  for (let index = 0; index < _fields.length; index++) {
    const field = _fields[index]
    field.value = field.default || ''
  }
  loadingState.value = LoadingStatus.IDLE
}

const getFieldsValues = computed((): Object => {
  return _fields.reduce((prev, current) => {
    // omit empty values
    if (!current.value || current.value === '') return prev
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
  <Card class="form-card" :class="{ 'form-card-modal': asModal }">
    <CardTitle>
      <h3>{{ formTitle }}</h3>
      <div
        v-if="loadingState === LoadingStatus.ERROR"
        class="bg-white border-2 border-red-600 p-4 text-center rounded-md"
      >
        {{ error }}
      </div>
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
              :tabindex="field.tabindex"
              text-input
              dark
            />
          </div>
          <Select
            v-else-if="isSelectField(field)"
            v-model="field.value"
            v-bind="field.componentProps"
            :default="field.default"
            :options="getSelectOptions(field)"
            :title="field.title"
            :selection-key="field.selectionKey"
            :tabindex="field.tabindex"
          >
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
          <FormInput
            v-else
            v-model="field.value"
            v-bind="field.componentProps"
            size="md"
            class="md:1/3"
            :title="field.title"
            :tabindex="field.tabindex"
          >
            <slot name="input-contents"></slot>
          </FormInput>
        </template>
      </div>
    </CardContent>
    <CardFooter>
      <div
        v-if="loadingState === LoadingStatus.FINISHED"
        class="flex flex-row gap-6"
      >
        <Button
          :tabindex="tabindexCount"
          @click="() => clearForm()"
          @keyup.enter="() => clearForm()"
        >
          {{ restartTitle || t('pages.summary.transactions.create.restart') }}
        </Button>
      </div>
      <Button
        v-else
        :tabindex="tabindexCount"
        @click="() => submit()"
        @keyup.enter="() => submit()"
        >{{ submitTitle || t('others.submit') }}</Button
      >
    </CardFooter>
  </Card>
</template>

<style lang="postcss">
.form-card {
  overflow: visible;
}
.form-card-modal {
  @apply m-auto my-4 max-w-[95%] md:max-w-3/4 xl:max-w-1/3;
}
</style>
