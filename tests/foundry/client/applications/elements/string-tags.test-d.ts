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
    new HTMLStringTagsElement({ values: ["tag-one", "tag two", "TagThree"] });
    expectTypeOf(HTMLStringTagsElement.create(config)).toEqualTypeOf<HTMLStringTagsElement>();
  });

  const el = HTMLStringTagsElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLStringTagsElement.tagName).toBeString();
  });

  test("Value", () => {
    expectTypeOf(el.value).toEqualTypeOf<string[]>();
    el.value = ["tag-one", "tag two", "TagThree"]; // Setter
    el.value = new Set(["tag-one", "tag two", "TagThree"]);
    el.value = new Collection([
      ["1", "tag-one"],
      ["2", "tag two"],
      ["3", "TagThree"],
    ]);

    expectTypeOf(el["_value"]).toEqualTypeOf<Set<string>>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<string[]>();
    expectTypeOf(el["_setValue"]("assets/icons/foo.png")).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});

const _x: Iterable<string> = "foo";
