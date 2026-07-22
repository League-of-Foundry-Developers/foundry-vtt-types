import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type Canvas from "#client/canvas/board.d.mts";
import type PlaceableObject from "#client/canvas/placeables/placeable-object.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type SearchFilter from "../../ux/search-filter.d.mts";
import type PlaceableFilter from "../filters/placeable-filter.d.mts";
import type PlaceableDirectory from "./placeable-directory.d.mts";

import Document = foundry.abstract.Document;

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
  CollectionName extends string = string,
  RenderContext extends PlaceableTab.RenderContext = PlaceableTab.RenderContext,
  Configuration extends PlaceableTab.Configuration<CollectionName> = PlaceableTab.Configuration<CollectionName>,
  RenderOptions extends PlaceableTab.RenderOptions = PlaceableTab.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: PlaceableTab.InputOptions<Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   id: "{id}",
   *   tag: "section",
   *   classes: ["placeable-tab", "flexcol"],
   *   window: {
   *     frame: false,
   *     positioned: false
   *   },
   *   actions: {
   *     createEntry: PlaceableTab.#onCreateEntry,
   *     filterViewed: PlaceableTab.#onFilterViewed,
   *     openFilter: { handler: PlaceableTab.#onOpenFilter, buttons: [0, 2] }
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableTab.DefaultOptions;

  /**
   * The filter application class used by this tab.
   * @defaultValue {@linkcode PlaceableFilter}
   */
  static FILTER_CLASS: PlaceableFilter.AnyConstructor;

  /**
   * The template of the directory.
   * @defaultValue `"templates/sidebar/tabs/placeable/placeables.hbs"`
   */
  static DIRECTORY_PARTIAL: string;

  /**
   * The template of a single directory entry.
   * @defaultValue `"templates/sidebar/tabs/placeable/placeable.hbs"`
   */
  static ENTRY_PARTIAL: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   search: { template: "templates/sidebar/tabs/placeable/search.hbs" },
   *   directory: {
   *     template: "templates/sidebar/tabs/placeable/directory.hbs",
   *     scrollable: [""]
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The Scene's collection whose contents are shown in this tab.
   */
  get collectionName(): CollectionName;

  /**
   * The Document class of the entries shown in this tab.
   */
  get documentClass(): Document.AnyConstructor;

  /**
   * The canvas layer whose contents are shown in this tab.
   */
  get layer(): Canvas.GetCollectionLayerReturn<CollectionName>;

  /**
   * The schema of the entries shown in this tab.
   */
  get schema(): fields.SchemaField.Any;

  /**
   * Current filter state.
   * @remarks Despite being marked `@protected` in Foundry's source, this is read and written externally by
   * {@linkcode PlaceableFilter} (e.g. {@linkcode PlaceableFilter._prepareContext | #_prepareContext}), which is not
   * a subclass of `PlaceableTab`, so it must be public here. The index signature reflects that subclasses (and their
   * paired {@linkcode PlaceableFilter} subclasses) freely stash additional ad-hoc filter fields on this object.
   */
  _filterState: PlaceableTab.FilterState;

  /**
   * The filter helper.
   * @remarks Foundry marks this `@protected`, but it is only ever accessed within this class and its subclasses, so
   * `protected` is accurate here (unlike {@linkcode PlaceableTab._filterState | #_filterState}).
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
   * @remarks Foundry marks this `@protected`, but it is called externally by
   * {@linkcode foundry.applications.sidebar.tabs.PlaceableDirectory._updateFilterPip | PlaceableDirectory#_updateFilterPip},
   * which is not a subclass, so it must be public here.
   */
  _isFiltered(): boolean;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Retrieve an entry's label for use in the directory.
   * @param entry - The directory entry.
   */
  protected _getEntryLabel(entry: Document.Any): string;

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
    context: DeepPartial<RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<PlaceableTab.RenderContext>;

  /**
   * Entry-specific preparation.
   * @param entry   - The Document instance.
   * @param context - Render context.
   */
  protected _prepareEntry(
    entry: Document.Any,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<PlaceableTab.EntryContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the search part.
   * @param context - Render context.
   * @param options - Render options.
   */
  protected _prepareSearchContext(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<PlaceableTab.RenderOptions>,
  ): Promise<PlaceableTab.RenderContext>;

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
   */
  protected _onConfigureEntry(
    event: PointerEvent | null,
    target: HTMLElement,
  ): Promise<ApplicationV2.Any> | foundry.appv1.api.Application.Any | void;

  /**
   * Handle creating an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<Document.Any | void>;

  /**
   * Clear state when deactivating the directory of this tab.
   * @remarks Foundry marks this `@internal`, but it is called externally by
   * {@linkcode foundry.applications.sidebar.tabs.PlaceableDirectory._onDeactivate | PlaceableDirectory#_onDeactivate},
   * which is not a subclass, so it must be public here.
   */
  _onDeactivateDirectory(): void;

  /**
   * Clear state when deactivating this tab.
   * @remarks Foundry marks this `@internal`, but it is called externally by
   * {@linkcode foundry.applications.sidebar.tabs.PlaceableDirectory._renderTab | PlaceableDirectory#_renderTab},
   * which is not a subclass, so it must be public here.
   */
  _onDeactivateTab(): void;

  /**
   * Handle deleting an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onDeleteEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle duplicating an entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onDuplicateEntry(event: PointerEvent, target: HTMLElement): Promise<Document.Any | void>;

  /**
   * Prepares the data for a duplicated Document.
   * @param document - The Document that is duplicated.
   * @returns The partial data of the duplicate that overrides the original data.
   */
  protected _prepareDuplicateData(document: Document.Any): AnyObject;

  /**
   * Handle dragging an entry.
   * @param event - The triggering event.
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle adjusting the levels filter.
   * @param id - The ID of the level to add/remove, or null to clear the filter entirely and show all levels.
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
  protected _onToggleHidden(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle toggling an entry's locked state.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onToggleLocked(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Filter out elements from the sidebar based on user input.
   */
  protected _applyFilters(): void;

  /**
   * Test whether a placeable entry matches any additional tab-specific filter criteria.
   * Only called for entries that already pass the common name, elevation, and level filters.
   * @param entry - The placeable document to test.
   * @returns True if the entry should remain visible.
   */
  protected _matchesFilter(entry: Document.Any): boolean;

  /**
   * Test whether any advanced filter criteria are currently active.
   */
  protected _hasAdvancedFilters(): boolean;

  /**
   * Clear all advanced filter state.
   */
  protected _clearFilters(): void;

  /**
   * Retrieve the Document instance represented by the given entry's element.
   * @remarks Foundry types this as always returning a `Document`, but `getEmbeddedCollection(...).get(entryId)`
   * returns `undefined` if the id isn't present (e.g. a stale element after the entry was deleted).
   */
  protected _getPlaceableFromElement(element: HTMLElement): Document.Any | undefined;

  #PlaceableTab: true;
}

declare namespace PlaceableTab {
  interface Any extends AnyPlaceableTab {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableTab> {}

  interface Configuration<CollectionName extends string = string>
    extends ApplicationV2.Configuration, HandlebarsApplicationMixin.Configuration {
    /**
     * The name of the Scene collection represented in this tab.
     */
    collectionName: CollectionName;

    /**
     * The parent directory this tab is part of.
     */
    directory: PlaceableDirectory.Any;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  /** @internal */
  type _RequiredConfiguration = "collectionName" | "directory";

  type InputOptions<Configuration extends PlaceableTab.Configuration = PlaceableTab.Configuration> = DeepPartial<
    Omit<Configuration, _RequiredConfiguration>
  > &
    Pick<Configuration, _RequiredConfiguration>;

  interface RenderOptions extends ApplicationV2.RenderOptions, HandlebarsApplicationMixin.RenderOptions {}

  interface FilterState {
    dialog: PlaceableFilter.Any | null;
    elevation: { bottom: number; top: number };
    levels: Set<string>;

    /**
     * @remarks Despite Foundry's own JSDoc typing this as `Set<string>`, the entries are actually the Documents
     * themselves (see {@linkcode PlaceableTab.isEntryVisible | #isEntryVisible}'s `.has(object.document)` check).
     */
    visible: Set<Document.Any>;

    [key: string]: unknown;
  }

  interface FilterButtonContext {
    action: string;
    active: boolean;
    cssClass: string;
    tooltip: string;
  }

  interface SearchLabelsContext {
    create: string;
    placeholder: string;
  }

  interface PartialEntryContext {
    css: string;
    id: string;
    label: string;
  }

  interface EntryContext extends PartialEntryContext {
    /** @remarks Added by {@linkcode PlaceableTab._prepareEntry | #_prepareEntry} */
    hidden: boolean;

    /** @remarks Added by {@linkcode PlaceableTab._prepareEntry | #_prepareEntry} */
    locked: boolean;
  }

  interface RenderContext extends ApplicationV2.RenderContext, HandlebarsApplicationMixin.RenderContext {
    /** @remarks Added by {@linkcode PlaceableTab._prepareDirectoryContext | #_prepareDirectoryContext} */
    directoryPartial?: string | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareDirectoryContext | #_prepareDirectoryContext} */
    entryPartial?: string | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareDirectoryContext | #_prepareDirectoryContext} */
    entries?: EntryContext[] | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareSearchContext | #_prepareSearchContext} */
    labels?: SearchLabelsContext | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareSearchContext | #_prepareSearchContext} */
    canCreate?: boolean | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareSearchContext | #_prepareSearchContext} */
    filters?: FilterButtonContext[] | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareSearchContext | #_prepareSearchContext} */
    hasLevels?: boolean | undefined;

    /** @remarks Added by {@linkcode PlaceableTab._prepareSearchContext | #_prepareSearchContext} */
    state?: (FilterState & { filteredByLevel: boolean }) | undefined;
  }
}

declare abstract class AnyPlaceableTab extends PlaceableTab<
  string,
  PlaceableTab.RenderContext,
  PlaceableTab.Configuration,
  PlaceableTab.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableTab;
