import { describe, expectTypeOf, test } from "vitest";

import HTMLFilePickerElement = foundry.applications.elements.HTMLFilePickerElement;
import FilePicker = foundry.applications.apps.FilePicker;

describe("HTMLFilePickerElement Tests", () => {
  const config = {
    name: "system.someSound",
    type: "audio",
    noupload: true,
    value: "path/to/something.ext",
    // Thorough testing of the rest of `FormInputConfig` can be found in the `client/applications/forms/fields.mjs` tests.
  } satisfies HTMLFilePickerElement.Config;

  test("Construction", () => {
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLFilePickerElement();
    // @ts-expect-error Custom elements with `static create` functions have protected constructors
    new HTMLFilePickerElement({ value: "path/to/something.ext" });
    expectTypeOf(HTMLFilePickerElement.create(config)).toEqualTypeOf<HTMLFilePickerElement>();
  });

  const el = HTMLFilePickerElement.create(config);

  test("Miscellaneous", () => {
    expectTypeOf(HTMLFilePickerElement.tagName).toBeString();

    expectTypeOf(el.input).toEqualTypeOf<HTMLInputElement | undefined>();
    expectTypeOf(el.button).toEqualTypeOf<HTMLButtonElement | undefined>();
    expectTypeOf(el.picker).toEqualTypeOf<FilePicker | undefined>();

    expectTypeOf(el.type).toEqualTypeOf<FilePicker.Type>();
    el.type = "folder"; // Setter
    // @ts-expect-error "foo" is not a valid type of file picker
    el.type = "foo";

    expectTypeOf(el.noupload).toEqualTypeOf<boolean>();
    el.noupload = false; // Setter
  });

  test("Value", () => {
    expectTypeOf(el.value).toEqualTypeOf<string | undefined>();
    el.value = "path/to/thing.ext"; // Setter

    expectTypeOf(el["_value"]).toEqualTypeOf<string | undefined>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<string | undefined>();
    expectTypeOf(el["_setValue"]("assets/icons/foo.png")).toBeVoid();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();
    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
  });
});
