export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
}

export interface IFormField {
  key: string
  title: string
  default?: any
  value: any
  componentProps?: Object
  tabindex?: number
}

export interface ISelectFormField extends IFormField {
  selectOptions: Array<Object | string>
  selectOptionsMutator?: (
    options: Array<Object | string>,
    fields: Array<IFormField>
  ) => Array<Object | string>
  selectionKey?: string
  optionKey?: string
}

export interface IDatePickerFormField extends IFormField {
  datePicker: boolean // type guard
}

export type FormField = IFormField | ISelectFormField | IDatePickerFormField
