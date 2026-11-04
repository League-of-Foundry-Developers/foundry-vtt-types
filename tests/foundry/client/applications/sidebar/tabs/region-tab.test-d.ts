import { expectTypeOf, test } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import RegionTab = foundry.applications.sidebar.tabs.RegionTab;
import RegionFilter = foundry.applications.sidebar.filters.RegionFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

declare const entry: RegionTab.EntryContext;

declare const renderContext: RegionTab.RenderContext;

declare const group: RegionTab.Group;

test("foundry/client/applications/sidebar/tabs/region-tab", () => {
  const tab = new RegionTab({ collectionName: "regions", directory });

  expectTypeOf(RegionTab.DEFAULT_OPTIONS).toEqualTypeOf<RegionTab.DefaultOptions>();
  expectTypeOf(RegionTab.DIRECTORY_PARTIAL).toBeString();
  expectTypeOf(RegionTab.ENTRY_PARTIAL).toBeString();
  expectTypeOf(RegionTab.FILTER_CLASS).toEqualTypeOf<RegionFilter.AnyConstructor>();

  expectTypeOf(tab._filterState).toEqualTypeOf<RegionTab.FilterState>();
  expectTypeOf<RegionTab.BehaviorType>().toEqualTypeOf<
    Exclude<RegionBehavior.SubType, typeof CONST.BASE_DOCUMENT_TYPE> | ""
  >();
  expectTypeOf(tab._filterState.behaviorType).toEqualTypeOf<RegionTab.BehaviorType>();
  expectTypeOf(entry.isVisible).toEqualTypeOf<boolean | undefined>();
  expectTypeOf(entry.hasPlayerOwner).toEqualTypeOf<boolean | undefined>();
  expectTypeOf(entry.color).toEqualTypeOf<Color>();
  expectTypeOf(entry.empty).toBeBoolean();

  // Formatted for display, so the bounds are localized strings rather than the document's numbers.
  expectTypeOf(entry.elevation.bottom).toBeString();
  expectTypeOf(entry.elevation.top).toBeString();
  expectTypeOf(entry.elevation.topInclusive).toBeBoolean();
  expectTypeOf(entry.elevation.label).toBeString();

  // GMs see the entries split by owner instead of a flat list.
  expectTypeOf(renderContext.isGM).toEqualTypeOf<boolean | undefined>();
  expectTypeOf(renderContext.groups).toEqualTypeOf<RegionTab.Group[] | undefined>();
  expectTypeOf(group.owner).toEqualTypeOf<"player" | "gm">();
  expectTypeOf(group.label).toBeString();
  expectTypeOf(group.entries).toEqualTypeOf<RegionTab.EntryContext[]>();

  class CustomRegionTab extends RegionTab {
    protected override async _prepareDirectoryContext(
      context: RegionTab.RenderContext,
      options: DeepPartial<RegionTab.RenderOptions>,
    ): Promise<RegionTab.RenderContext> {
      return super._prepareDirectoryContext(context, options);
    }

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
});
