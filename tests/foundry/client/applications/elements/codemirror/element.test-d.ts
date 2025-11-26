import { describe, expectTypeOf, test } from "vitest";

import HTMLCodeMirrorElement = foundry.applications.elements.HTMLCodeMirrorElement;

describe("HTMLCodeMirrorElement Tests", () => {
  const config = {
    value: 'console.log("foo");',
    indent: 4,
    autofocus: false,
    disabled: false,
    dataset: { bar: "baz" },
    // input: //
  } satisfies HTMLCodeMirrorElement.Config;

  test("Construction", () => {
    new HTMLCodeMirrorElement();
    expectTypeOf(HTMLCodeMirrorElement.create(config)).toEqualTypeOf<HTMLCodeMirrorElement>();
  });

  const el = HTMLCodeMirrorElement.create(config);

  test("Value overrides", () => {
    expectTypeOf(el.value).toBeString();
    expectTypeOf(el["_value"]).toBeString();
    expectTypeOf(el["_getValue"]()).toBeString();
  });
});
