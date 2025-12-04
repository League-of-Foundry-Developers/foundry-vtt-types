import { describe, expectTypeOf, test } from "vitest";

import HTMLDocumentEmbedElement = foundry.applications.elements.HTMLDocumentEmbedElement;

describe("HTMLDocumentEmbedElement Tests", () => {
  const el = new HTMLDocumentEmbedElement();

  test("Miscellaneous", () => {
    expectTypeOf(HTMLDocumentEmbedElement.tagName).toBeString();
  });

  test("Element API and lifecycle methods", () => {
    expectTypeOf(el.connectedCallback()).toBeVoid();
  });
});
