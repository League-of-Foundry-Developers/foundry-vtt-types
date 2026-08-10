import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableTab from "../tabs/placeable-tab.d.mts";
import type { NumberField } from "#common/data/fields.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaceableFilter: PlaceableFilter.Any;
    }
  }
}

/**
 * A dialog application for configuring advanced placeable filters.
 */
declare class PlaceableFilter<
  RenderContext extends PlaceableFilter.RenderContext = PlaceableFilter.RenderContext,
  Configuration extends PlaceableFilter.Configuration = PlaceableFilter.Configuration,
  RenderOptions extends PlaceableFilter.RenderOptions = PlaceableFilter.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * @param tab     - The tab this dialog belongs to.
   * @param options - Application options. (default: `{}`)
   */
  constructor(tab: PlaceableTab.Any, options?: DeepPartial<Configuration>);

  static override DEFAULT_OPTIONS: PlaceableFilter.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The tab this dialog belongs to.
   */
  get tab(): PlaceableTab.Any;

  protected override _canDetach(): boolean;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _attachFrameListeners(): void;

  #PlaceableFilter: true;
}

declare namespace PlaceableFilter {
  interface Any extends AnyPlaceableFilter {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableFilter> {}

  /**
   * A single filter control, pairing the {@linkcode foundry.data.fields.DataField | DataField} used to render
   * its input with the value currently held in the tab's filter state.
   */
  interface FilterField<Field, Value> {
    field: Field;

    value: Value;
  }

  interface ElevationContext {
    /** @remarks `null` when the filter is unbounded below, i.e. the state holds `-Infinity`. */
    bottom: FilterField<NumberField, number | null>;

    /** @remarks `null` when the filter is unbounded above, i.e. the state holds `Infinity`. */
    top: FilterField<NumberField, number | null>;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    elevation: ElevationContext;
  }

  interface Configuration<PlaceableFilter extends PlaceableFilter.Any = PlaceableFilter.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<PlaceableFilter> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<PlaceableFilter extends PlaceableFilter.Any = PlaceableFilter.Any> = DeepPartial<
    Configuration<PlaceableFilter>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyPlaceableFilter extends PlaceableFilter<
  PlaceableFilter.RenderContext,
  PlaceableFilter.Configuration,
  PlaceableFilter.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableFilter;
