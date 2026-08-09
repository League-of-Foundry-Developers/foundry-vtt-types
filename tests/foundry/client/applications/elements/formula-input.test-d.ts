import { expectTypeOf } from "vitest";

import HTMLFormulaInputElement = foundry.applications.elements.HTMLFormulaInputElement;

declare const element: HTMLFormulaInputElement;

expectTypeOf(HTMLFormulaInputElement.tagName).toBeString();
expectTypeOf(element.button).toEqualTypeOf<HTMLButtonElement | undefined>();
expectTypeOf(element.input).toEqualTypeOf<HTMLInputElement | undefined>();
expectTypeOf(element.editor).toEqualTypeOf<foundry.applications.apps.FormulaEditor | undefined>();
expectTypeOf(element.value).toEqualTypeOf<string | undefined>();
expectTypeOf(element.context).toEqualTypeOf<string | null>();
element.context = "default";

expectTypeOf(
  HTMLFormulaInputElement.create({ name: "formula", value: "1d20" }),
).toEqualTypeOf<HTMLFormulaInputElement>();
expectTypeOf(
  HTMLFormulaInputElement.create({ name: "formula", value: "1d20", context: "default" }),
).toEqualTypeOf<HTMLFormulaInputElement>();
