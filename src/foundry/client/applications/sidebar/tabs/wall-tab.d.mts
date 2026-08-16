import type { DeepPartial, Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallTab: WallTab.Any;
    }
  }
}

/**
 * The Wall-specific placeables tab.
 */
declare class WallTab<
  RenderContext extends WallTab.RenderContext = WallTab.RenderContext,
  Configuration extends WallTab.Configuration = WallTab.Configuration,
  RenderOptions extends WallTab.RenderOptions = WallTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: WallTab.DefaultOptions;

  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/walls.hbs"`
   */
  static override DIRECTORY_PARTIAL: string;

  // Fake override.
  override _filterState: WallTab.FilterState;

  /**
   * @remarks Groups the prepared entries by wall category, in a fixed order that puts secret doors first
   * and uncategorized walls last.
   */
  protected override _prepareDirectoryContext(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  protected override _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<WallTab.EntryContext>;

  /**
   * @remarks Replaces the inherited `openFilter` control with a `filterByCategory` one; walls have no
   * elevation to filter on.
   */
  protected override _prepareSearchContext(
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  protected override _attachFrameListeners(): void;

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean;

  /**
   * Handle adjusting the category filter.
   * @param cat - The wall category to filter by.
   *
   * @remarks Pass `null` to clear the filter entirely and show all categories.
   */
  protected _onFilterByCategory(cat: WallDocument.Category | null): void;

  #WallTab: true;

  static #WallTabStatic: true;
}

declare namespace WallTab {
  interface Any extends AnyWallTab {}
  interface AnyConstructor extends Identity<typeof AnyWallTab> {}

  interface FilterState extends PlaceableTab.FilterState {
    /**
     * The wall categories entries must belong to; empty when unfiltered.
     *
     * @remarks Created on first use rather than in the constructor, so it is absent until the category
     * filter is opened.
     */
    categories?: Set<WallDocument.Category> | undefined;
  }

  interface EntryContext extends PlaceableTab.EntryContext {
    category: WallDocument.Category;
  }

  /** The walls of a single category, rendered as one collapsible group. */
  interface Group {
    category: WallDocument.Category;

    color: Color;

    label: string;

    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    entries?: EntryContext[] | undefined;

    groups?: Group[] | undefined;
  }

  interface Configuration<WallTab extends WallTab.Any = WallTab.Any> extends PlaceableTab.Configuration<WallTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<WallTab extends WallTab.Any = WallTab.Any> = DeepPartial<
    Omit<Configuration<WallTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyWallTab extends WallTab<WallTab.RenderContext, WallTab.Configuration, WallTab.RenderOptions> {
  constructor(...args: never);
}

export default WallTab;
