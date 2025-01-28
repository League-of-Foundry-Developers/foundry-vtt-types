import { expectTypeOf } from "vitest";
import type { FormInputConfig } from "../../../../../src/foundry/client-esm/applications/forms/fields.d.mts";

declare const config: FormInputConfig<unknown>;
expectTypeOf(foundry.applications.elements.HTMLColorPickerElement.tagName).toEqualTypeOf<"color-picker">();
expectTypeOf(
  foundry.applications.elements.HTMLColorPickerElement.create(config),
).toEqualTypeOf<foundry.applications.elements.HTMLColorPickerElement>();
