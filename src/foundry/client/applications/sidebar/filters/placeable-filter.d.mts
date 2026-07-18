import type { DeepPartial, Identity } from "#utils";
import type { NumberField } from "#common/data/fields.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type PlaceableTab from "../tabs/placeable-tab.d.mts";

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
declare class PlaceableFilter extends HandlebarsApplicationMixin(ApplicationV2) {
  /**
   * @param tab     - The tab this dialog belongs to.
   * @param options - Application options.
   *                  (default: `{}`)
   */
  constructor(tab: PlaceableTab.Any, options?: DeepPartial<PlaceableFilter.Configuration>);

  /**
   * @defaultValue
   * ```js
   * {
   *   tag: "form",
   *   classes: ["placeable-filter", "standard-form"],
   *   window: {
   *     title: "SIDEBAR.PLACEABLES.Filter.Title",
   *     icon: "fa-solid fa-filter",
   *     minimizable: false,
   *     resizable: false
   *   },
   *   position: {
   *     scale: .8,
   *     width: 375
   *   },
   *   actions: {
   *     clear: PlaceableFilter.#onClear
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableFilter.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The tab this dialog belongs to.
   */
  get tab(): PlaceableTab.Any;

  protected override _canDetach(): false;

  protected override _prepareContext(
    options: DeepPartial<PlaceableFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PlaceableFilter.RenderContext>;

  protected override _attachFrameListeners(): void;

  #PlaceableFilter: true;
}

declare namespace PlaceableFilter {
  interface Any extends AnyPlaceableFilter {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableFilter> {}

  interface Configuration extends ApplicationV2.Configuration {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> & object;

  interface RenderOptions extends ApplicationV2.RenderOptions, HandlebarsApplicationMixin.RenderOptions {}

  interface ElevationFieldContext {
    field: NumberField;
    value: number | null;
  }

  interface RenderContext extends ApplicationV2.RenderContext {
    elevation: {
      bottom: ElevationFieldContext;
      top: ElevationFieldContext;
    };
  }
}

declare abstract class AnyPlaceableFilter extends PlaceableFilter {
  constructor(...args: never);
}

export default PlaceableFilter;
