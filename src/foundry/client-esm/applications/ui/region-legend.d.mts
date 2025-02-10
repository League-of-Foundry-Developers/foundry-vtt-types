import type { AnyObject, DeepPartial, EmptyObject } from "fvtt-types/utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * Scene Region Legend.
 */
export default class RegionLegend<
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends
    HandlebarsApplicationMixin.ApplicationV2RenderOptions = HandlebarsApplicationMixin.ApplicationV2RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  #RegionLegend: true;

  static override DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration> & object;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** The currently viewed elevation range. */
  elevation: { bottom: number; top: number };

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  override close(options?: DeepPartial<ApplicationV2.ClosingOptions>): Promise<this>;

  protected override _onFirstRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Is this Region visible in this RegionLegend?
   * @param region - The Region
   * @internal
   */
  _isRegionVisible(region: RegionDocument.ConfiguredInstance): boolean;

  /**
   * Highlight a hovered region in the legend.
   * @param region  - The Region
   * @param hover   - Whether they are being hovered in or out
   * @internal
   */
  _hoverRegion(region: RegionDocument.ConfiguredInstance, hover: boolean): void;
}
