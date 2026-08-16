import type { DeepPartial, Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";
import type TileFilter from "../filters/tile-filter.d.mts";

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
declare class TileTab<
  RenderContext extends TileTab.RenderContext = TileTab.RenderContext,
  Configuration extends TileTab.Configuration = TileTab.Configuration,
  RenderOptions extends TileTab.RenderOptions = TileTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue {@linkcode TileFilter}
   */
  static override FILTER_CLASS: TileFilter.AnyConstructor;

  // Fake override.
  override _filterState: TileTab.FilterState;

  /**
   * @remarks Falls back to the texture's default sound name before the tile's ID.
   */
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string;

  override _clearFilters(): void;

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean;

  protected override _hasAdvancedFilters(): boolean;

  #TileTab: true;
}

declare namespace TileTab {
  interface Any extends AnyTileTab {}
  interface AnyConstructor extends Identity<typeof AnyTileTab> {}

  interface Restrictions {
    /** @defaultValue `false` */
    light: boolean;

    /** @defaultValue `false` */
    weather: boolean;
  }

  interface FilterState extends PlaceableTab.FilterState {
    /**
     * The occlusion modes entries must use; empty when unfiltered.
     *
     * @remarks {@linkcode CONST.OCCLUSION_MODES.NONE} matches tiles with no occlusion modes at all.
     * @defaultValue `new Set()`
     */
    occlusionModes: Set<CONST.OCCLUSION_MODES>;

    restrictions: Restrictions;
  }

  interface RenderContext extends PlaceableTab.RenderContext {}

  interface Configuration<TileTab extends TileTab.Any = TileTab.Any> extends PlaceableTab.Configuration<TileTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<TileTab extends TileTab.Any = TileTab.Any> = DeepPartial<
    Omit<Configuration<TileTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyTileTab extends TileTab<TileTab.RenderContext, TileTab.Configuration, TileTab.RenderOptions> {
  constructor(...args: never);
}

export default TileTab;
