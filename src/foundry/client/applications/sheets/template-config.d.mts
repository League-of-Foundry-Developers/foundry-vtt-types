import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MeasuredTemplateConfig: MeasuredTemplateConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
 */
declare class MeasuredTemplateConfig<
  RenderContext extends MeasuredTemplateConfig.RenderContext = MeasuredTemplateConfig.RenderContext,
  Configuration extends MeasuredTemplateConfig.Configuration = MeasuredTemplateConfig.Configuration,
  RenderOptions extends MeasuredTemplateConfig.RenderOptions = MeasuredTemplateConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  MeasuredTemplateDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @deprecated since v14, until v16
   * @remarks "MeasuredTemplateConfig is deprecated because the MeasuredTemplate document has been merged into the
   * functionality of the Region document."
   */
  constructor(options: DocumentSheetV2.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
}

declare namespace MeasuredTemplateConfig {
  interface Any extends AnyMeasuredTemplateConfig {}
  interface AnyConstructor extends Identity<typeof AnyMeasuredTemplateConfig> {}

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<MeasuredTemplateDocument.Implementation> {
    templateTypes: TemplateTypes;

    units: Units;

    /** @remarks The current User's color. */
    userColor: Color;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface TemplateTypes {
    circle: string;

    cone: string;

    rect: string;

    ray: string;
  }

  interface Units {
    degrees: string;

    /**
     * @remarks The parent Scene's grid units, falling back to the localization of `"MEASUREMENT.GridUnits"`.
     */
    gridUnits: string;

    pixels: string;
  }

  interface Configuration
    extends
      HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<MeasuredTemplateDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyMeasuredTemplateConfig extends MeasuredTemplateConfig<
  MeasuredTemplateConfig.RenderContext,
  MeasuredTemplateConfig.Configuration,
  MeasuredTemplateConfig.RenderOptions
> {
  constructor(...args: never);
}

export default MeasuredTemplateConfig;
