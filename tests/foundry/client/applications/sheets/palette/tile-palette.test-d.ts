import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import TilePalette = foundry.applications.sheets.palette.TilePalette;

declare const palette: TilePalette;
declare const context: TilePalette.RenderContext;

expectTypeOf(TilePalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
expectTypeOf(palette.controlled).toEqualTypeOf<TileDocument.Implementation[]>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(context.elevation).toBeNumber();
expectTypeOf(context.isForeground).toBeBoolean();
