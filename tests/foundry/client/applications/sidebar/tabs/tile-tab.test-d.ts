import { expectTypeOf } from "vitest";

import TileTab = foundry.applications.sidebar.tabs.TileTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import TileFilter = foundry.applications.sidebar.filters.TileFilter;

declare const directory: PlaceableDirectory.Any;

const tab = new TileTab({ collectionName: "tiles", directory });

expectTypeOf(tab).toEqualTypeOf<TileTab>();
expectTypeOf(tab._filterState).toEqualTypeOf<TileTab.FilterState>();
expectTypeOf(TileTab.FILTER_CLASS).toEqualTypeOf<TileFilter.AnyConstructor>();

declare class _TestTileTabSubclass extends TileTab {
  protected override _getEntryLabel(entry: TileDocument.Implementation): string;
  protected override _clearFilters(): void;
  protected override _matchesFilter(entry: TileDocument.Implementation): boolean;
  protected override _hasAdvancedFilters(): boolean;
}
