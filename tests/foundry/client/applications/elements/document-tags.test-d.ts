import { describe, expectTypeOf, test } from "vitest";

import HTMLDocumentTagsElement = foundry.applications.elements.HTMLDocumentTagsElement;

describe("HTMLDocumentTagsElement Test", () => {
  const config = {
    name: "system.docTags",
    type: "Actor", // not required
    // value omitted here to test below
    // Thorough testing of the rest of `FormInputConfig` can be found in the `client/applications/forms/fields.mjs` tests.
  } satisfies Omit<HTMLDocumentTagsElement.Config, "value">;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLDocumentTagsElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLDocumentTagsElement({ value: "Actor.1234567890ABCDEF" });

    expectTypeOf(HTMLDocumentTagsElement.create({ ...config, value: [] })).toEqualTypeOf<HTMLDocumentTagsElement>();
    expectTypeOf(
      HTMLDocumentTagsElement.create({ ...config, value: "Actor.1234567890ABCDEF" }),
    ).toEqualTypeOf<HTMLDocumentTagsElement>();
    expectTypeOf(
      HTMLDocumentTagsElement.create({ ...config, value: ["Actor.1234567890ABCDEF"] }),
    ).toEqualTypeOf<HTMLDocumentTagsElement>();
    expectTypeOf(
      HTMLDocumentTagsElement.create({ ...config, value: new Set(["Actor.1234567890ABCDEF"]) }),
    ).toEqualTypeOf<HTMLDocumentTagsElement>();
  });

  const el = HTMLDocumentTagsElement.create({ ...config, value: [] });

  test("Miscellaneous", () => {
    expectTypeOf(HTMLDocumentTagsElement.tagName).toBeString();

    expectTypeOf(el.type).toEqualTypeOf<CONST.ALL_DOCUMENT_TYPES | null>();
    el.type = "Actor"; // Setter
    el.type = null; // No required type
    // @ts-expect-error "foo" is not a document type
    el.type = "foo";

    expectTypeOf(el.single).toBeBoolean();
    el.single = false; // Setter

    expectTypeOf(el.max).toBeNumber();
    el.max = 5; // Setter

    expectTypeOf(el["_initializeTags"]()).toBeVoid();
    expectTypeOf(el["_initializeTags"]([])).toBeVoid();
    expectTypeOf(el["_initializeTags"](["Actor.12345667890ABCDEF"])).toBeVoid();

    expectTypeOf(HTMLDocumentTagsElement.renderTag("Actor.1234567890ABCDEF", "A Name")).toEqualTypeOf<HTMLDivElement>();
    expectTypeOf(
      HTMLDocumentTagsElement.renderTag("Actor.1234567890ABCDEF", "A Name", false),
    ).toEqualTypeOf<HTMLDivElement>();
  });

  test("Value", () => {
    expectTypeOf(el.value).toEqualTypeOf<string[] | string | null>();
    el.value = "Actor.1234567890ABCDEF"; // Setter
    el.value = ["Actor.1234567890ABCDEF"];
    el.value = new Set(["Actor.1234567890ABCDEF"]);
    el.value = new Collection([["One", "Actor.1234567890ABCDEF"]]);

    expectTypeOf(el["_value"]).toEqualTypeOf<Record<string, string>>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<string[] | string | null>();
    expectTypeOf(el["_setValue"]("Actor.1234567890ABCDEF")).toBeVoid();
    expectTypeOf(el["_setValue"](["Actor.1234567890ABCDEF"])).toBeVoid();
    expectTypeOf(el["_setValue"](new Set(["Actor.1234567890ABCDEF"]))).toBeVoid();
    expectTypeOf(el["_setValue"](new Collection([["One", "Actor.1234567890ABCDEF"]]))).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
