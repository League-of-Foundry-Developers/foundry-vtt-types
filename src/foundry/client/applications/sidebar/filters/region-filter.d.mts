import type { DeepPartial, Identity } from "#utils";
import type { StringField } from "#common/data/fields.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionFilter: RegionFilter.Any;
    }
  }
}

/**
 * An advanced filter dialog for the Regions placeable tab.
 */
declare class RegionFilter extends PlaceableFilter {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "region-filter"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: RegionFilter.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {
   *     root: true,
   *     classes: ["standard-form"],
   *     template: "templates/sidebar/filters/region.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RegionFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<RegionFilter.RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #RegionFilter: true;
}

declare namespace RegionFilter {
  interface Any extends AnyRegionFilter {}
  interface AnyConstructor extends Identity<typeof AnyRegionFilter> {}

  interface Configuration extends PlaceableFilter.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}

  interface RenderContext extends PlaceableFilter.RenderContext {
    behaviorType: {
      field: StringField;
      /** @remarks Initialized and reset to `""`, never `undefined` */
      value: string;
    };
  }
}

declare abstract class AnyRegionFilter extends RegionFilter {
  constructor(...args: never);
}

export default RegionFilter;
