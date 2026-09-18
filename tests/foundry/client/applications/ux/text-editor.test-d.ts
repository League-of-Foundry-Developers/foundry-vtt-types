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
});
