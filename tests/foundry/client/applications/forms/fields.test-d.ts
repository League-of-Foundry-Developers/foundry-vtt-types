import { expectTypeOf } from "vitest";

import formFields = foundry.applications.fields;

declare const config: formFields.FormGroupConfig;
expectTypeOf(foundry.applications.fields.createFormGroup(config)).toEqualTypeOf<HTMLDivElement>();

declare const checkConfig: formFields.FormInputConfig<boolean>;
expectTypeOf(foundry.applications.fields.createCheckboxInput(checkConfig)).toEqualTypeOf<HTMLInputElement>();

declare const editorConfig: formFields.EditorInputConfig;
expectTypeOf(foundry.applications.fields.createEditorInput(editorConfig)).toEqualTypeOf<HTMLDivElement>();

declare const multiSelectConfig: formFields.MultiSelectInputConfig;
expectTypeOf(foundry.applications.fields.createMultiSelectInput(multiSelectConfig)).toEqualTypeOf<HTMLSelectElement>();

declare const numberConfig: formFields.NumberInputConfig;
expectTypeOf(foundry.applications.fields.createNumberInput(numberConfig)).toEqualTypeOf<HTMLInputElement>();

declare const selectConfig: formFields.SelectInputConfig & formFields.FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createSelectInput(selectConfig)).toEqualTypeOf<HTMLSelectElement>();

declare const textAreaConfig: formFields.TextAreaInputConfig;
expectTypeOf(foundry.applications.fields.createTextareaInput(textAreaConfig)).toEqualTypeOf<HTMLTextAreaElement>();

declare const textConfig: formFields.FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createTextInput(textConfig)).toEqualTypeOf<HTMLInputElement>();

declare const selectOptionsGroupsConfig: formFields.FormInputConfig<unknown> & formFields.SelectInputConfig;
expectTypeOf(foundry.applications.fields.prepareSelectOptionGroups(selectOptionsGroupsConfig)).toEqualTypeOf<
  {
    group: string;
    options: formFields.FormSelectOption[];
  }[]
>();

declare const inputAttributeConfig: formFields.FormInputConfig<unknown>;
declare const element: HTMLElement;
expectTypeOf(foundry.applications.fields.setInputAttributes(element, inputAttributeConfig)).toEqualTypeOf<void>();
