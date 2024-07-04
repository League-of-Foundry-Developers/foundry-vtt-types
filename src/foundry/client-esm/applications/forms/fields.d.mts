declare global {
  type CustomFormGroup = unknown;

  type CustomFormElement = unknown;

  interface FormGroupConfig {}

  interface FormInputConfig {}
}

export function createFormGroup(config: FormGroupConfig): HTMLDivElement;
