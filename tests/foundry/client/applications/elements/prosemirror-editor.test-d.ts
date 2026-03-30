import type { Plugin } from "prosemirror-state";
import { describe, expectTypeOf, test } from "vitest";

import HTMLProseMirrorElement = foundry.applications.elements.HTMLProseMirrorElement;

describe("HTMLProseMirrorElement Tests", () => {
  const config = {
    name: "system.description",
    enriched: `<a data-action="foo">a foo link</a>`,
    toggled: true,
    collaborate: true,
    compact: true,
    documentUUID: "Item.1234567890ABCDEF",
    height: 400,
    value: `@Action[foo]{a foo link}`,
    // Thorough testing of the rest of `FormInputConfig` can be found in the `client/applications/forms/fields.mjs` tests.
  } satisfies HTMLProseMirrorElement.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLProseMirrorElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLProseMirrorElement({
      toggled: false,
      enriched: `<a data-action="foo">a foo link</a>`,
      value: `@Action[foo]{a foo link}`,
    });
    expectTypeOf(HTMLProseMirrorElement.create(config)).toEqualTypeOf<HTMLProseMirrorElement>();
  });

  const el = HTMLProseMirrorElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLProseMirrorElement.tagName).toBeString();
    expectTypeOf(HTMLProseMirrorElement.observedAttributes).toEqualTypeOf<string[]>();

    expectTypeOf(el.open).toBeBoolean();
    el.open = false; // Setter

    expectTypeOf(el["_configurePlugins"]()).toEqualTypeOf<Record<string, Plugin>>();

    expectTypeOf(el.isDirty()).toBeBoolean();
  });

  test("Value", () => {
    expectTypeOf(el.value).toBeString();
    el.value = `@Action[foo]{a foo link}`; // Setter

    expectTypeOf(el["_value"]).toBeString();
    expectTypeOf(el["_getValue"]()).toBeString();
    expectTypeOf(el["_setValue"](`@Action[foo]{a foo link}`)).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el.attributeChangedCallback("open", "true", "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("open", null, "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("open", "true", null)).toBeVoid();

    expectTypeOf(el.disconnectedCallback()).toBeVoid();

    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
