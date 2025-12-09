import { describe, expectTypeOf, test } from "vitest";

import HTMLStringTagsElement = foundry.applications.elements.HTMLStringTagsElement;

describe("HTMLStringTagsElement Tests", () => {
  const config = {
    name: "system.tags",
    slug: true,
    value: ["tag-one", "tag two", "TagThree"],
  } satisfies HTMLStringTagsElement.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLStringTagsElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLStringTagsElement({ slug: false, values: ["tag-one", "tag two", "TagThree"] });
    expectTypeOf(HTMLStringTagsElement.create(config)).toEqualTypeOf<HTMLStringTagsElement>();
  });

  const el = HTMLStringTagsElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLStringTagsElement.tagName).toBeString();
    expectTypeOf(HTMLStringTagsElement.icons.add).toBeString();
    expectTypeOf(HTMLStringTagsElement.labels.placeholder).toBeString();

    expectTypeOf(el["_initializeTags"]()).toBeVoid();
    expectTypeOf(el["_initializeTags"](["tag-one", "tag two", "TagThree"])).toBeVoid();
    expectTypeOf(el["_initializeTags"]()).toBeVoid();

    expectTypeOf(el["_validateTag"]("foo")).toBeVoid();

    expectTypeOf(HTMLStringTagsElement.renderTag("foo")).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(HTMLStringTagsElement.renderTag("foo", "A Label for Foo")).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(HTMLStringTagsElement.renderTag("foo", "A Label for Foo", false)).toEqualTypeOf<HTMLDivElement>();
  });

  test("Value", () => {
    expectTypeOf(el.value).toEqualTypeOf<string[]>();
    el.value = ["tag-one", "tag two", "TagThree"]; // Setter
    el.value = new Set(["tag-one", "tag two", "TagThree"]);

    expectTypeOf(el["_value"]).toEqualTypeOf<Set<string>>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<string[]>();
    expectTypeOf(el["_setValue"](["tag-one", "tag two", "TagThree"])).toBeVoid();
    expectTypeOf(el["_setValue"](new Set(["tag-one", "tag two", "TagThree"]))).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
