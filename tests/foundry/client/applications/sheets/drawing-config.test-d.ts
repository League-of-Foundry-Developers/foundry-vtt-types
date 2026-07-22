import { expectTypeOf } from "vitest";

declare const doc: DrawingDocument.Implementation;
const drawingConfig = new foundry.applications.sheets.DrawingConfig({ document: doc });

expectTypeOf(drawingConfig.document).toEqualTypeOf<DrawingDocument.Implementation>();

expectTypeOf(foundry.applications.sheets.DrawingConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<DrawingDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.DrawingConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.DrawingConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
