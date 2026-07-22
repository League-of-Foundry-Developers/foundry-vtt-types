import { expectTypeOf } from "vitest";

declare const doc: NoteDocument.Implementation;
const noteConfig = new foundry.applications.sheets.NoteConfig({ document: doc });

expectTypeOf(noteConfig.title).toEqualTypeOf<string>();

expectTypeOf(foundry.applications.sheets.NoteConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<NoteDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.NoteConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
