import { expectTypeOf } from "vitest";

import TileTab = foundry.applications.sidebar.tabs.TileTab;
import TileFilter = foundry.applications.sidebar.filters.TileFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new TileTab({ collectionName: "tiles", directory });

expectTypeOf(TileTab.FILTER_CLASS).toEqualTypeOf<TileFilter.AnyConstructor>();

expectTypeOf(tab._filterState).toEqualTypeOf<TileTab.FilterState>();
expectTypeOf(tab._filterState.occlusionModes).toEqualTypeOf<Set<CONST.OCCLUSION_MODES>>();
expectTypeOf(tab._filterState.restrictions.light).toBeBoolean();
expectTypeOf(tab._filterState.restrictions.weather).toBeBoolean();

class CustomTileTab extends TileTab {
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string {
    return super._getEntryLabel(entry);
  }

  override _clearFilters(): void {
    super._clearFilters();
  }

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean {
    return super._matchesFilter(entry);
  }

  protected override _hasAdvancedFilters(): boolean {
    return super._hasAdvancedFilters();
  }
}

expectTypeOf(new CustomTileTab({ collectionName: "tiles", directory })).toEqualTypeOf<CustomTileTab>();
