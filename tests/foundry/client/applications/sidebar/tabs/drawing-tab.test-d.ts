import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import DrawingTab = foundry.applications.sidebar.tabs.DrawingTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: PlaceableDirectory.Any;

const tab = new DrawingTab({ collectionName: "drawings", directory });

expectTypeOf(tab).toEqualTypeOf<DrawingTab>();

expectTypeOf(DrawingTab.DEFAULT_OPTIONS).toEqualTypeOf<DrawingTab.DefaultOptions>();
expectTypeOf(DrawingTab.DIRECTORY_PARTIAL).toBeString();

declare class _TestDrawingTabSubclass extends DrawingTab {
  protected override _getEntryLabel(entry: DrawingDocument.Implementation): string;
  protected override _prepareDirectoryContext(
    context: DeepPartial<DrawingTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<DrawingTab.RenderContext>;
  protected override _prepareEntry(
    entry: DrawingDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<DrawingTab.EntryContext>;
}
