import { describe, expectTypeOf, test } from "vitest";

import HTMLRangePickerElement = foundry.applications.elements.HTMLRangePickerElement;

describe("HTMLRangePickerElement Tests", () => {
  const config = {
    name: "system.range",
    min: -5,
    max: 5,
    step: 0.1,
    value: -0.3,
    // Thorough testing of the rest of `FormInputConfig` can be found in the `client/applications/forms/fields.mjs` tests.
  } satisfies HTMLRangePickerElement.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLRangePickerElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLRangePickerElement({ min: 0, max: 10, step: 2, value: 4 });
    expectTypeOf(HTMLRangePickerElement.create(config)).toEqualTypeOf<HTMLRangePickerElement>();
  });

  const el = HTMLRangePickerElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLRangePickerElement.tagName).toBeString();
  });

  test("Value", () => {
    expectTypeOf(el.value).toBeNumber();
    el.value = 6; // Setter

    expectTypeOf(el.valueAsNumber).toBeNumber();

    expectTypeOf(el["_value"]).toBeNumber();
    expectTypeOf(el["_getValue"]()).toBeNumber();
    expectTypeOf(el["_setValue"](8)).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
