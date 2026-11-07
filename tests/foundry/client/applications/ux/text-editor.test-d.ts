import { expectTypeOf, test } from "vitest";

import TextEditor = foundry.applications.ux.TextEditor;

declare const myContent: string;

// Deprecation check

declare const mount: HTMLElement;

test("foundry/client/applications/ux/text-editor", async () => {
  const enrichedContent = await TextEditor.implementation.enrichHTML(myContent, {
    rollData: () => ({
      foo: "bar",
    }),
  });

  expectTypeOf(enrichedContent).toBeString();

  TextEditor.implementation.create({ engine: "prosemirror", target: mount });
  TextEditor.implementation.create({ engine: "custom-engine" });

  const customEngine = await TextEditor.implementation.create({ engine: "custom-engine" });
  expectTypeOf(customEngine).toEqualTypeOf<TextEditor.CustomEngine>();

  // `onRender` always receives a signal that aborts when the element is disconnected.
  const enricherConfig: TextEditor.EnricherConfig = {
    pattern: /@Foo\[(\w+)]/g,
    enricher: async () => null,
    onRender: (element, { signal }) => {
      expectTypeOf(element).toEqualTypeOf<foundry.applications.elements.HTMLEnrichedContentElement>();
      element.addEventListener("click", () => {}, { signal });
    },
  };
  void enricherConfig;
});
