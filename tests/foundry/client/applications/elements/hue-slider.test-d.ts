import { describe, expectTypeOf, test } from "vitest";

import HTMLHueSelectorSlider = foundry.applications.elements.HTMLHueSelectorSlider;

describe("HTMLHueSelectorSlider Tests", () => {
  const config = {
    name: "system.hue",
    value: 0.789,
  } satisfies HTMLHueSelectorSlider.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLHueSelectorSlider();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLHueSelectorSlider({ value: "path/to/something.ext" });
    expectTypeOf(HTMLHueSelectorSlider.create(config)).toEqualTypeOf<HTMLHueSelectorSlider>();
  });

  const el = HTMLHueSelectorSlider.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLHueSelectorSlider.tagName).toBeString();
  });

  test("Value", () => {
    expectTypeOf(el.value).toEqualTypeOf<number | undefined>();
    el.value = 0.234; // Setter

    expectTypeOf(el["_value"]).toEqualTypeOf<number | undefined>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<number | undefined>();
    expectTypeOf(el["_setValue"](0.5)).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
