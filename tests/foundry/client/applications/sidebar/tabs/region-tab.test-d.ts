import { expectTypeOf } from "vitest";

import RegionTab = foundry.applications.sidebar.tabs.RegionTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import RegionFilter = foundry.applications.sidebar.filters.RegionFilter;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: PlaceableDirectory.Any;

const tab = new RegionTab({ collectionName: "regions", directory });

expectTypeOf(tab).toEqualTypeOf<RegionTab>();
expectTypeOf(tab._filterState).toEqualTypeOf<RegionTab.FilterState>();
expectTypeOf(RegionTab.ENTRY_PARTIAL).toBeString();
expectTypeOf(RegionTab.FILTER_CLASS).toEqualTypeOf<RegionFilter.AnyConstructor>();

declare class _TestRegionTabSubclass extends RegionTab {
  protected override _prepareEntry(
    entry: RegionDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<RegionTab.EntryContext>;
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _clearFilters(): void;
  protected override _hasAdvancedFilters(): boolean;
  protected override _matchesFilter(entry: RegionDocument.Implementation): boolean;
}
