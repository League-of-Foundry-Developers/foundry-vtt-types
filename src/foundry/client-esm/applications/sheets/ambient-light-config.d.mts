import type { InterfaceToObject, AnyObject, DeepPartial } from "fvtt-types/utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * The AmbientLight configuration application.
 */
declare class AmbientLightConfig<
  RenderContext extends AnyObject = InterfaceToObject<AmbientLightConfig.RenderContext>,
  Configuration extends
    DocumentSheetV2.Configuration<AmbientLightDocument.ConfiguredInstance> = DocumentSheetV2.Configuration<AmbientLightDocument.ConfiguredInstance>,
  RenderOptions extends
    HandlebarsApplicationMixin.DocumentSheetV2RenderOptions = HandlebarsApplicationMixin.DocumentSheetV2RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientLightDocument.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DeepPartial<DocumentSheetV2.Configuration<AmbientLightDocument.ConfiguredInstance>>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Maintain a copy of the original to show a real-time preview of changes.
   */
  preview: AmbientLightDocument.ConfiguredInstance | undefined;

  override tabGroups: {
    sheet: string;
  };

  protected override _preRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
  interface RenderContext {
    light: AmbientLightDocument.ConfiguredInstance;
    source: foundry.documents.BaseAmbientLight.Source;
    fields: foundry.documents.BaseAmbientLight.Schema;
    colorationTechniques: (typeof AdaptiveLightingShader)["SHADER_TECHNIQUES"];
    gridUnits: string;
    isDarkness: boolean;
    lightAnimations: unknown; // TODO: Update after CONFIG updated
    tabs: Record<string, ApplicationV2.Tab>;
    buttons: ApplicationV2.FormFooterButton[];
  }
}

export default AmbientLightConfig;
