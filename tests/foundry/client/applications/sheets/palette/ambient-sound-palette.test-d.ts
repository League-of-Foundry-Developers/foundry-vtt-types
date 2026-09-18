import { expectTypeOf, test } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import AmbientSoundPalette = foundry.applications.sheets.palette.AmbientSoundPalette;

declare const palette: AmbientSoundPalette;
declare const context: AmbientSoundPalette.RenderContext;

test("foundry/client/applications/sheets/palette/ambient-sound-palette", () => {
  expectTypeOf(AmbientSoundPalette.SETTING_KEY).toBeString();
  expectTypeOf(AmbientSoundPalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
  expectTypeOf(palette.controlled).toEqualTypeOf<AmbientSoundDocument.Implementation[]>();
  expectTypeOf(palette.createData).toEqualTypeOf<AnyMutableObject>();
  expectTypeOf(context.partId).toBeString();
  expectTypeOf(context.soundEffects).toEqualTypeOf<
    foundry.applications.sheets.AmbientSoundConfig.RenderContext["soundEffects"]
  >();
});
