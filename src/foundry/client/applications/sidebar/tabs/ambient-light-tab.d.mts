import type { DeepPartial, Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";
import type AmbientLightFilter from "../filters/ambient-light-filter.d.mts";

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
declare class AmbientLightTab<
  RenderContext extends AmbientLightTab.RenderContext = AmbientLightTab.RenderContext,
  Configuration extends AmbientLightTab.Configuration = AmbientLightTab.Configuration,
  RenderOptions extends AmbientLightTab.RenderOptions = AmbientLightTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue {@linkcode AmbientLightFilter}
   */
  static override FILTER_CLASS: AmbientLightFilter.AnyConstructor;

  // Fake override.
  override _filterState: AmbientLightTab.FilterState;

  /**
   * @remarks Also re-initializes every light source, so that filtered-out lights stop being drawn.
   */
  override _applyFilters(): void;

  override _clearFilters(): void;

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean;

  protected override _hasAdvancedFilters(): boolean;

  #AmbientLightTab: true;
}

declare namespace AmbientLightTab {
  interface Any extends AnyAmbientLightTab {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightTab> {}

  interface FilterState extends PlaceableTab.FilterState {
    /**
     * The animation type entries must use, `"none"` for unanimated lights, or `null` when unfiltered.
     *
     * @defaultValue `null`
     */
    animationType: foundry.canvas.sources.RenderedEffectSource.ConfiguredLightAnimations | "none" | null;

    /**
     * The CSS representation of the color entries must use, or `null` when unfiltered.
     *
     * @defaultValue `null`
     */
    color: string | null;

    /** @defaultValue `false` */
    negative: boolean;

    /** @defaultValue `false` */
    walls: boolean;

    /** @defaultValue `false` */
    vision: boolean;
  }

  interface RenderContext extends PlaceableTab.RenderContext {}

  interface Configuration<
    AmbientLightTab extends AmbientLightTab.Any = AmbientLightTab.Any,
  > extends PlaceableTab.Configuration<AmbientLightTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AmbientLightTab extends AmbientLightTab.Any = AmbientLightTab.Any> = DeepPartial<
    Omit<Configuration<AmbientLightTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyAmbientLightTab extends AmbientLightTab<
  AmbientLightTab.RenderContext,
  AmbientLightTab.Configuration,
  AmbientLightTab.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightTab;
