import { expectTypeOf } from "vitest";

import palette = foundry.applications.sheets.palette;

expectTypeOf(palette.AmbientLightPalette).toExtend<palette.AmbientLightPalette.AnyConstructor>();
expectTypeOf(palette.AmbientSoundPalette).toExtend<palette.AmbientSoundPalette.AnyConstructor>();
expectTypeOf(palette.DrawingPalette).toExtend<palette.DrawingPalette.AnyConstructor>();
expectTypeOf(palette.NotePalette).toExtend<palette.NotePalette.AnyConstructor>();
expectTypeOf(palette.RegionPalette).toExtend<palette.RegionPalette.AnyConstructor>();
expectTypeOf(palette.TilePalette).toExtend<palette.TilePalette.AnyConstructor>();
expectTypeOf(palette.WallPalette).toExtend<palette.WallPalette.AnyConstructor>();
expectTypeOf(palette.PlaceablePaletteMixin).toBeFunction();
