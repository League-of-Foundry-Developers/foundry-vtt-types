import { expectTypeOf } from "vitest";

declare const config: foundry.applications.fields.FormInputConfig<unknown>;
expectTypeOf(foundry.applications.elements.HTMLColorPickerElement.tagName).toEqualTypeOf<"color-picker">();
expectTypeOf(
  foundry.applications.elements.HTMLColorPickerElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLColorPickerElement>();
