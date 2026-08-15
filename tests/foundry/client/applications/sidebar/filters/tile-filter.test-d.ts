import { expectTypeOf } from "vitest";

import TileFilter = foundry.applications.sidebar.filters.TileFilter;
import TileTab = foundry.applications.sidebar.tabs.TileTab;

declare const tab: TileTab;

const filter = new TileFilter(tab);

expectTypeOf(TileFilter.DEFAULT_OPTIONS).toEqualTypeOf<TileFilter.DefaultOptions>();
expectTypeOf(filter.tab).toEqualTypeOf<TileTab.Any>();

declare const context: TileFilter.RenderContext;
expectTypeOf(context.occlusion.field).toEqualTypeOf<TileFilter.OcclusionField>();
expectTypeOf(context.occlusion.value).toEqualTypeOf<Set<CONST.OCCLUSION_MODES>>();
expectTypeOf(context.restrictions.light.field).toEqualTypeOf<foundry.data.fields.BooleanField>();
expectTypeOf(context.restrictions.weather.value).toBeBoolean();
expectTypeOf(context.elevation.top.value).toEqualTypeOf<number | null>();

expectTypeOf(filter.tab._filterState.occlusionModes).toEqualTypeOf<Set<CONST.OCCLUSION_MODES>>();
expectTypeOf(filter.tab._filterState.restrictions.light).toBeBoolean();

class CustomTileFilter extends TileFilter {
  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void {
    super._onChangeForm(formConfig, event);
  }
}

expectTypeOf(new CustomTileFilter(tab)).toEqualTypeOf<CustomTileFilter>();
