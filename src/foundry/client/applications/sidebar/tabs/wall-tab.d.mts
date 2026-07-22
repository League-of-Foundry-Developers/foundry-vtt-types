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
declare class WallTab extends PlaceableTab<"walls"> {
  constructor(options: PlaceableTab.InputOptions<WallTab.Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   actions: {
   *     selectGroup: WallTab.#onSelectGroup
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: WallTab.DefaultOptions;

  /** @defaultValue `"templates/sidebar/tabs/placeable/walls.hbs"` */
  static override DIRECTORY_PARTIAL: string;

  /**
   * @remarks Extends {@linkcode PlaceableTab._filterState | #_filterState} with a `categories` field, lazily added
   * by {@linkcode WallTab._onFilterByCategory | #_onFilterByCategory} on first use (not in the constructor, unlike
   * the other subclasses that extend `_filterState`).
   */
  _filterState: WallTab.FilterState;

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

  /**
   * Handle adjusting the category filter.
   * @param cat - The wall category to filter by.
   */
  protected _onFilterByCategory(cat: WallDocument.Category | null): void;

  #WallTab: true;
}

declare namespace WallTab {
  interface Any extends AnyWallTab {}
  interface AnyConstructor extends Identity<typeof AnyWallTab> {}

  interface Configuration extends PlaceableTab.Configuration<"walls"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface FilterState extends PlaceableTab.FilterState {
    categories?: Set<WallDocument.Category> | undefined;
  }

  interface EntryContext extends PlaceableTab.EntryContext {
    /** @remarks Added by {@linkcode WallTab._prepareEntry | #_prepareEntry} */
    category: WallDocument.Category;
  }

  interface GroupContext {
    category: WallDocument.Category;
    color: Color;
    label: string;
    entries: EntryContext[];
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    /** @remarks Added by {@linkcode WallTab._prepareDirectoryContext | #_prepareDirectoryContext} */
    groups?: GroupContext[] | undefined;
  }
}

declare abstract class AnyWallTab extends WallTab {
  constructor(...args: never);
}

export default WallTab;
