import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientLightConfig: AmbientLightConfig.Any;
    }
  }
}

/**
 * The AmbientLight configuration application.
 */
declare class AmbientLightConfig<
  RenderContext extends object = AmbientLightConfig.RenderContext,
  Configuration extends AmbientLightConfig.Configuration = AmbientLightConfig.Configuration,
  RenderOptions extends AmbientLightConfig.RenderOptions = AmbientLightConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientLightDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Maintain a copy of the original to show a real-time preview of changes.
   */
  preview: AmbientLightDocument.Implementation | undefined;

  override tabGroups: {
    sheet: string;
  };

  protected override _preRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Preview changes to the AmbientLight document as if they were true document updates.
   * @param change - A change to preview
   */
  protected _previewChanges(change?: foundry.documents.BaseAmbientLight.UpdateData): void;

  /**
   * Restore the true data for the AmbientLight document when the form is submitted or closed.
   */
  protected _resetPreview(): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace AmbientLightConfig {
  interface Any extends AnyAmbientLightConfig {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightConfig> {}

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<AmbientLightDocument.Implementation> {
    document: AmbientLightDocument.Implementation;
    light: AmbientLightDocument.Implementation;
    source: foundry.documents.BaseAmbientLight.Source;

    /**
     * @deprecated Foundry deleted this with no deprecation in v13.
     */
    fields: foundry.documents.BaseAmbientLight.Schema;
    colorationTechniques: typeof AdaptiveLightingShader.SHADER_TECHNIQUES;
    gridUnits: string;
    isDarkness: boolean;
    lightAnimations: unknown; // TODO: Update after CONFIG updated

    /**
     * @deprecated Foundry deleted this with no deprecation in v13.
     */
    tabs: Record<string, ApplicationV2.Tab>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends
      HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<AmbientLightDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAmbientLightConfig extends AmbientLightConfig<
  object,
  AmbientLightConfig.Configuration,
  AmbientLightConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightConfig;
