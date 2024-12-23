import { expectTypeOf } from "vitest";

expectTypeOf(HandlebarsHelpers.editor("foo", { hash: { target: "foo" } }));

const myNumField = new foundry.data.fields.NumberField({});

HandlebarsHelpers.formInput(myNumField, { hash: { max: 3 } });
HandlebarsHelpers.formGroup(myNumField, { hash: { max: 3 } });
//@ts-expect-error bar is not a valid formInput property
HandlebarsHelpers.formInput(myNumField, { hash: { bar: 3 } });
