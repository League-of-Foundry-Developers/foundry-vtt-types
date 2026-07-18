import { expectTypeOf } from "vitest";

declare const doc: WallDocument.Implementation;
const wallConfig = new foundry.applications.sheets.WallConfig({ document: doc });

expectTypeOf(wallConfig.document).toEqualTypeOf<WallDocument.Implementation>();

expectTypeOf(foundry.applications.sheets.WallConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<WallDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.WallConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
