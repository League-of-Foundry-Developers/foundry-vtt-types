import type { Identity } from "#utils";
import type AmbientLightFilter from "../filters/ambient-light-filter.d.mts";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientLightTab: AmbientLightTab.Any;
    }
  }
}

/**
 * The AmbientLight-specific placeables tab.
 */
declare class AmbientLightTab extends PlaceableTab<"lights"> {
  constructor(options: PlaceableTab.InputOptions<AmbientLightTab.Configuration>);

  /**
   * @defaultValue {@linkcode AmbientLightFilter}
   */
  static override FILTER_CLASS: AmbientLightFilter.AnyConstructor;

  /**
   * @remarks Extends {@linkcode PlaceableTab._filterState | #_filterState} with `animationType`, `color`, `negative`,
   * `walls`, and `vision` fields in the constructor.
   */
  _filterState: AmbientLightTab.FilterState;

  protected override _applyFilters(): void;

  protected override _clearFilters(): void;

  protected override _matchesFilter(entry: AmbientLightDocument.Implementation): boolean;

  protected override _hasAdvancedFilters(): boolean;

  #AmbientLightTab: true;
}

declare namespace AmbientLightTab {
  interface Any extends AnyAmbientLightTab {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightTab> {}

  interface Configuration extends PlaceableTab.Configuration<"lights"> {}

  interface FilterState extends PlaceableTab.FilterState {
    animationType: string | null;
    color: string | null;
    negative: boolean;
    walls: boolean;
    vision: boolean;
  }
}

declare abstract class AnyAmbientLightTab extends AmbientLightTab {
  constructor(...args: never);
}

export default AmbientLightTab;
