import { expectTypeOf } from "vitest";

new HandlebarsHelpers();
const myNumField = new foundry.data.fields.NumberField({});

expectTypeOf(HandlebarsHelpers.checked("")).toEqualTypeOf<string>();
expectTypeOf(HandlebarsHelpers.disabled("")).toEqualTypeOf<string>();
expectTypeOf(HandlebarsHelpers.editor("", { hash: { target: "" } })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.ifThen({ hash: { criteria: true, ifTrue: "", ifFalse: "" } })).toEqualTypeOf<string>();
expectTypeOf(HandlebarsHelpers.localize("", { hash: {} })).toEqualTypeOf<string>();
expectTypeOf(HandlebarsHelpers.numberFormat("", { hash: {} })).toEqualTypeOf<string>();
expectTypeOf(HandlebarsHelpers.numberInput("", {})).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.radioBoxes("", {}, { hash: {} })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.rangePicker({})).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.selectOptions({}, { hash: { options: [] } })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.formInput(myNumField, {})).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.formGroup(myNumField, {})).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(HandlebarsHelpers.rangePicker({})).toEqualTypeOf<Handlebars.SafeString>();

// @ts-expect-error bar is not a valid formInput property
HandlebarsHelpers.formInput(myNumField, { hash: { bar: 3 } });

expectTypeOf(getTemplate("")).toEqualTypeOf<Promise<Handlebars.TemplateDelegate>>();
expectTypeOf(loadTemplates([])).toEqualTypeOf<Promise<Handlebars.TemplateDelegate[]>>();
expectTypeOf(loadTemplates({})).toEqualTypeOf<Promise<Handlebars.TemplateDelegate[]>>();
expectTypeOf(renderTemplate("", {})).toEqualTypeOf<Promise<string>>();
