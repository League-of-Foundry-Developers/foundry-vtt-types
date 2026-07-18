import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableFilter = foundry.applications.sidebar.filters.PlaceableFilter;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const directory: PlaceableDirectory.Any;

declare class TestPlaceableTab extends PlaceableTab<"tokens"> {}
const tab = new TestPlaceableTab({ collectionName: "tokens", directory });

expectTypeOf(tab).toEqualTypeOf<TestPlaceableTab>();
expectTypeOf(tab.collectionName).toEqualTypeOf<"tokens">();
expectTypeOf(tab.documentClass).toEqualTypeOf<foundry.abstract.Document.AnyConstructor>();
expectTypeOf(tab.layer).toEqualTypeOf<foundry.canvas.Canvas.GetCollectionLayerReturn<"tokens">>();
expectTypeOf(tab.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

expectTypeOf(tab._filterState).toEqualTypeOf<PlaceableTab.FilterState>();

declare const object: foundry.canvas.placeables.PlaceableObject.Any;
expectTypeOf(tab.hoverEntry(object, true)).toBeVoid();
expectTypeOf(tab.isEntryVisible(object)).toBeBoolean();
expectTypeOf(tab._isFiltered()).toBeBoolean();
expectTypeOf(tab._onDeactivateDirectory()).toBeVoid();
expectTypeOf(tab._onDeactivateTab()).toBeVoid();

expectTypeOf(PlaceableTab.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableTab.DefaultOptions>();
expectTypeOf(PlaceableTab.FILTER_CLASS).toEqualTypeOf<PlaceableFilter.AnyConstructor>();
expectTypeOf(PlaceableTab.DIRECTORY_PARTIAL).toBeString();
expectTypeOf(PlaceableTab.ENTRY_PARTIAL).toBeString();
expectTypeOf(PlaceableTab.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestPlaceableTabSubclass extends PlaceableTab<"tokens"> {
  protected override _getEntryLabel(entry: foundry.abstract.Document.Any): string;
  protected override _onFirstRender(
    context: DeepPartial<PlaceableTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<void>;
  protected override _prepareDirectoryContext(
    context: DeepPartial<PlaceableTab.RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<PlaceableTab.RenderContext>;
  protected override _prepareEntry(
    entry: foundry.abstract.Document.Any,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<PlaceableTab.EntryContext>;
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
  protected override _onCreateEntry(
    event: PointerEvent,
    target: HTMLElement,
  ): Promise<foundry.abstract.Document.Any | void>;
  protected override _onConfigureEntry(
    event: PointerEvent | null,
    target: HTMLElement,
  ): Promise<foundry.applications.api.ApplicationV2.Any> | foundry.appv1.api.Application.Any | void;
  protected override _matchesFilter(entry: foundry.abstract.Document.Any): boolean;
  protected override _hasAdvancedFilters(): boolean;
  protected override _clearFilters(): void;
  protected override _applyFilters(): void;
}
