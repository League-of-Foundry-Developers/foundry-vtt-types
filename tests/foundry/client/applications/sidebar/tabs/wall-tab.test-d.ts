import { expectTypeOf } from "vitest";

import WallTab = foundry.applications.sidebar.tabs.WallTab;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new WallTab({ collectionName: "walls", directory });

expectTypeOf(WallTab.DEFAULT_OPTIONS).toEqualTypeOf<WallTab.DefaultOptions>();
expectTypeOf(WallTab.DIRECTORY_PARTIAL).toBeString();

// Created on first use rather than in the constructor, so it is absent until the category filter opens.
expectTypeOf(tab._filterState).toEqualTypeOf<WallTab.FilterState>();
expectTypeOf(tab._filterState.categories).toEqualTypeOf<Set<WallDocument.Category> | undefined>();

declare const entry: WallTab.EntryContext;
expectTypeOf(entry.category).toEqualTypeOf<WallDocument.Category>();

declare const group: WallTab.Group;
expectTypeOf(group.category).toEqualTypeOf<WallDocument.Category>();
expectTypeOf(group.color).toEqualTypeOf<Color>();
expectTypeOf(group.entries).toEqualTypeOf<WallTab.EntryContext[]>();

class CustomWallTab extends WallTab {
  protected override async _prepareSearchContext(
    context: WallTab.RenderContext,
    options: WallTab.RenderOptions,
  ): Promise<WallTab.RenderContext> {
    return super._prepareSearchContext(context, options);
  }

  protected override async _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<WallTab.EntryContext> {
    return super._prepareEntry(entry, context);
  }

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean {
    return super._matchesFilter(entry);
  }

  testProtected(): void {
    // Null clears the filter entirely.
    expectTypeOf(this._onFilterByCategory(null)).toEqualTypeOf<void>();
    expectTypeOf(this._onFilterByCategory("door")).toEqualTypeOf<void>();
  }
}

expectTypeOf(new CustomWallTab({ collectionName: "walls", directory })).toEqualTypeOf<CustomWallTab>();
