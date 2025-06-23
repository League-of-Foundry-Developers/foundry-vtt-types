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

// eslint-disable-next-line @typescript-eslint/no-deprecated
TextEditor.implementation.create({ engine: "tinymce", target: mount });

TextEditor.implementation.create({ engine: "prosemirror", target: mount });
