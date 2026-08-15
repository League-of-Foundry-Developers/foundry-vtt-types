import { expectTypeOf } from "vitest";

import RegionTab = foundry.applications.sidebar.tabs.RegionTab;
import RegionFilter = foundry.applications.sidebar.filters.RegionFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new RegionTab({ collectionName: "regions", directory });

expectTypeOf(RegionTab.ENTRY_PARTIAL).toBeString();
expectTypeOf(RegionTab.FILTER_CLASS).toEqualTypeOf<RegionFilter.AnyConstructor>();

expectTypeOf(tab._filterState).toEqualTypeOf<RegionTab.FilterState>();
expectTypeOf<RegionTab.BehaviorType>().toEqualTypeOf<
  Exclude<RegionBehavior.SubType, typeof CONST.BASE_DOCUMENT_TYPE> | ""
>();
expectTypeOf(tab._filterState.behaviorType).toEqualTypeOf<RegionTab.BehaviorType>();

declare const entry: RegionTab.EntryContext;
expectTypeOf(entry.isVisible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(entry.color).toEqualTypeOf<Color>();
expectTypeOf(entry.empty).toBeBoolean();

// Formatted for display, so the bounds are localized strings rather than the document's numbers.
expectTypeOf(entry.elevation.bottom).toBeString();
expectTypeOf(entry.elevation.top).toBeString();
expectTypeOf(entry.elevation.topInclusive).toBeBoolean();
expectTypeOf(entry.elevation.label).toBeString();

class CustomRegionTab extends RegionTab {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[] {
    return super._getEntryContextOptions();
  }

  protected override async _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<RegionTab.EntryContext> {
    return super._prepareEntry(entry, context);
  }

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean {
    return super._matchesFilter(entry);
  }
}

expectTypeOf(new CustomRegionTab({ collectionName: "regions", directory })).toEqualTypeOf<CustomRegionTab>();
