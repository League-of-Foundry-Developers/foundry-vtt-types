import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "fvtt-types/utils";

import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import PlaceableFilter = foundry.applications.sidebar.filters.PlaceableFilter;
import ContextMenu = foundry.applications.ux.ContextMenu;
import SearchFilter = foundry.applications.ux.SearchFilter;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new PlaceableTab({ collectionName: "tokens", directory });

expectTypeOf(PlaceableTab.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableTab.DefaultOptions>();
expectTypeOf(PlaceableTab.FILTER_CLASS).toEqualTypeOf<PlaceableFilter.AnyConstructor>();
expectTypeOf(PlaceableTab.DIRECTORY_PARTIAL).toBeString();
expectTypeOf(PlaceableTab.ENTRY_PARTIAL).toBeString();

expectTypeOf(tab.collectionName).toEqualTypeOf<
  foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument["collectionName"]
>();
expectTypeOf(tab.documentClass).toEqualTypeOf<PlaceableTab.PlaceableDocumentClass>();
expectTypeOf(tab.layer).toEqualTypeOf<foundry.canvas.layers.PlaceablesLayer.Any | undefined>();
expectTypeOf(tab.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

expectTypeOf(tab.options.collectionName).toEqualTypeOf<
  foundry.canvas.placeables.PlaceableObject.AnyCanvasDocument["collectionName"]
>();
expectTypeOf(tab.options.directory).toEqualTypeOf<foundry.applications.sidebar.tabs.PlaceableDirectory.Any>();

declare const object: foundry.canvas.placeables.PlaceableObject.Any;
expectTypeOf(tab.hoverEntry(object, true)).toEqualTypeOf<void>();
expectTypeOf(tab.isEntryVisible(object)).toBeBoolean();
expectTypeOf(tab._onDeactivateDirectory()).toEqualTypeOf<void>();
expectTypeOf(tab._onDeactivateTab()).toEqualTypeOf<void>();

// The filter dialogs and the parent directory reach these across class boundaries, so they cannot be protected.
expectTypeOf(tab._isFiltered()).toBeBoolean();
expectTypeOf(tab._applyFilters()).toEqualTypeOf<void>();
expectTypeOf(tab._clearFilters()).toEqualTypeOf<void>();
expectTypeOf(tab._filterState).toEqualTypeOf<PlaceableTab.FilterState>();

// The filter state is exactly the four members the base constructor creates.
declare const filterState: PlaceableTab.FilterState;
expectTypeOf(filterState.dialog).toEqualTypeOf<PlaceableFilter.Any | null>();
expectTypeOf(filterState.elevation.bottom).toBeNumber();
expectTypeOf(filterState.elevation.top).toBeNumber();
expectTypeOf(filterState.levels).toEqualTypeOf<Set<string>>();
expectTypeOf(filterState.visible).toEqualTypeOf<Set<PlaceableTab.PlaceableDocument>>();

declare const entryContext: PlaceableTab.EntryContext;
expectTypeOf(entryContext.id).toBeString();
expectTypeOf(entryContext.label).toBeString();
expectTypeOf(entryContext.css).toBeString();
expectTypeOf(entryContext.hidden).toBeBoolean();
expectTypeOf(entryContext.locked).toBeBoolean();

// Every part-specific member is optional, so a subclass preparing only one part still satisfies the context.
declare const renderContext: PlaceableTab.RenderContext;
expectTypeOf(renderContext.entries).toEqualTypeOf<PlaceableTab.EntryContext[] | undefined>();
expectTypeOf(renderContext.directoryPartial).toEqualTypeOf<string | undefined>();
expectTypeOf(renderContext.entryPartial).toEqualTypeOf<string | undefined>();
expectTypeOf(renderContext.canCreate).toEqualTypeOf<boolean | undefined>();
expectTypeOf(renderContext.filters).toEqualTypeOf<PlaceableTab.FilterButton[] | undefined>();
expectTypeOf(renderContext.hasLevels).toEqualTypeOf<boolean | undefined>();
expectTypeOf(renderContext.labels).toEqualTypeOf<PlaceableTab.SearchLabels | undefined>();
expectTypeOf(renderContext.state).toEqualTypeOf<PlaceableTab.FilterStateContext | undefined>();

class CustomPlaceableTab extends PlaceableTab {
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string {
    expectTypeOf(this._searchFilter).toEqualTypeOf<SearchFilter>();
    expectTypeOf(this._filterState).toEqualTypeOf<PlaceableTab.FilterState>();
    return entry.id ?? "";
  }

  protected override async _prepareDirectoryContext(
    context: PlaceableTab.RenderContext,
    options: PlaceableTab.RenderOptions,
  ): Promise<PlaceableTab.RenderContext> {
    return super._prepareDirectoryContext(context, options);
  }

  protected override async _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<PlaceableTab.EntryContext> {
    return super._prepareEntry(entry, context);
  }

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[] {
    return super._getEntryContextOptions();
  }

  protected override _prepareDuplicateData(document: PlaceableTab.PlaceableDocument): AnyMutableObject {
    return super._prepareDuplicateData(document);
  }

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean {
    return super._matchesFilter(entry);
  }

  protected override _hasAdvancedFilters(): boolean {
    return super._hasAdvancedFilters();
  }

  override _clearFilters(): void {
    super._clearFilters();
    this._onFilterByLevel(null);
    this._applyFilters();
  }

  testProtected(element: HTMLElement, event: PointerEvent): void {
    expectTypeOf(this._getPlaceableFromElement(element)).toEqualTypeOf<PlaceableTab.PlaceableDocument | undefined>();
    expectTypeOf(this._onClickEntry(event)).toEqualTypeOf<void>();
    expectTypeOf(this._onConfigureEntry(null, element)).toEqualTypeOf<void>();
    expectTypeOf(this._onCreateEntry(event, element)).toEqualTypeOf<
      Promise<PlaceableTab.PlaceableDocument | undefined>
    >();
    expectTypeOf(this._onDeleteEntry(event, element)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onDuplicateEntry(event, element)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onToggleHidden(event, element)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onToggleLocked(event, element)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onHoverInEntry(event)).toEqualTypeOf<void>();
    expectTypeOf(this._onHoverOutEntry(event)).toEqualTypeOf<void>();
    expectTypeOf(this._onSearchFilter(null, "", /a/, null)).toEqualTypeOf<void>();
  }
}

expectTypeOf(new CustomPlaceableTab({ collectionName: "walls", directory })).toEqualTypeOf<CustomPlaceableTab>();
