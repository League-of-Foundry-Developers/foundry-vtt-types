import { describe, expectTypeOf, test } from "vitest";

import formFields = foundry.applications.fields;
import dataFields = foundry.data.fields;
import HTMLMultiSelectElement = foundry.applications.elements.HTMLMultiSelectElement;
import HTMLMultiCheckboxElement = foundry.applications.elements.HTMLMultiCheckboxElement;
import { type FormSelectOption, setInputAttributes } from "#client/applications/forms/fields.mjs";

const {
  createFormGroup,
  createCheckboxInput,
  createEditorInput,
  createMultiSelectInput,
  createNumberInput,
  createSelectInput,
  createTextareaInput,
  createTextInput,
  prepareSelectOptionGroups,
  createFontAwesomeIcon,
} = formFields;

describe("foundry/client/applications/forms/fields.mjs Tests", async () => {
  const commonInputConfig = {
    name: "system.foo",
    required: true,
    disabled: false,
    readonly: false,
    autofocus: false,
    localize: true,
    dataset: { foo: "bar" },
    aria: { placeholder: "placeholder", bar: "baz" }, // not restricted to real ARIA properties
    placeholder: "placeholder",
    classes: "some classes space separated",
    id: "system-foo",
  } satisfies formFields.FormInputConfig<unknown>;

  const commonInputConfigUndefined = {
    name: "system.foo",
    required: undefined,
    disabled: undefined,
    readonly: undefined,
    autofocus: undefined,
    localize: undefined,
    dataset: undefined,
    aria: undefined,
    placeholder: undefined,
    classes: undefined,
    id: undefined,
  } satisfies formFields.FormInputConfig<unknown>;

  const options = [
    { label: "Option 1", value: "1", group: "AAA Second Group in Order" },
    { label: "Option 2", value: "2", group: "First Group in Order", selected: true },
    { label: "Option 3", value: "3", group: "First Group in Order", rule: true, dataset: { id: "specific-option" } },
    { label: "Option 4", value: "4", disabled: true },
  ] satisfies FormSelectOption[];

  // lacks `type` to allow specific testing for `createMultiSelectInput`, and `localize` due to overlap with `FormInputConfig`
  const commonSelectInputConfig = {
    options,
    blank: "Intentionally Blank",
    groups: ["First Group in Order", "AAA Second Group in Order"],
    labelAttr: "label",
    valueAttr: "value",
    sort: true,
  } satisfies formFields._SelectInputConfig;

  const commonSelectInputConfigUndefined = {
    options,
    groups: undefined,
    labelAttr: undefined,
    valueAttr: undefined,
    sort: undefined,
  } satisfies formFields._SelectInputConfig;

  const actor = await Actor.implementation.create({
    name: "Foo",
    type: "character",
  });
  if (!actor) throw new Error("Actor creation for `applications/fields` tests somehow blocked.");

  const sf = new dataFields.StringField();
  const nf = new dataFields.NumberField();

  test("createFormGroup", () => {
    const minimalConfig = {
      label: "A Label",
      input: sf.toInput({ name: "foo" }),
    } satisfies formFields.FormGroupConfig;

    const fullConfig = {
      label: "Range",
      hint: "Some range value",
      input: nf.toInput({ name: "system.details.range" }),
      classes: ["a-class", "another"],
      hidden: false,
      localize: false,
      rootId: actor.id,
      stacked: true,
      units: "ft",
    } satisfies formFields.FormGroupConfig;

    const undefinedConfig = {
      label: "A Label",
      input: sf.toInput({ name: "foo" }),
      classes: undefined,
      hidden: undefined,
      hint: undefined,
      localize: undefined,
      rootId: undefined,
      stacked: undefined,
      units: undefined,
    } satisfies formFields.FormGroupConfig;

    // @ts-expect-error Must pass a `label` and `input`
    createFormGroup({});
    expectTypeOf(createFormGroup(minimalConfig)).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(createFormGroup(fullConfig)).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(createFormGroup(undefinedConfig)).toEqualTypeOf<HTMLDivElement>();
  });

  test("createCheckboxInput", () => {
    const minimalConfig = {
      name: "system.foo",
    } satisfies formFields.FormInputConfig<boolean>;

    const config = {
      ...commonInputConfig,
      value: true,
    } satisfies formFields.FormInputConfig<boolean>;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      value: undefined,
    } satisfies formFields.FormInputConfig<boolean>;

    // @ts-expect-error Must pass at least a `name`
    createCheckboxInput({});
    expectTypeOf(createCheckboxInput(minimalConfig)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createCheckboxInput(config)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createCheckboxInput(undefinedConfig)).toEqualTypeOf<HTMLInputElement>();
  });

  test("createEditorInput", () => {
    const minimalConfig = {
      name: "system.foo",
    } satisfies formFields.EditorInputConfig;

    const config = {
      ...commonInputConfig,
      button: true,
      engine: "prosemirror",
      height: 500,
      editable: true,
      collaborate: false,
    } satisfies formFields.EditorInputConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      button: undefined,
      engine: undefined,
      height: undefined,
      editable: undefined,
      collaborate: undefined,
    } satisfies formFields.EditorInputConfig;

    // @ts-expect-error Must pass at least a `name`
    createEditorInput({});
    expectTypeOf(createEditorInput(minimalConfig)).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(createEditorInput(config)).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(createEditorInput(undefinedConfig)).toEqualTypeOf<HTMLDivElement>();
  });

  test("createMultiSelectInput", () => {
    const minimalConfig = {
      name: "system.foo",
      options,
    } satisfies formFields.MultiSelectInputConfig;

    // lacks `type` and `value` for individual testing below
    const config = {
      ...commonInputConfig,
      ...commonSelectInputConfig,
    } satisfies formFields.MultiSelectInputConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      ...commonSelectInputConfigUndefined,
      value: undefined,
    } satisfies formFields.MultiSelectInputConfig;

    // @ts-expect-error Must pass at least `name` and `options`
    createMultiSelectInput({});
    expectTypeOf(createMultiSelectInput(minimalConfig)).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput(config)).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput(undefinedConfig)).toEqualTypeOf<HTMLMultiSelectElement>();

    // return type depends on `type`
    expectTypeOf(createMultiSelectInput({ ...config, type: undefined })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, type: "multi" })).toEqualTypeOf<HTMLMultiSelectElement>();
    // "single" makes no sense here, but all that matters is `=== "checkboxes"` or not
    expectTypeOf(createMultiSelectInput({ ...config, type: "single" })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, type: "checkboxes" })).toEqualTypeOf<HTMLMultiCheckboxElement>();

    // `value` takes primitives or iterables of `string | number`
    expectTypeOf(createMultiSelectInput({ ...config, value: 2 })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, value: "2" })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, value: [2] })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, value: ["2"] })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, value: new Set([2]) })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(createMultiSelectInput({ ...config, value: new Set(["2"]) })).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(
      createMultiSelectInput({ ...config, value: new Collection([["two", 2]]) }),
    ).toEqualTypeOf<HTMLMultiSelectElement>();
    expectTypeOf(
      createMultiSelectInput({ ...config, value: new Collection([["two", "2"]]) }),
    ).toEqualTypeOf<HTMLMultiSelectElement>();
  });

  test("createNumberInput", () => {
    const minimalConfig = {
      name: "system.foo",
    } satisfies formFields.NumberInputConfig;

    const config = {
      ...commonInputConfig,
      max: 10,
      min: -10,
      step: 1,
      value: 0,
    } satisfies formFields.NumberInputConfig;
    const undefinedConfig = {
      ...commonInputConfig,
      max: undefined,
      min: undefined,
      step: undefined,
      value: undefined,
    } satisfies formFields.NumberInputConfig;

    // @ts-expect-error Must pass at least a `name`
    createNumberInput({});
    expectTypeOf(createNumberInput(minimalConfig)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createNumberInput(config)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createNumberInput(undefinedConfig)).toEqualTypeOf<HTMLInputElement>();
  });

  test("createSelectInput", () => {
    const minimalConfig = {
      name: "system.foo",
      options,
    } satisfies formFields.SelectInputConfig;

    const config = {
      ...commonInputConfig,
      ...commonSelectInputConfig,
    } satisfies formFields.SelectInputConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      ...commonSelectInputConfigUndefined,
      value: undefined,
    } satisfies formFields.SelectInputConfig;

    // @ts-expect-error Must pass at least `name` and `options`
    createSelectInput({});
    expectTypeOf(createSelectInput(minimalConfig)).toEqualTypeOf<HTMLSelectElement>();

    expectTypeOf(createSelectInput({ ...config, value: "1" })).toEqualTypeOf<HTMLSelectElement>();
    expectTypeOf(createSelectInput({ ...config, value: 1 })).toEqualTypeOf<HTMLSelectElement>();

    // Passing an iterable is valid, and will work at runtime; the *last* `<option selected>` found will be what's actually selected
    expectTypeOf(createSelectInput({ ...config, value: ["1", "2"] })).toEqualTypeOf<HTMLSelectElement>();
    expectTypeOf(createSelectInput({ ...config, value: [1, 2] })).toEqualTypeOf<HTMLSelectElement>();
    expectTypeOf(createSelectInput({ ...config, value: new Set([1, 2]) })).toEqualTypeOf<HTMLSelectElement>();
    expectTypeOf(
      createSelectInput({ ...config, value: new Collection([["two", 2]]) }),
    ).toEqualTypeOf<HTMLSelectElement>();

    expectTypeOf(createSelectInput(undefinedConfig)).toEqualTypeOf<HTMLSelectElement>();
  });

  test("createTextareaInput", () => {
    const minimalConfig = {
      name: "system.foo",
    } satisfies formFields.TextAreaInputConfig;

    const config = {
      ...commonInputConfig,
      rows: 7,
      value: "some text content",
    } satisfies formFields.TextAreaInputConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      rows: undefined,
      value: undefined,
    } satisfies formFields.TextAreaInputConfig;

    // @ts-expect-error Must pass at least a `name`
    createTextareaInput({});
    expectTypeOf(createTextareaInput(minimalConfig)).toEqualTypeOf<HTMLTextAreaElement>();
    expectTypeOf(createTextareaInput(config)).toEqualTypeOf<HTMLTextAreaElement>();
    expectTypeOf(createTextareaInput(undefinedConfig)).toEqualTypeOf<HTMLTextAreaElement>();
  });

  test("createTextInput", () => {
    const minimalConfig = {
      name: "system.foo",
    } satisfies formFields.TextInputConfig;

    const config = {
      ...commonInputConfig,
      value: "some text content",
    } satisfies formFields.TextInputConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      value: undefined,
    } satisfies formFields.TextInputConfig;

    // @ts-expect-error Must pass at least a `name`
    createTextInput({});
    expectTypeOf(createTextInput(minimalConfig)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createTextInput(config)).toEqualTypeOf<HTMLInputElement>();
    expectTypeOf(createTextInput(undefinedConfig)).toEqualTypeOf<HTMLInputElement>();
  });

  test("prepareSelectOptionGroups", () => {
    const minimalConfig = {
      options,
    } satisfies formFields.PrepareSelectOptionGroupsConfig;

    // `value` tested below
    const config = {
      ...commonSelectInputConfig,
    } satisfies formFields.PrepareSelectOptionGroupsConfig;

    const undefinedConfig = {
      ...commonSelectInputConfigUndefined,
      value: undefined,
    } satisfies formFields.PrepareSelectOptionGroupsConfig;

    // @ts-expect-error Must pas at least `options`
    prepareSelectOptionGroups({});
    expectTypeOf(prepareSelectOptionGroups(minimalConfig)).toEqualTypeOf<formFields.PreparedSelectOptionGroup[]>();

    expectTypeOf(prepareSelectOptionGroups({ ...config, value: 1 })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();
    expectTypeOf(prepareSelectOptionGroups({ ...config, value: "1" })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();
    expectTypeOf(prepareSelectOptionGroups({ ...config, value: ["1", "2"] })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();
    expectTypeOf(prepareSelectOptionGroups({ ...config, value: [1, 2] })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();
    expectTypeOf(prepareSelectOptionGroups({ ...config, value: new Set([1, 2]) })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();
    expectTypeOf(prepareSelectOptionGroups({ ...config, value: new Collection([["two", 2]]) })).toEqualTypeOf<
      formFields.PreparedSelectOptionGroup[]
    >();

    expectTypeOf(prepareSelectOptionGroups(undefinedConfig)).toEqualTypeOf<formFields.PreparedSelectOptionGroup[]>();
  });

  test("setInputAttributes", () => {
    const el = document.createElement("input");

    const config = {
      ...commonInputConfig,
      // value is unused
    } satisfies formFields.SetInputAttributeConfig;

    const undefinedConfig = {
      ...commonInputConfigUndefined,
      // value is unused
    } satisfies formFields.SetInputAttributeConfig;

    // @ts-expect-error None of the properties of `config` are required at runtime,
    // but there's no parameter default, and unchecked property access.
    setInputAttributes(el);
    expectTypeOf(setInputAttributes(el, {})).toBeVoid();
    expectTypeOf(setInputAttributes(el, config)).toBeVoid();
    expectTypeOf(setInputAttributes(el, undefinedConfig)).toBeVoid();
  });

  test("createFontAwesomeIcon", () => {
    expectTypeOf(createFontAwesomeIcon("user")).toEqualTypeOf<HTMLElement>();
    expectTypeOf(createFontAwesomeIcon("fa-user", {})).toEqualTypeOf<HTMLElement>();
    expectTypeOf(
      createFontAwesomeIcon("user", {
        fixedWidth: true,
        style: "regular",
        classes: ["fa-rotate-90"],
      }),
    ).toEqualTypeOf<HTMLElement>();
    expectTypeOf(
      createFontAwesomeIcon("fa-user", {
        fixedWidth: undefined,
        style: undefined,
        classes: undefined,
      }),
    ).toEqualTypeOf<HTMLElement>();
  });
});

declare const inputAttributeConfig: formFields.FormInputConfig<unknown>;
declare const element: HTMLElement;
expectTypeOf(foundry.applications.fields.setInputAttributes(element, inputAttributeConfig)).toEqualTypeOf<void>();
