import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";
import type TileTab from "../tabs/tile-tab.d.mts";
import type { BooleanField, NumberField, SetField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileFilter: TileFilter.Any;
    }
  }
}

/**
 * An advanced filter dialog for the Tiles placeable tab.
 */
declare class TileFilter<
  RenderContext extends TileFilter.RenderContext = TileFilter.RenderContext,
  Configuration extends TileFilter.Configuration = TileFilter.Configuration,
  RenderOptions extends TileFilter.RenderOptions = TileFilter.RenderOptions,
> extends PlaceableFilter<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "tile-filter"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: TileFilter.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {
   *     root: true,
   *     classes: ["standard-form"],
   *     template: "templates/sidebar/filters/tile.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  // Fake override.
  override get tab(): TileTab.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #TileFilter: true;
}

declare namespace TileFilter {
  interface Any extends AnyTileFilter {}
  interface AnyConstructor extends Identity<typeof AnyTileFilter> {}

  /** The occlusion-mode field, whose choices include `NONE` so unoccluded tiles can be filtered for. */
  type OcclusionField = SetField<NumberField>;

  interface RestrictionsContext {
    light: PlaceableFilter.FilterField<BooleanField, boolean>;

    weather: PlaceableFilter.FilterField<BooleanField, boolean>;
  }

  interface RenderContext extends PlaceableFilter.RenderContext {
    occlusion: PlaceableFilter.FilterField<OcclusionField, Set<CONST.OCCLUSION_MODES>>;

    restrictions: RestrictionsContext;
  }

  interface Configuration<
    TileFilter extends TileFilter.Any = TileFilter.Any,
  > extends PlaceableFilter.Configuration<TileFilter> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<TileFilter extends TileFilter.Any = TileFilter.Any> = DeepPartial<Configuration<TileFilter>> &
    object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}
}

declare abstract class AnyTileFilter extends TileFilter<
  TileFilter.RenderContext,
  TileFilter.Configuration,
  TileFilter.RenderOptions
> {
  constructor(...args: never);
}

export default TileFilter;
