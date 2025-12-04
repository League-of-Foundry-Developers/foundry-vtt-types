import { describe, expectTypeOf, test } from "vitest";

import AbstractFormInputElement = foundry.applications.elements.AbstractFormInputElement;

describe("AbstractFormInputElement Tests", () => {
  class TestFIE extends AbstractFormInputElement<number> {}

  const el = new TestFIE();
  const input = document.createElement("input");
  const clickEv = new PointerEvent("click");

  test("Miscellaneous", () => {
    expectTypeOf(TestFIE.tagName).toBeString();
    expectTypeOf(TestFIE.formAssociated).toBeBoolean();
    expectTypeOf(TestFIE.observedAttributes).toEqualTypeOf<string[]>();

    expectTypeOf(el["_applyInputAttributes"](input)).toBeVoid();

    expectTypeOf(el["_internals"]).toEqualTypeOf<ElementInternals>();
    expectTypeOf(el["_primaryInput"]).toEqualTypeOf<HTMLElement | undefined>();

    expectTypeOf(el.form).toEqualTypeOf<HTMLFormElement | null>();
    expectTypeOf(el.name).toBeString();
    el.name = "foo"; // Setter

    expectTypeOf(el.value).toEqualTypeOf<number | undefined>();
    el.value = 7; // Setter

    expectTypeOf(el["_value"]).toEqualTypeOf<number | undefined>();
    expectTypeOf(el["_getValue"]()).toEqualTypeOf<number | undefined>();
    expectTypeOf(el["_setValue"](7)).toBeVoid();
    // @ts-expect-error This is a number input, can't set a string on it
    el["_setValue"]("bar");

    expectTypeOf(el.disabled).toBeBoolean();
    el.disabled = false; // Setter

    expectTypeOf(el.editable).toBeBoolean();

    expectTypeOf(el.abortSignal).toEqualTypeOf<AbortSignal | undefined>();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el.connectedCallback()).toBeVoid();
    expectTypeOf(el.disconnectedCallback()).toBeVoid();
    expectTypeOf(el.formDisabledCallback(true)).toBeVoid();
    expectTypeOf(el["_toggleDisabled"](true)).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("disabled", "true", "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("disabled", null, "false")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("disabled", "true", null)).toBeVoid();

    // @ts-expect-error We can't infer the real type from the name, but we enforce the same type for `oldValue` and `newValue`
    // This might be an unsafe assumption, if the real type is `| null`.
    el.attributeChangedCallback("foo", 7, "bar");

    expectTypeOf(el["_disconnect"]()).toBeVoid();

    expectTypeOf(el["_buildElements"]()).toEqualTypeOf<HTMLElement[]>();

    expectTypeOf(el["_refresh"]()).toBeVoid();
    expectTypeOf(el["_activateListeners"]()).toBeVoid();

    expectTypeOf(el["_onClick"](clickEv)).toBeVoid();
  });
});

declare const formInput: foundry.applications.elements.AbstractFormInputElement<number>;
expectTypeOf(formInput.disabled).toEqualTypeOf<boolean>();
expectTypeOf(formInput.editable).toEqualTypeOf<boolean>();
expectTypeOf(formInput.connectedCallback()).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.elements.AbstractFormInputElement.tagName).toEqualTypeOf<string>();
expectTypeOf(foundry.applications.elements.AbstractFormInputElement.formAssociated).toEqualTypeOf<boolean>();
