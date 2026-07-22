import { expectTypeOf } from "vitest";

declare const doc: Playlist.Implementation;
const sheet = new foundry.applications.sheets.PlaylistConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<Playlist.Implementation>();

expectTypeOf(
  foundry.applications.sheets.PlaylistConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.PlaylistConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
