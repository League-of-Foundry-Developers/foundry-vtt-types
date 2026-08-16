import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DrawingPalette = foundry.applications.sheets.palette.DrawingPalette;

declare const palette: DrawingPalette;
declare const context: DrawingPalette.RenderContext;

expectTypeOf(DrawingPalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
expectTypeOf(DrawingPalette._migrateDefaultDrawingConfig()).toBeVoid();
expectTypeOf(palette.controlled).toEqualTypeOf<DrawingDocument.Implementation[]>();
expectTypeOf(context.isFreehand).toBeBoolean();
expectTypeOf(context.scaledBezierFactor).toBeNumber();
expectTypeOf(context.fillDisabled).toBeBoolean();
expectTypeOf(context.fillTypes).toEqualTypeOf<foundry.applications.sheets.DrawingConfig.FillTypeChoice[]>();
expectTypeOf(context.fontFamilies).toEqualTypeOf<Record<string, string>>();
expectTypeOf(context.drawingRoles).toEqualTypeOf<Record<"false" | "true", string>>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
