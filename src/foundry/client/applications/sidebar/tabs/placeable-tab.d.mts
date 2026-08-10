import type { AnyMutableObject, DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type SearchFilter from "../../ux/search-filter.d.mts";
import type PlaceableFilter from "../filters/placeable-filter.d.mts";
import type PlaceableDirectory from "./placeable-directory.d.mts";

import Document = foundry.abstract.Document;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import PlaceablesLayer = foundry.canvas.layers.PlaceablesLayer;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaceableTab: PlaceableTab.Any;
    }
  }
}

/**
 * An application responsible for rendering a view of all placeables of a given type on the viewed Scene.
 */
declare class PlaceableTab<
  RenderContext extends PlaceableTab.RenderContext = PlaceableTab.RenderContext,
  Configuration extends PlaceableTab.Configuration = PlaceableTab.Configuration,
  RenderOptions extends PlaceableTab.RenderOptions = PlaceableTab.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @privateRemarks `collectionName` and `directory` are both required and are kept out of the
   * `DeepPartial` the base constructor applies; deep-mapping `directory` recurses through an entire
   * application and its DOM references.
   */
  constructor(options: PlaceableTab.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: PlaceableTab.DefaultOptions;

  /**
   * The filter application class used by this tab.
   *
   * @defaultValue {@linkcode PlaceableFilter}
   */
  static FILTER_CLASS: PlaceableFilter.AnyConstructor;

  /**
   * The template of the directory.
   *
   * @defaultValue `"templates/sidebar/tabs/placeable/placeables.hbs"`
   */
  static DIRECTORY_PARTIAL: string;

  /**
   * The template of a single directory entry.
   *
   * @defaultValue `"templates/sidebar/tabs/placeable/placeable.hbs"`
   */
  static ENTRY_PARTIAL: string;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The Scene's collection whose contents are shown in this tab.
   */
  get collectionName(): PlaceableTab.CollectionName;

  /**
   * The Document class of the entries shown in this tab.
   */
  get documentClass(): PlaceableTab.PlaceableDocumentClass;

  /**
   * The canvas layer whose contents are shown in this tab.
   *
   * @remarks `undefined` before the canvas is initialized.
   */
  get layer(): PlaceablesLayer.Any | undefined;

  /**
   * The schema of the entries shown in this tab.
   */
  get schema(): foundry.data.fields.SchemaField.Any;

  /**
   * Current filter state.
   */
  _filterState: PlaceableTab.FilterState;

  /**
   * The filter helper.
   */
  protected _searchFilter: SearchFilter;

  /**
   * Highlight a hovered entry in the sidebar.
   * @param object - The object being hovered on canvas.
   * @param hover  - The hover state.
   */
  hoverEntry(object: PlaceableObject.Any, hover: boolean): void;

  /**
   * Determine if a placeable is visible in the sidebar.
   * @param object - The placeable.
   */
  isEntryVisible(object: PlaceableObject.Any): boolean;

  /**
   * Test whether this tab currently has any active filter other than "Filter Viewed".
   */
  _isFiltered(): boolean;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Retrieve an entry's label for use in the directory.
   * @param entry - The directory entry.
   */
  protected _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the directory.
   * @param context - Render context.
   * @param options - Render options.
   */
  protected _prepareDirectoryContext(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  /**
   * Entry-specific preparation.
   * @param entry   - The Document instance.
   * @param context - Render context.
   */
  protected _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<PlaceableTab.EntryContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  /**
   * Prepare render context for the search part.
   * @param context - Render context.
   * @param options - Render options.
   */
  protected _prepareSearchContext(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _attachFrameListeners(): void;

  /**
   * Get context menu entries for the entries in this tab.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Handle selecting an entry.
   * @param event - The triggering event.
   */
  protected _onClickEntry(event: PointerEvent): void;

  /**
   * Handle configuring an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   *
   * @remarks Passed `null` for `event` when invoked from the context menu rather than from a double-click.
   */
  protected _onConfigureEntry(event: PointerEvent | null, target: HTMLElement): void;

  /**
   * Handle creating an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   *
   * @remarks Resolves to `undefined` without creating anything while the game is paused for a non-GM user.
   */
  protected _onCreateEntry(
    event: PointerEvent,
    target: HTMLElement,
  ): Promise<PlaceableTab.PlaceableDocument | undefined>;

  /**
   * Clear state when deactivating the directory of this tab.
   * @internal
   */
  _onDeactivateDirectory(): void;

  /**
   * Clear state when deactivating this tab.
   * @internal
   */
  _onDeactivateTab(): void;

  /**
   * Handle deleting an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onDeleteEntry(event: PointerEvent | null, target: HTMLElement): Promise<void>;

  /**
   * Handle duplicating an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   *
   * @privateRemarks Foundry's `@returns` says `Promise<Document>`, but every branch awaits and returns nothing.
   */
  protected _onDuplicateEntry(event: PointerEvent | null, target: HTMLElement): Promise<void>;

  /**
   * Prepares the data for a duplicated Document.
   * @param document - The Document that is duplicated.
   * @returns The partial data of the duplicate that overrides the original data.
   */
  protected _prepareDuplicateData(document: PlaceableTab.PlaceableDocument): AnyMutableObject;

  /**
   * Handle dragging an entry.
   * @param event - The triggering event.
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle adjusting the levels filter.
   * @param id - The ID of the level to add/remove, or null to clear the filter entirely and show all
   *             levels.
   */
  protected _onFilterByLevel(id: string | null): void;

  /**
   * Handle hovering over a directory entry.
   * @param event - The triggering event.
   */
  protected _onHoverInEntry(event: PointerEvent): void;

  /**
   * Handle no longer hovering over a directory entry.
   * @param event - The triggering event.
   */
  protected _onHoverOutEntry(event: PointerEvent): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Handle post-filter operations.
   * @param event - The triggering event.
   * @param query - The raw search query.
   * @param rgx   - The regular expression to test against.
   * @param html  - The element that should be filtered.
   */
  protected _onSearchFilter(event: KeyboardEvent | null, query: string, rgx: RegExp, html: HTMLElement | null): void;

  /**
   * Handle toggling an entry's hidden state.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onToggleHidden(event: PointerEvent | null, target: HTMLElement): Promise<void>;

  /**
   * Handle toggling an entry's locked state.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onToggleLocked(event: PointerEvent | null, target: HTMLElement): Promise<void>;

  /**
   * Filter out elements from the sidebar based on user input.
   */
  _applyFilters(): void;

  /**
   * Test whether a placeable entry matches any additional tab-specific filter criteria.
   * Only called for entries that already pass the common name, elevation, and level filters.
   * @param entry - The placeable document to test.
   * @returns True if the entry should remain visible.
   */
  protected _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean;

  /**
   * Test whether any advanced filter criteria are currently active.
   */
  protected _hasAdvancedFilters(): boolean;

  /**
   * Clear all advanced filter state.
   */
  _clearFilters(): void;

  /**
   * Retrieve the Document instance represented by the given entry's element.
   *
   * @remarks `undefined` when the element is not inside an entry, or the entry is no longer in the Scene.
   */
  protected _getPlaceableFromElement(element: HTMLElement): PlaceableTab.PlaceableDocument | undefined;

  #PlaceableTab: true;

  static #PlaceableTabStatic: true;
}

declare namespace PlaceableTab {
  interface Any extends AnyPlaceableTab {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableTab> {}

  /** The options accepted by the {@linkcode PlaceableTab} constructor; both members below are required. */
  type InputOptions<Configuration extends PlaceableTab.Configuration> = DeepPartial<
    Omit<Configuration, "collectionName" | "directory">
  > & {
    collectionName: CollectionName;
    directory: PlaceableDirectory.Any;
  };

  /** A Scene collection that can be displayed in a placeable sidebar tab. */
  type CollectionName = PlaceableObject.AnyCanvasDocument["collectionName"];

  /** Any of the embedded Documents a placeable tab can list. */
  type PlaceableDocument = Document.ImplementationFor<Document.PlaceableType>;

  /** The class of any of the embedded Documents a placeable tab can list. */
  type PlaceableDocumentClass = Document.ImplementationClassFor<Document.PlaceableType>;

  /** The inclusive elevation range entries must fall within to remain visible. */
  interface ElevationFilter {
    /** @defaultValue `-Infinity` */
    bottom: number;

    /** @defaultValue `Infinity` */
    top: number;
  }

  /**
   * Current filter state.
   *
   * @remarks Subclasses add their own criteria to this object in their constructor and narrow this
   * member; see {@linkcode foundry.applications.sidebar.tabs.TileTab.FilterState | TileTab.FilterState}.
   */
  interface FilterState {
    /**
     * The advanced filter dialog, while it is open.
     *
     * @defaultValue `null`
     */
    dialog: PlaceableFilter.Any | null;

    elevation: ElevationFilter;

    /**
     * The IDs of the levels entries are restricted to; empty when unfiltered.
     *
     * @defaultValue `new Set()`
     */
    levels: Set<string>;

    /**
     * The entries that currently pass every active filter.
     *
     * @defaultValue `new Set()`
     * @privateRemarks Foundry's typedef documents this as `Set<string>`, but `_applyFilters` adds the
     * Documents themselves and `isEntryVisible` looks them up the same way.
     */
    visible: Set<PlaceableDocument>;
  }

  /** @internal */
  interface _EntryContext {
    /** @remarks Not populated by core; the entry partial renders whatever buttons a subclass supplies. */
    buttons?: Partial<ApplicationV2.FormFooterButton>[] | undefined;

    id: string;

    label: string;

    /** @remarks `"active"` while the placeable is controlled on the canvas, otherwise the empty string. */
    css: string;
  }

  /** The render context of a single directory entry. */
  interface EntryContext extends _EntryContext {
    /** @remarks `false` when the entry's schema has no `hidden` field. */
    hidden: boolean;

    /** @remarks `false` when the entry's schema has no `locked` field. */
    locked: boolean;
  }

  /** A toggle button rendered in the search part's filter bar. */
  interface FilterButton {
    action: string;

    active: boolean;

    cssClass: string;

    tooltip: string;
  }

  interface SearchLabels {
    create: string;

    placeholder: string;
  }

  interface FilterStateContext extends FilterState {
    filteredByLevel: boolean;
  }

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      ApplicationV2.RenderContext,
      IntentionalPartial<PreparePartContext> {}

  /** Members added by {@linkcode PlaceableTab._preparePartContext | #_preparePartContext}. */
  interface PreparePartContext {
    /** @remarks Added for the directory part. */
    directoryPartial: string | undefined;

    /** @remarks Added for the directory part. */
    entryPartial: string | undefined;

    /** @remarks Added for the directory part. */
    entries: EntryContext[] | undefined;

    /** @remarks Added for the directory part; only Regions can be created from the sidebar. */
    canCreate: boolean | undefined;

    /** @remarks Added for the search part. */
    filters: FilterButton[] | undefined;

    /** @remarks Added for the search part. */
    hasLevels: boolean | undefined;

    /** @remarks Added for the search part. */
    labels: SearchLabels | undefined;

    /** @remarks Added for the search part. */
    state: FilterStateContext | undefined;
  }

  interface Configuration<PlaceableTab extends PlaceableTab.Any = PlaceableTab.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<PlaceableTab> {
    /** The name of the Scene collection represented in this tab. */
    collectionName: CollectionName;

    /** The parent directory this tab is part of. */
    directory: PlaceableDirectory.Any;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PlaceableTab extends PlaceableTab.Any = PlaceableTab.Any> = DeepPartial<
    Omit<Configuration<PlaceableTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPlaceableTab extends PlaceableTab<
  PlaceableTab.RenderContext,
  PlaceableTab.Configuration,
  PlaceableTab.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableTab;
