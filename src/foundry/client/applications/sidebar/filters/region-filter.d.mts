import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableFilter from "./placeable-filter.d.mts";
import type RegionTab from "../tabs/region-tab.d.mts";
import type { StringField } from "#common/data/fields.d.mts";

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
declare class RegionFilter<
  RenderContext extends RegionFilter.RenderContext = RegionFilter.RenderContext,
  Configuration extends RegionFilter.Configuration = RegionFilter.Configuration,
  RenderOptions extends RegionFilter.RenderOptions = RegionFilter.RenderOptions,
> extends PlaceableFilter<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: RegionFilter.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  // Fake override.
  override get tab(): RegionTab.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  #RegionFilter: true;
}

declare namespace RegionFilter {
  interface Any extends AnyRegionFilter {}
  interface AnyConstructor extends Identity<typeof AnyRegionFilter> {}

  interface RenderContext extends PlaceableFilter.RenderContext {
    /**
     * @remarks The choices exclude {@linkcode CONST.BASE_DOCUMENT_TYPE}; the empty string is unfiltered.
     */
    behaviorType: PlaceableFilter.FilterField<StringField, string>;
  }

  interface Configuration<
    RegionFilter extends RegionFilter.Any = RegionFilter.Any,
  > extends PlaceableFilter.Configuration<RegionFilter> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<RegionFilter extends RegionFilter.Any = RegionFilter.Any> = DeepPartial<
    Configuration<RegionFilter>
  > &
    object;

  interface RenderOptions extends PlaceableFilter.RenderOptions {}
}

declare abstract class AnyRegionFilter extends RegionFilter<
  RegionFilter.RenderContext,
  RegionFilter.Configuration,
  RegionFilter.RenderOptions
> {
  constructor(...args: never);
}

export default RegionFilter;
