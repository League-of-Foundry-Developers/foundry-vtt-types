import { expectTypeOf } from "vitest";

declare const doc: TileDocument.Implementation;
const tileConfig = new foundry.applications.sheets.TileConfig({ document: doc });

expectTypeOf(tileConfig.title).toEqualTypeOf<string>();

expectTypeOf(foundry.applications.sheets.TileConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<TileDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.TileConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.TileConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
