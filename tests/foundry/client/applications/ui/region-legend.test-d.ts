import { expectTypeOf } from "vitest";

const regionLegend = new foundry.applications.ui.RegionLegend({});

expectTypeOf(regionLegend.elevation).toEqualTypeOf<{ bottom: number; top: number }>();
expectTypeOf(regionLegend.close()).toEqualTypeOf<Promise<foundry.applications.ui.RegionLegend>>();

declare const region: RegionDocument.Implementation;
expectTypeOf(regionLegend._isRegionVisible(region)).toEqualTypeOf<boolean>();
expectTypeOf(regionLegend._hoverRegion(region, true)).toEqualTypeOf<void>();

expectTypeOf(
  foundry.applications.ui.RegionLegend.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.ui.RegionLegend.DefaultOptions>();
expectTypeOf(foundry.applications.ui.RegionLegend.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
