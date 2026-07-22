import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import RegionFilter = foundry.applications.sidebar.filters.RegionFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const tab: PlaceableTab.Any;

const filter = new RegionFilter(tab);

expectTypeOf(filter).toEqualTypeOf<RegionFilter>();

expectTypeOf(RegionFilter.DEFAULT_OPTIONS).toEqualTypeOf<RegionFilter.DefaultOptions>();
expectTypeOf(RegionFilter.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestRegionFilterSubclass extends RegionFilter {
  protected override _prepareContext(
    options: DeepPartial<RegionFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<RegionFilter.RenderContext>;
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}
