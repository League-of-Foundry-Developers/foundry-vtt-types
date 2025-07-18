import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionLegend: RegionLegend.Any;
    }
  }
}

/**
 * Scene Region Legend.
 */
declare class RegionLegend<
  RenderContext extends RegionLegend.RenderContext = RegionLegend.RenderContext,
  Configuration extends RegionLegend.Configuration = RegionLegend.Configuration,
  RenderOptions extends RegionLegend.RenderOptions = RegionLegend.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  #RegionLegend: true;
  static #RegionLegendStatic: true;

  static override DEFAULT_OPTIONS: RegionLegend.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** The currently viewed elevation range. */
  elevation: { bottom: number; top: number };

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  override close(options?: DeepPartial<ApplicationV2.ClosingOptions>): Promise<this>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Is this Region visible in this RegionLegend?
   * @param region - The Region
   * @internal
   */
  _isRegionVisible(region: RegionDocument.Implementation): boolean;

  /**
   * Highlight a hovered region in the legend.
   * @param region  - The Region
   * @param hover   - Whether they are being hovered in or out
   * @internal
   */
  _hoverRegion(region: RegionDocument.Implementation, hover: boolean): void;
}

declare namespace RegionLegend {
  interface Any extends AnyRegionLegend {}
  interface AnyConstructor extends Identity<typeof AnyRegionLegend> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    regions: RegionDocument.Implementation[];
    elevation: Elevation;
  }

  interface Elevation {
    bottom: number | string;
    top: number | string;
  }

  interface Configuration<RegionLegend extends RegionLegend.Any = RegionLegend.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<RegionLegend> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<RegionLegend extends RegionLegend.Any = RegionLegend.Any> = DeepPartial<
    Configuration<RegionLegend>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyRegionLegend extends RegionLegend<
  RegionLegend.RenderContext,
  RegionLegend.Configuration,
  RegionLegend.RenderOptions
> {
  constructor(...args: never);
}

export default RegionLegend;
