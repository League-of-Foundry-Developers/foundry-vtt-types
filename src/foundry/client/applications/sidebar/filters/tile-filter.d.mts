import type { DeepPartial, Identity } from "#utils";
import type { BooleanField, NumberField, SetField } from "#common/data/fields.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";

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
declare class TileFilter extends PlaceableFilter {
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

  protected override _prepareContext(
    options: DeepPartial<TileFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<TileFilter.RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #TileFilter: true;
}

declare namespace TileFilter {
  interface Any extends AnyTileFilter {}
  interface AnyConstructor extends Identity<typeof AnyTileFilter> {}

  interface Configuration extends PlaceableFilter.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}

  interface RenderContext extends PlaceableFilter.RenderContext {
    occlusion: {
      field: SetField<NumberField>;
      value: Set<number>;
    };

    restrictions: {
      light: {
        field: BooleanField;
        value: boolean;
      };
      weather: {
        field: BooleanField;
        value: boolean;
      };
    };
  }
}

declare abstract class AnyTileFilter extends TileFilter {
  constructor(...args: never);
}

export default TileFilter;
