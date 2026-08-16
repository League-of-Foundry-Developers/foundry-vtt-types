import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DrawingConfig = foundry.applications.sheets.DrawingConfig;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const doc: DrawingDocument.Implementation;
const drawingConfig = new DrawingConfig({ document: doc });

expectTypeOf(drawingConfig.document).toEqualTypeOf<DrawingDocument.Implementation>();

expectTypeOf(DrawingConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();
expectTypeOf(DrawingConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: DrawingConfig.RenderContext;
expectTypeOf(context.tabClasses).toBeString();
expectTypeOf(context.userColor).toEqualTypeOf<Color>();
expectTypeOf(context.units).toEqualTypeOf<DrawingConfig.Units>();
expectTypeOf(context.drawingRoles).toEqualTypeOf<Record<"false" | "true", string> | undefined>();
expectTypeOf(context.scaledBezierFactor).toEqualTypeOf<number | undefined>();
expectTypeOf(context.fillTypes).toEqualTypeOf<DrawingConfig.FillTypeChoice[] | undefined>();
expectTypeOf(context.fontFamilies).toEqualTypeOf<Record<string, string> | undefined>();
