import { describe, expectTypeOf, test } from "vitest";

import HTMLEnrichedContentElement = foundry.applications.elements.HTMLEnrichedContentElement;

describe("HTMLEnrichedContentElement Tests", () => {
  test("Construction", () => {
    // no constructor params or static create method
    new HTMLEnrichedContentElement();
  });

  const el = new HTMLEnrichedContentElement();

  test("Miscellaneous", () => {
    expectTypeOf(HTMLEnrichedContentElement.tagName).toBeString();
    expectTypeOf(HTMLEnrichedContentElement.observedAttributes).toEqualTypeOf<string[]>();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el.connectedCallback()).toBeVoid();

    expectTypeOf(el.attributeChangedCallback("enricher", "enricherID1", "enricherID2")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("enricher", null, "enricherID2")).toBeVoid();
    expectTypeOf(el.attributeChangedCallback("enricher", "enricherID1", null)).toBeVoid();
  });
});
