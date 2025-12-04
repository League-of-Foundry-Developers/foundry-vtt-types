import { describe, expectTypeOf, test } from "vitest";

import HTMLColorPickerElement = foundry.applications.elements.HTMLColorPickerElement;

describe("HTMLColorPickerElement Tests", () => {
  const config = {
    name: "system.color",
    // This element's config is an unextended `FormInputConfig`. Thorough testing of that interface
    // can be found in the `client/applications/forms/fields.mjs` tests.
  } satisfies HTMLColorPickerElement.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLColorPickerElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLColorPickerElement({ value: "#FFFFFF" });
    expectTypeOf(HTMLColorPickerElement.create(config)).toEqualTypeOf<HTMLColorPickerElement>();
  });

  const el = HTMLColorPickerElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLColorPickerElement.tagName).toBeString();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
