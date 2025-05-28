import { expectTypeOf } from "vitest";

import TextEditor = foundry.applications.ux.TextEditor;

declare const myContent: string;

const enrichedContent = await TextEditor.implementation.enrichHTML(myContent, {
  rollData: () => ({
    foo: "bar",
  }),
});

expectTypeOf(enrichedContent).toBeString();

// Deprecation check

declare const mount: HTMLElement;

TextEditor.implementation.create({ engine: "tinymce", target: mount });

TextEditor.implementation.create({ engine: "prosemirror", target: mount });
