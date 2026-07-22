import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import WallTab = foundry.applications.sidebar.tabs.WallTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: PlaceableDirectory.Any;

const tab = new WallTab({ collectionName: "walls", directory });

expectTypeOf(tab).toEqualTypeOf<WallTab>();
expectTypeOf(tab._filterState).toEqualTypeOf<WallTab.FilterState>();

expectTypeOf(WallTab.DEFAULT_OPTIONS).toEqualTypeOf<WallTab.DefaultOptions>();
expectTypeOf(WallTab.DIRECTORY_PARTIAL).toBeString();

declare class _TestWallTabSubclass extends WallTab {
  protected override _prepareDirectoryContext(
    context: DeepPartial<WallTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<WallTab.RenderContext>;
  protected override _prepareEntry(
    entry: WallDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<WallTab.EntryContext>;
  protected override _prepareSearchContext(
    context: DeepPartial<WallTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<WallTab.RenderContext>;
  protected override _attachFrameListeners(): void;
  protected override _matchesFilter(entry: WallDocument.Implementation): boolean;
  protected override _onFilterByCategory(cat: WallDocument.Category | null): void;
}
