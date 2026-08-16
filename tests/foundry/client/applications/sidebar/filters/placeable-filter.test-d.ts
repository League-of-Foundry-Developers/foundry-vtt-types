import { expectTypeOf } from "vitest";

import PlaceableFilter = foundry.applications.sidebar.filters.PlaceableFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const tab: PlaceableTab;

const filter = new PlaceableFilter(tab);
new PlaceableFilter(tab, { classes: ["custom"] });

expectTypeOf(PlaceableFilter.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableFilter.DefaultOptions>();
expectTypeOf(filter.tab).toEqualTypeOf<PlaceableTab.Any>();

declare const context: PlaceableFilter.RenderContext;
expectTypeOf(context.elevation.bottom.field).toEqualTypeOf<foundry.data.fields.NumberField>();

// Null rather than the infinite bound the filter state holds.
expectTypeOf(context.elevation.bottom.value).toEqualTypeOf<number | null>();
expectTypeOf(context.elevation.top.value).toEqualTypeOf<number | null>();

class CustomPlaceableFilter extends PlaceableFilter {
  protected override _canDetach(): boolean {
    return super._canDetach();
  }

  protected override _attachFrameListeners(): void {
    super._attachFrameListeners();
    expectTypeOf(this.tab._filterState.elevation.top).toBeNumber();
  }
}

expectTypeOf(new CustomPlaceableFilter(tab)).toEqualTypeOf<CustomPlaceableFilter>();
