import type { Identity } from "#utils";
import type TileFilter from "../filters/tile-filter.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileTab: TileTab.Any;
    }
  }
}

/**
 * The Tile-specific placeables tab.
 */
declare class TileTab extends PlaceableTab<"tiles"> {
  constructor(options: PlaceableTab.InputOptions<TileTab.Configuration>);

  /**
   * @defaultValue {@linkcode TileFilter}
   */
  static override FILTER_CLASS: TileFilter.AnyConstructor;

  /**
   * @remarks Extends {@linkcode PlaceableTab._filterState | #_filterState} with `occlusionModes` and `restrictions`
   * fields in the constructor.
   */
  _filterState: TileTab.FilterState;

  protected override _getEntryLabel(entry: TileDocument.Implementation): string;

  protected override _clearFilters(): void;

  protected override _matchesFilter(entry: TileDocument.Implementation): boolean;

  protected override _hasAdvancedFilters(): boolean;

  #TileTab: true;
}

declare namespace TileTab {
  interface Any extends AnyTileTab {}
  interface AnyConstructor extends Identity<typeof AnyTileTab> {}

  interface Configuration extends PlaceableTab.Configuration<"tiles"> {}

  interface FilterStateRestrictions {
    light: boolean;
    weather: boolean;
  }

  interface FilterState extends PlaceableTab.FilterState {
    occlusionModes: Set<CONST.OCCLUSION_MODES>;
    restrictions: FilterStateRestrictions;
  }
}

declare abstract class AnyTileTab extends TileTab {
  constructor(...args: never);
}

export default TileTab;
