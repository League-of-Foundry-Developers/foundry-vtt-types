import { expectTypeOf } from "vitest";

import RegionFilter = foundry.applications.sidebar.filters.RegionFilter;
import RegionTab = foundry.applications.sidebar.tabs.RegionTab;

declare const tab: RegionTab;

const filter = new RegionFilter(tab);

expectTypeOf(RegionFilter.DEFAULT_OPTIONS).toEqualTypeOf<RegionFilter.DefaultOptions>();
expectTypeOf(filter.tab).toEqualTypeOf<RegionTab.Any>();

// The empty string is the unfiltered value, so this is never nullish.
expectTypeOf(filter.tab._filterState.behaviorType).toBeString();

declare const context: RegionFilter.RenderContext;
expectTypeOf(context.behaviorType.field).toEqualTypeOf<foundry.data.fields.StringField>();
expectTypeOf(context.behaviorType.value).toBeString();
expectTypeOf(context.elevation.bottom.value).toEqualTypeOf<number | null>();

class CustomRegionFilter extends RegionFilter {
  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void {
    super._onChangeForm(formConfig, event);
  }
}

expectTypeOf(new CustomRegionFilter(tab)).toEqualTypeOf<CustomRegionFilter>();
