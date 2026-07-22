import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientSoundConfig: AmbientSoundConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single AmbientSound document within a parent Scene.
 */
declare class AmbientSoundConfig<
  RenderContext extends AmbientSoundConfig.RenderContext = AmbientSoundConfig.RenderContext,
  Configuration extends AmbientSoundConfig.Configuration = AmbientSoundConfig.Configuration,
  RenderOptions extends AmbientSoundConfig.RenderOptions = AmbientSoundConfig.RenderOptions,
> extends PlaceableConfig<AmbientSoundDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["ambient-sound-config"],
   *   window: {
   *     contentClasses: ["standard-form"]
   *   },
   *   position: { width: 560 },
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   canCreate: true
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<AmbientSoundDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Special logic to toggle the disabled state of form fields depending on the values of other fields.
   */
  protected _toggleDisabledFields(): void;

  protected override _previewChanges(changes: foundry.documents.BaseAmbientSound.UpdateData): void;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace AmbientSoundConfig {
  interface Any extends AnyAmbientSoundConfig {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<AmbientSoundDocument.Implementation> {
    soundEffects: typeof CONFIG.soundEffects;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<AmbientSoundDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyAmbientSoundConfig extends AmbientSoundConfig<
  AmbientSoundConfig.RenderContext,
  AmbientSoundConfig.Configuration,
  AmbientSoundConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientSoundConfig;
