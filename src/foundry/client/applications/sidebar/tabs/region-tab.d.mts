import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";
import type RegionFilter from "../filters/region-filter.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionTab: RegionTab.Any;
    }
  }
}

/**
 * The Region-specific placeables tab.
 */
declare class RegionTab<
  RenderContext extends RegionTab.RenderContext = RegionTab.RenderContext,
  Configuration extends RegionTab.Configuration = RegionTab.Configuration,
  RenderOptions extends RegionTab.RenderOptions = RegionTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/region.hbs"`
   */
  static override ENTRY_PARTIAL: string;

  /**
   * @defaultValue {@linkcode RegionFilter}
   */
  static override FILTER_CLASS: RegionFilter.AnyConstructor;

  // Fake override.
  override _filterState: RegionTab.FilterState;

  protected override _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<RegionTab.EntryContext>;

  /**
   * @remarks Adds an "Configure Ownership" entry directly after the inherited "Edit" entry.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  override _clearFilters(): void;

  protected override _hasAdvancedFilters(): boolean;

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean;

  #RegionTab: true;
}

declare namespace RegionTab {
  interface Any extends AnyRegionTab {}
  interface AnyConstructor extends Identity<typeof AnyRegionTab> {}

  interface FilterState extends PlaceableTab.FilterState {
    /**
     * The RegionBehavior type entries must contain; the empty string is unfiltered.
     *
     * @defaultValue `""`
     */
    behaviorType: Exclude<RegionBehavior.SubType, typeof CONST.BASE_DOCUMENT_TYPE> | "";
  }

  /**
   * The region's elevation range, formatted for display.
   *
   * @remarks The bounds are localized strings rather than numbers, using `"−∞"` / `"+∞"` where unbounded.
   */
  interface ElevationContext {
    bottom: string;

    top: string;

    topInclusive: boolean;

    /**
     * The interval notation covering both bounds.
     *
     * @remarks The empty string when the region's elevation is unbounded in both directions.
     */
    label: string;
  }

  interface EntryContext extends PlaceableTab.EntryContext {
    /**
     * Whether the region is shown to non-GM users.
     *
     * @remarks Only prepared for GM users.
     */
    isVisible?: boolean | undefined;

    color: Color;

    elevation: ElevationContext;

    /** Whether the region has no shapes. */
    empty: boolean;
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    entries?: EntryContext[] | undefined;
  }

  interface Configuration<
    RegionTab extends RegionTab.Any = RegionTab.Any,
  > extends PlaceableTab.Configuration<RegionTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<RegionTab extends RegionTab.Any = RegionTab.Any> = DeepPartial<
    Omit<Configuration<RegionTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyRegionTab extends RegionTab<
  RegionTab.RenderContext,
  RegionTab.Configuration,
  RegionTab.RenderOptions
> {
  constructor(...args: never);
}

export default RegionTab;
