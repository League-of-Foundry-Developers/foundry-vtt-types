import type { Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type RegionFilter from "../filters/region-filter.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

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
declare class RegionTab extends PlaceableTab<"regions"> {
  constructor(options: PlaceableTab.InputOptions<RegionTab.Configuration>);

  /** @defaultValue `"templates/sidebar/tabs/placeable/region.hbs"` */
  static override ENTRY_PARTIAL: string;

  /**
   * @defaultValue {@linkcode RegionFilter}
   */
  static override FILTER_CLASS: RegionFilter.AnyConstructor;

  /**
   * @remarks Extends {@linkcode PlaceableTab._filterState | #_filterState} with a `behaviorType` field in the
   * constructor.
   */
  _filterState: RegionTab.FilterState;

  protected override _prepareEntry(
    entry: RegionDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<RegionTab.EntryContext>;

  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _clearFilters(): void;

  protected override _hasAdvancedFilters(): boolean;

  protected override _matchesFilter(entry: RegionDocument.Implementation): boolean;

  #RegionTab: true;
}

declare namespace RegionTab {
  interface Any extends AnyRegionTab {}
  interface AnyConstructor extends Identity<typeof AnyRegionTab> {}

  interface Configuration extends PlaceableTab.Configuration<"regions"> {}

  interface FilterState extends PlaceableTab.FilterState {
    behaviorType: string;
  }

  interface EntryElevationContext {
    bottom: string;
    top: string;
    label: string;
  }

  interface EntryContext extends PlaceableTab.EntryContext {
    /** @remarks Added by {@linkcode RegionTab._prepareEntry | #_prepareEntry} */
    color: Color;

    /** @remarks Added by {@linkcode RegionTab._prepareEntry | #_prepareEntry} */
    elevation: EntryElevationContext;

    /** @remarks Added by {@linkcode RegionTab._prepareEntry | #_prepareEntry} */
    empty: boolean;

    /**
     * @remarks Added by {@linkcode RegionTab._prepareEntry | #_prepareEntry}, only for a GM user.
     */
    isVisible?: boolean | undefined;
  }

  interface RenderContext extends PlaceableTab.RenderContext {}
}

declare abstract class AnyRegionTab extends RegionTab {
  constructor(...args: never);
}

export default RegionTab;
