import { describe, expectTypeOf, test } from "vitest";

import HTMLSecretBlockElement = foundry.applications.elements.HTMLSecretBlockElement;

describe("HTMLSecretBlockElement Tests", () => {
  test("Construction", () => {
    // no construction params, no static create method
    new HTMLSecretBlockElement();
  });

  const el = new HTMLSecretBlockElement();

  test("Miscellaneous", () => {
    expectTypeOf(HTMLSecretBlockElement.tagName).toBeString();

    expectTypeOf(el.secret).toEqualTypeOf<HTMLElement | null>();
    expectTypeOf(el.revealed).toBeBoolean();

    expectTypeOf(el.toggleRevealed('<section id="some-secret-section">SECRET</section>')).toBeString();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el.connectedCallback()).toBeVoid();
  });
});
