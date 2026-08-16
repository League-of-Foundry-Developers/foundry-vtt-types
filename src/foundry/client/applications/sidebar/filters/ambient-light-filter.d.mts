import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";
import type AmbientLightTab from "../tabs/ambient-light-tab.d.mts";
import type { BooleanField, StringField } from "#common/data/fields.d.mts";

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
declare class AmbientLightFilter<
  RenderContext extends AmbientLightFilter.RenderContext = AmbientLightFilter.RenderContext,
  Configuration extends AmbientLightFilter.Configuration = AmbientLightFilter.Configuration,
  RenderOptions extends AmbientLightFilter.RenderOptions = AmbientLightFilter.RenderOptions,
> extends PlaceableFilter<RenderContext, Configuration, RenderOptions> {
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

  // Fake override.
  override get tab(): AmbientLightTab.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _attachFrameListeners(): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #AmbientLightFilter: true;
}

declare namespace AmbientLightFilter {
  interface Any extends AnyAmbientLightFilter {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightFilter> {}

  interface RenderContext extends PlaceableFilter.RenderContext {
    /** @remarks The empty string selects any animation type; `"none"` selects lights with no animation. */
    animationType: PlaceableFilter.FilterField<StringField, string>;

    /** @remarks The CSS representation of the filtered color, or `null` when unfiltered. */
    color: { value: string | null };

    negative: PlaceableFilter.FilterField<BooleanField, boolean>;

    walls: PlaceableFilter.FilterField<BooleanField, boolean>;

    vision: PlaceableFilter.FilterField<BooleanField, boolean>;
  }

  interface Configuration<
    AmbientLightFilter extends AmbientLightFilter.Any = AmbientLightFilter.Any,
  > extends PlaceableFilter.Configuration<AmbientLightFilter> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AmbientLightFilter extends AmbientLightFilter.Any = AmbientLightFilter.Any> = DeepPartial<
    Configuration<AmbientLightFilter>
  > &
    object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}
}

declare abstract class AnyAmbientLightFilter extends AmbientLightFilter<
  AmbientLightFilter.RenderContext,
  AmbientLightFilter.Configuration,
  AmbientLightFilter.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightFilter;
