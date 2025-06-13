import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientSoundConfig: AmbientSoundConfig.Any;
    }
  }
}

/**
 * The AmbientSound configuration application.
 */
declare class AmbientSoundConfig<
  RenderContext extends object = AmbientSoundConfig.RenderContext,
  Configuration extends AmbientSoundConfig.Configuration = AmbientSoundConfig.Configuration,
  RenderOptions extends AmbientSoundConfig.RenderOptions = AmbientSoundConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  AmbientSoundDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace AmbientSoundConfig {
  interface Any extends AnyAmbientSoundConfig {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<AmbientSoundDocument.Implementation> {
    sound: AmbientSoundDocument.Implementation;
    source: foundry.documents.BaseAmbientSound.Source;
    fields: foundry.documents.BaseAmbientSound.Schema;
    gridUnits: string;
    soundEffects: unknown; // TODO: Update after CONFIG updated
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<AmbientSoundDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyAmbientSoundConfig extends AmbientSoundConfig<
  object,
  AmbientSoundConfig.Configuration,
  AmbientSoundConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientSoundConfig;
