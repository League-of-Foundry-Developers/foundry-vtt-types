import { expectTypeOf } from "vitest";
import type {
  EditorInputConfig,
  FormGroupConfig,
  FormInputConfig,
  FormSelectOption,
  MultiSelectInputConfig,
  NumberInputConfig,
  SelectInputConfig,
  TextAreaInputConfig,
} from "../../../../../src/foundry/client-esm/applications/forms/fields.d.mts";

declare const config: FormGroupConfig;
expectTypeOf(foundry.applications.fields.createFormGroup(config)).toEqualTypeOf<HTMLDivElement>();

declare const checkConfig: FormInputConfig<boolean>;
expectTypeOf(foundry.applications.fields.createCheckboxInput(checkConfig)).toEqualTypeOf<HTMLInputElement>();

declare const editorConfig: EditorInputConfig;
expectTypeOf(foundry.applications.fields.createEditorInput(editorConfig)).toEqualTypeOf<HTMLDivElement>();

declare const multiSelectConfig: MultiSelectInputConfig;
expectTypeOf(foundry.applications.fields.createMultiSelectInput(multiSelectConfig)).toEqualTypeOf<HTMLSelectElement>();

declare const numberConfig: NumberInputConfig;
expectTypeOf(foundry.applications.fields.createNumberInput(numberConfig)).toEqualTypeOf<HTMLInputElement>();

declare const selectConfig: SelectInputConfig & FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createSelectInput(selectConfig)).toEqualTypeOf<HTMLSelectElement>();

declare const textAreaConfig: TextAreaInputConfig;
expectTypeOf(foundry.applications.fields.createTextareaInput(textAreaConfig)).toEqualTypeOf<HTMLTextAreaElement>();

declare const textConfig: FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createTextInput(textConfig)).toEqualTypeOf<HTMLInputElement>();

declare const selectOptionsGroupsConfig: FormInputConfig<unknown> & SelectInputConfig;
expectTypeOf(foundry.applications.fields.prepareSelectOptionGroups(selectOptionsGroupsConfig)).toEqualTypeOf<
  {
    group: string;
    options: FormSelectOption[];
  }[]
>();

declare const inputAttributeConfig: FormInputConfig<unknown>;
declare const element: HTMLElement;
expectTypeOf(foundry.applications.fields.setInputAttributes(element, inputAttributeConfig)).toEqualTypeOf<void>();
