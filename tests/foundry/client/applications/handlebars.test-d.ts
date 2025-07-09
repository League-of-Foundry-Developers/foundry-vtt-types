import { expectTypeOf } from "vitest";

import handlebars = foundry.applications.handlebars;

const myNumField = new foundry.data.fields.NumberField({});

const rangePickerOptions: foundry.applications.handlebars.RangePickerOptions = {};

expectTypeOf(handlebars.checked("")).toEqualTypeOf<string>();
expectTypeOf(handlebars.disabled("")).toEqualTypeOf<string>();
expectTypeOf(handlebars.editor("", { hash: { target: "" } })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(handlebars.ifThen(true, "", "")).toEqualTypeOf<string>();
expectTypeOf(handlebars.localize("", { hash: {} })).toEqualTypeOf<string>();
expectTypeOf(handlebars.numberFormat("", { hash: {} })).toEqualTypeOf<string>();
expectTypeOf(handlebars.numberInput("", { hash: {} })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(handlebars.radioBoxes("", {}, { hash: {} })).toEqualTypeOf<Handlebars.SafeString>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(handlebars.rangePicker(rangePickerOptions)).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(handlebars.selectOptions({}, { hash: { options: [] } })).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(handlebars.formInput(myNumField, {})).toEqualTypeOf<Handlebars.SafeString>();
expectTypeOf(handlebars.formGroup(myNumField, {})).toEqualTypeOf<Handlebars.SafeString>();

// @ts-expect-error bar is not a valid formInput property
handlebars.formInput(myNumField, { hash: { bar: 3 } });

expectTypeOf(handlebars.getTemplate("")).toEqualTypeOf<Promise<Handlebars.TemplateDelegate>>();
expectTypeOf(handlebars.loadTemplates([])).toEqualTypeOf<Promise<Handlebars.TemplateDelegate[]>>();
expectTypeOf(handlebars.loadTemplates({})).toEqualTypeOf<Promise<Handlebars.TemplateDelegate[]>>();
expectTypeOf(handlebars.renderTemplate("", {})).toEqualTypeOf<Promise<string>>();
