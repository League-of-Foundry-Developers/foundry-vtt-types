import { expectTypeOf } from "vitest";

declare const doc: RegionDocument;
const regionSheet = new foundry.applications.sheets.RegionConfig({ document: doc });

expectTypeOf(regionSheet.tabGroups).toEqualTypeOf<{
  sheet: string;
}>();

expectTypeOf(foundry.applications.sheets.RegionConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.api.DocumentSheetV2.Configuration<RegionDocument>
>();
expectTypeOf(foundry.applications.sheets.RegionConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
