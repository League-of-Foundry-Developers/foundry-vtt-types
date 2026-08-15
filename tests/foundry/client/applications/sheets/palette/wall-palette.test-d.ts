import { expectTypeOf } from "vitest";

import WallPalette = foundry.applications.sheets.palette.WallPalette;

declare const context: WallPalette.RenderContext;
declare const clickEvent: PointerEvent;

expectTypeOf(WallPalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
expectTypeOf(WallPalette.COMMIT_TOOL).toBeString();
expectTypeOf(WallPalette.onClickPreset(clickEvent)).toBeVoid();
expectTypeOf(context.thresholdFields).toEqualTypeOf<foundry.applications.sheets.WallConfig.ThresholdField[]>();
expectTypeOf<keyof WallPalette.RenderContext>().not.toEqualTypeOf<"coordinates">();
