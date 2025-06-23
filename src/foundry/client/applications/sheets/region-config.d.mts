import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RegionConfig: RegionConfig.Any;
    }
  }
}

/**
 * The Scene Region configuration application.
 */
declare class RegionConfig<
  RenderContext extends object = RegionConfig.RenderContext,
  Configuration extends RegionConfig.Configuration = RegionConfig.Configuration,
  RenderOptions extends RegionConfig.RenderOptions = RegionConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RegionDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override tabGroups: {
    /** @defaultValue `"identity"` */
    sheet: string;
  };

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  #regionConfig: true;
}

declare namespace RegionConfig {
  interface Any extends AnyRegionConfig {}
  interface AnyConstructor extends Identity<typeof AnyRegionConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<RegionDocument.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<RegionDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRegionConfig extends RegionConfig<
  object,
  RegionConfig.Configuration,
  RegionConfig.RenderOptions
> {
  constructor(...args: never);
}

export default RegionConfig;
