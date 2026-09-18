import { expectTypeOf, test } from "vitest";

import NotePalette = foundry.applications.sheets.palette.NotePalette;

declare const palette: NotePalette;
declare const context: NotePalette.RenderContext;

test("foundry/client/applications/sheets/palette/note-palette", () => {
  expectTypeOf(NotePalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
  expectTypeOf(palette.controlled).toEqualTypeOf<NoteDocument.Implementation[]>();
  expectTypeOf(context.partId).toBeString();
  expectTypeOf(palette["_determineMultiFields"]([])).toEqualTypeOf<Set<string>>();
});
