import { describe, expectTypeOf, test } from "vitest";

import elements = foundry.applications.elements;

describe("AbstractMultiSelectElementTests", () => {
  // AMSE is, predictably, abstract, so we need a wrapper to test
  class TestAMSE extends elements.AbstractMultiSelectElement {}
  const mse = new TestAMSE();

  test("Element API and lifecycle methods", () => {
    expectTypeOf(mse.connectedCallback()).toBeVoid();
  });

  test("Value", () => {
    const stringArray = ["foo", "bar"];

    expectTypeOf(mse["_value"]).toEqualTypeOf<Set<string>>();

    expectTypeOf(mse.value).toEqualTypeOf<Set<string>>();
    mse.value = stringArray;
    // @ts-expect-error The getter is a Set, but the setter only takes arrays
    mse.value = new Set(stringArray);

    expectTypeOf(mse["_getValue"]()).toEqualTypeOf<string[]>();
    expectTypeOf(mse["_setValue"](stringArray)).toBeVoid();
  });

  test("Selection and choices", () => {
    expectTypeOf(mse.select("foo")).toBeVoid();
    expectTypeOf(mse.unselect("foo")).toBeVoid();

    expectTypeOf(mse["_options"]).toEqualTypeOf<Array<HTMLOptGroupElement | HTMLOptionElement>>();
    expectTypeOf(mse["_choices"]).toEqualTypeOf<Record<string, string>>();
  });
});

describe("HTMLMultiSelectElement Tests", () => {
  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new elements.HTMLMultiSelectElement();
    expectTypeOf(
      elements.HTMLMultiSelectElement.create({
        name: "myMultiSelect",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      }),
    ).toEqualTypeOf<elements.HTMLMultiSelectElement>();
    // thorough testing of the `MultiSelectInputConfig` interface is in the `client/applications/forms/fields.mjs` tests
  });

  const mse = elements.HTMLMultiSelectElement.create({
    name: "myMultiSelect",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  });

  test("Miscellaneous", () => {
    // tag names are just `string`s for ease of subclassing
    expectTypeOf(elements.HTMLMultiSelectElement.tagName).toBeString();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(mse["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(mse["_refresh"]()).toBeVoid();
    expectTypeOf(mse["_activateListeners"]()).toBeVoid();
    expectTypeOf(mse["_toggleDisabled"](true)).toBeVoid();
  });
});

describe("HTMLMultiCheckboxElement Tests", () => {
  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new elements.HTMLMultiCheckboxElement();
    // HTMLMultiCheckboxElement doesn't have its own `.create` in 13.351, proper creation is only available by external helper function
  });

  const mce = foundry.applications.fields.createMultiSelectInput({
    name: "myCheckboxen",
    type: "checkboxes",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  });

  test("Miscellaneous", () => {
    // tag names are just `string`s for ease of subclassing
    expectTypeOf(elements.HTMLMultiCheckboxElement.tagName).toBeString();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(mce["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(mce["_refresh"]()).toBeVoid();
    expectTypeOf(mce["_activateListeners"]()).toBeVoid();
    expectTypeOf(mce["_toggleDisabled"](true)).toBeVoid();
  });
});
