import { expectTypeOf } from "vitest";
import type {
  FormInputConfig,
  SelectInputConfig,
} from "../../../../../src/foundry/client/applications/forms/fields.d.mts";

declare const multiSelect: foundry.applications.elements.AbstractMultiSelectElement;

expectTypeOf(multiSelect.select("")).toEqualTypeOf<void>();
expectTypeOf(multiSelect.unselect("")).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.elements.AbstractMultiSelectElement.tagName).toEqualTypeOf<string>();

expectTypeOf(foundry.applications.elements.HTMLMultiSelectElement.tagName).toEqualTypeOf<"multi-select">();

declare const multiSelectConfig: FormInputConfig<string[]> & Omit<SelectInputConfig, "blank">;
expectTypeOf(
  foundry.applications.elements.HTMLMultiSelectElement.create(multiSelectConfig),
).toEqualTypeOf<foundry.applications.elements.HTMLMultiSelectElement>();

expectTypeOf(foundry.applications.elements.HTMLMultiCheckboxElement.tagName).toEqualTypeOf<"multi-checkbox">();
