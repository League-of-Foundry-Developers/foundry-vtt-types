import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

// This entire file concerns a single deprecated class; every reference to `MeasuredTemplateConfig` below is
// necessarily a self-reference (generic defaults, the `Any`/namespace boilerplate, etc.), not an
// external caller using deprecated API.
/* eslint-disable @typescript-eslint/no-deprecated */

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MeasuredTemplateConfig: MeasuredTemplateConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
 * @deprecated "MeasuredTemplateConfig is deprecated because the MeasuredTemplate document has been merged into the
 * functionality of the Region document." (since v14, until v16)
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
   * @defaultValue
   * ```js
   * {
   *   classes: ["template-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-ruler-combined",
   *     resizable: true
   *   },
   *   position: { width: 480 },
   *   form: { closeOnSubmit: true }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;
}

declare namespace MeasuredTemplateConfig {
  interface Any extends AnyMeasuredTemplateConfig {}
  interface AnyConstructor extends Identity<typeof AnyMeasuredTemplateConfig> {}

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<MeasuredTemplateDocument.Implementation> {
    templateTypes: Record<"circle" | "cone" | "rect" | "ray", string>;
    units: {
      degrees: string;
      gridUnits: string;
      pixels: string;
    };
    userColor: Color;
    buttons: ApplicationV2.FormFooterButton[];
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
