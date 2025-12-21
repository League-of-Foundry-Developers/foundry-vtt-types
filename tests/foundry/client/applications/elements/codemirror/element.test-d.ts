import { describe, expectTypeOf, test } from "vitest";

import HTMLCodeMirrorElement = foundry.applications.elements.HTMLCodeMirrorElement;

describe("HTMLCodeMirrorElement Tests", () => {
  const config = {
    name: "system.foo",
    value: 'console.log("foo");',
    indent: 4,
    autofocus: false,
    disabled: false,
    dataset: { bar: "baz" },
    aria: { fizz: "buzz" },
    classes: "space separated",
    id: "super-unique-id",
    language: "javascript",
    localize: true,
    placeholder: "// placeholder",
    readonly: false,
    required: false,
  } satisfies HTMLCodeMirrorElement.Config;

  test("Construction", () => {
    // @ts-expect-error Has a static create method, so the constructor is protected
    new HTMLCodeMirrorElement();
    // @ts-expect-error Has a static create method, so the constructor is protected
    new HTMLCodeMirrorElement({ value: "/* some code */" });
    expectTypeOf(HTMLCodeMirrorElement.create(config)).toEqualTypeOf<HTMLCodeMirrorElement>();
  });

  const el = HTMLCodeMirrorElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLCodeMirrorElement.tagName).toBeString();
    expectTypeOf(HTMLCodeMirrorElement.observedAttributes).toEqualTypeOf<string[]>();
  });

  test("Element specific properties", () => {
    expectTypeOf(el.language).toEqualTypeOf<HTMLCodeMirrorElement.Language>();
    el.language = "javascript"; // Setter
    // @ts-expect-error "foo" is not a valid language
    el.language = "foo";

    expectTypeOf(el.indent).toBeNumber();
    el.indent = 4; // Setter

    expectTypeOf(el.managed).toBeBoolean();
    el.managed = false; // Setter

    expectTypeOf(el.nowrap).toBeBoolean();
  });

  test("Value", () => {
    expectTypeOf(el.value).toBeString();
    el.value = "console.log('log')"; // Setter

    expectTypeOf(el["_value"]).toBeString();
    expectTypeOf(el["_getValue"]()).toBeString();
    expectTypeOf(el["_setValue"]("ui.notifications.error('oops')")).toBeVoid();
  });

  test("Position", () => {
    expectTypeOf(el.cursor).toEqualTypeOf<number | null>();

    expectTypeOf(el.posAtCoords({ x: 500, y: 500 })).toBeNumber();

    // the first param is ignored
    expectTypeOf(el.scrollTo(0, 50)).toBeVoid();
    // only `top` matters, `left` would be ignored
    expectTypeOf(el.scrollTo({ top: 50 })).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();

    expectTypeOf(el.connectedCallback()).toBeVoid();

    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();

    expectTypeOf(el.attributeChangedCallback("disabled", "true", "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("disabled", null, "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("disabled", "true", null)).toBeVoid();

    expectTypeOf(el.disconnectedCallback()).toBeVoid();
  });
});
