import { describe, expectTypeOf, test } from "vitest";

import formFields = foundry.applications.fields;
import dataFields = foundry.data.fields;
import elements = foundry.applications.elements;

describe("foundry/client/applications/forms/fields.mjs Tests", () => {
  const actor = new Actor.implementation({
    name: "Foo",
    type: "character",
    _id: "XXXXXActorIDXXXX",
  }) as Actor.Stored<"character">; // cast instead of .create, in case of side effects if run for real

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

    expectTypeOf(formFields.createFormGroup(minimalConfig)).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(formFields.createFormGroup(fullConfig)).toEqualTypeOf<HTMLDivElement>();
  });

  // test("createCheckboxInput", ()=>{
  //   const minimalConfig = {} satisfies formFields.FormInputConfig<boolean>
  // })

  test("createMultiSelectInput", () => {
    const options = [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ];
    const _x = formFields.createMultiSelectInput({ options });

    expectTypeOf(formFields.createMultiSelectInput({ options })).toEqualTypeOf<elements.HTMLMultiSelectElement>();
    expectTypeOf(
      formFields.createMultiSelectInput({ options, type: undefined }),
    ).toEqualTypeOf<elements.HTMLMultiSelectElement>();
  });
});

declare const checkConfig: formFields.FormInputConfig<boolean>;
expectTypeOf(foundry.applications.fields.createCheckboxInput(checkConfig)).toEqualTypeOf<HTMLInputElement>();

// declare const editorConfig: formFields.EditorInputConfig;
// expectTypeOf(foundry.applications.fields.createEditorInput(editorConfig)).toEqualTypeOf<HTMLDivElement>();

declare const numberConfig: formFields.NumberInputConfig;
expectTypeOf(foundry.applications.fields.createNumberInput(numberConfig)).toEqualTypeOf<HTMLInputElement>();

declare const selectConfig: formFields.SelectInputConfig & formFields.FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createSelectInput(selectConfig)).toEqualTypeOf<HTMLSelectElement>();

declare const textAreaConfig: formFields.TextAreaInputConfig;
expectTypeOf(foundry.applications.fields.createTextareaInput(textAreaConfig)).toEqualTypeOf<HTMLTextAreaElement>();

declare const textConfig: formFields.FormInputConfig<string>;
expectTypeOf(foundry.applications.fields.createTextInput(textConfig)).toEqualTypeOf<HTMLInputElement>();

// declare const selectOptionsGroupsConfig: formFields.FormInputConfig<unknown> & formFields.SelectInputConfig;
// expectTypeOf(foundry.applications.fields.prepareSelectOptionGroups(selectOptionsGroupsConfig)).toEqualTypeOf<
//   {
//     group: string;
//     options: formFields.FormSelectOption[];
//   }[]
// >();

declare const inputAttributeConfig: formFields.FormInputConfig<unknown>;
declare const element: HTMLElement;
expectTypeOf(foundry.applications.fields.setInputAttributes(element, inputAttributeConfig)).toEqualTypeOf<void>();
