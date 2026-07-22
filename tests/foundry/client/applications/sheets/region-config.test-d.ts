import { expectTypeOf } from "vitest";

declare const doc: RegionDocument.Implementation;
const regionSheet = new foundry.applications.sheets.RegionConfig({ document: doc });

expectTypeOf(regionSheet.tabGroups).toEqualTypeOf<Record<string, string | null>>();

expectTypeOf(foundry.applications.sheets.RegionConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<RegionDocument.Implementation>
>();
expectTypeOf(foundry.applications.sheets.RegionConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.RegionConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare class _TestRegionConfigSubclass extends foundry.applications.sheets.RegionConfig {
  protected override _canDragStart(selector: string): boolean;
  protected override _canDragDrop(selector: string): boolean;
  protected override _onDragStart(event: DragEvent): Promise<void>;
  protected override _onDragOver(event: DragEvent): void;
  protected override _onDrop(event: DragEvent): Promise<void>;
}
