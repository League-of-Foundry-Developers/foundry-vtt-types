import type { DeepPartial, Identity } from "#utils";
import type { FormFooterButton, FormNode } from "../_types.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionBehaviorConfig: RegionBehaviorConfig.Any;
    }
  }
}

/**
 * The Scene Region configuration application.
 */
declare class RegionBehaviorConfig<
  RenderContext extends object = RegionBehaviorConfig.RenderContext,
  Configuration extends RegionBehaviorConfig.Configuration = RegionBehaviorConfig.Configuration,
  RenderOptions extends RegionBehaviorConfig.RenderOptions = RegionBehaviorConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionBehavior.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  constructor(options: DocumentSheetV2.InputOptions<Configuration>);

  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /** Prepare form field structure for rendering. */
  protected _getFields(): FormNode[];

  /** Get footer buttons for this behavior config sheet. */
  _getButtons(): FormFooterButton[];

  #regionBehaviorConfig: true;
}

declare namespace RegionBehaviorConfig {
  interface Any extends AnyRegionBehaviorConfig {}
  interface AnyConstructor extends Identity<typeof AnyRegionBehaviorConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<RegionBehavior.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<RegionBehavior.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRegionBehaviorConfig extends RegionBehaviorConfig<
  object,
  RegionBehaviorConfig.Configuration,
  RegionBehaviorConfig.RenderOptions
> {
  constructor(...args: never);
}

export default RegionBehaviorConfig;
