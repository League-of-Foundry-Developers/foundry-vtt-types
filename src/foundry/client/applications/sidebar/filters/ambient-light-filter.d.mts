import type { DeepPartial, Identity } from "#utils";
import type { BooleanField, StringField } from "#common/data/fields.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientLightFilter: AmbientLightFilter.Any;
    }
  }
}

/**
 * An advanced filter dialog for the AmbientLight placeable tab.
 */
declare class AmbientLightFilter extends PlaceableFilter {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "ambient-light-filter"
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: AmbientLightFilter.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: {
   *     root: true,
   *     classes: ["standard-form"],
   *     template: "templates/sidebar/filters/ambient-light.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<AmbientLightFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<AmbientLightFilter.RenderContext>;

  protected override _attachFrameListeners(): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #AmbientLightFilter: true;
}

declare namespace AmbientLightFilter {
  interface Any extends AnyAmbientLightFilter {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightFilter> {}

  interface Configuration extends PlaceableFilter.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}

  interface RenderContext extends PlaceableFilter.RenderContext {
    animationType: {
      field: StringField;
      value: string;
    };

    color: {
      /** A CSS color string, e.g. `light.config.color.css`. */
      value: string | null;
    };

    negative: {
      field: BooleanField;
      value: boolean;
    };

    walls: {
      field: BooleanField;
      value: boolean;
    };

    vision: {
      field: BooleanField;
      value: boolean;
    };
  }
}

declare abstract class AnyAmbientLightFilter extends AmbientLightFilter {
  constructor(...args: never);
}

export default AmbientLightFilter;
