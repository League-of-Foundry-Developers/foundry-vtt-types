import { expectTypeOf } from "vitest";

declare const doc: PlaylistSound.Implementation;
const sheet = new foundry.applications.sheets.PlaylistSoundConfig({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<PlaylistSound.Implementation>();

expectTypeOf(
  foundry.applications.sheets.PlaylistSoundConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.PlaylistSoundConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
