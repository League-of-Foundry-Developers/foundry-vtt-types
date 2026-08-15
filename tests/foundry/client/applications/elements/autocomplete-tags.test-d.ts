import { describe, expectTypeOf, test } from "vitest";

import elements = foundry.applications.elements;

describe("HTMLAutocompleteTagsElement Tests", () => {
  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new elements.HTMLAutocompleteTagsElement();
    expectTypeOf(
      elements.HTMLAutocompleteTagsElement.create({
        name: "myTags",
        options: [
          { label: "Option 1", value: "1" },
          { label: "Option 2", value: "2" },
        ],
      }),
    ).toEqualTypeOf<elements.HTMLAutocompleteTagsElement>();
    // `create` overrides `type`, so passing one is an error
    // @ts-expect-error `type` is omitted from this `create`'s config
    elements.HTMLAutocompleteTagsElement.create({ name: "myTags", type: "autocomplete", options: [] });
  });

  const ate = foundry.applications.fields.createMultiSelectInput({
    name: "myTags",
    type: "autocomplete",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
  });

  test("Miscellaneous", () => {
    // tag names are just `string`s for ease of subclassing
    expectTypeOf(elements.HTMLAutocompleteTagsElement.tagName).toBeString();
  });

  test("Inherited multi-select surface", () => {
    expectTypeOf(ate.value).toEqualTypeOf<string[]>();
    expectTypeOf(ate.select("1")).toBeVoid();
    expectTypeOf(ate.unselect("1")).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(ate["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(ate["_initialize"]()).toBeVoid();
    expectTypeOf(ate["_refresh"]()).toBeVoid();
    expectTypeOf(ate["_activateListeners"]()).toBeVoid();
    expectTypeOf(ate["_disconnect"]()).toBeVoid();
    expectTypeOf(ate["_toggleDisabled"](true)).toBeVoid();
  });
});
