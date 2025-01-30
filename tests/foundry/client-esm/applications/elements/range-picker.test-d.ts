import { expectTypeOf } from "vitest";

const proseMirror = new foundry.applications.elements.HTMLRangePickerElement();

expectTypeOf(proseMirror.valueAsNumber).toEqualTypeOf<number>();

expectTypeOf(foundry.applications.elements.HTMLRangePickerElement.tagName).toEqualTypeOf<"range-picker">();

declare const config: foundry.applications.elements.HTMLRangePickerElement.RangePickerInputConfig;
expectTypeOf(
  foundry.applications.elements.HTMLRangePickerElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLRangePickerElement>();
