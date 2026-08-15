import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { FormSelectOption } from "../../forms/fields.d.mts";

import AVMaster = foundry.av.AVMaster;
import AVSettings = foundry.av.AVSettings;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AVConfig: AVConfig.Any;
    }
  }
}

/**
 * Audio/Video Conferencing Configuration Sheet
 */
declare class AVConfig<
  RenderContext extends AVConfig.RenderContext = AVConfig.RenderContext,
  Configuration extends AVConfig.Configuration = AVConfig.Configuration,
  RenderOptions extends AVConfig.RenderOptions = AVConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  /**
   * The AVMaster instance being configured
   */
  webrtc: AVMaster;

  static override DEFAULT_OPTIONS: AVConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @remarks The server part is dropped entirely for a non-GM user.
   */
  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<RenderOptions>,
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  #AVConfig: true;

  static #AVConfigStatic: true;
}

declare namespace AVConfig {
  interface Any extends AnyAVConfig {}
  interface AnyConstructor extends Identity<typeof AnyAVConfig> {}

  interface FieldsContext {
    world: AVSettings.WorldSchema;
    client: AVSettings.ClientSchema;
  }

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      ApplicationV2.RenderContext,
      IntentionalPartial<PreparePartContext> {
    tabClasses: string;

    rootId: string;

    settings: AVSettings.Settings;

    fields: FieldsContext;

    /** Whether the page is served over HTTPS, without which no AV mode can be selected. */
    isSSL: boolean;
  }

  /** @remarks Added by {@linkcode AVConfig._preparePartContext | #_preparePartContext}. */
  interface PreparePartContext {
    /** @remarks Added for a tab part. */
    tab: ApplicationV2.Tab;

    /** @remarks Added for the `general` part. */
    canSelectMode: boolean;

    /** @remarks Added for the `general` part. */
    modes: Record<AVSettings.AV_MODES, string>;

    /** @remarks Added for the `general` part. */
    voiceModes: Record<AVSettings.VOICE_MODES, string>;

    /** @remarks Added for the `general` part. */
    dockPositions: Record<AVSettings.DOCK_POSITIONS, string>;

    /** @remarks Added for the `general` part. */
    nameplates: Record<AVSettings.NAMEPLATE_MODES, string>;

    /** @remarks Added for the `devices` part. */
    videoDevices: FormSelectOption[];

    /** @remarks Added for the `devices` part. */
    audioDevices: FormSelectOption[];

    /** @remarks Added for the `devices` part. */
    audioSinks: FormSelectOption[];

    /** @remarks Added for the `server` part. */
    turnTypes: Record<string, string>;

    /** @remarks Added for the `footer` part. */
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<AVConfig extends AVConfig.Any = AVConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<AVConfig> {
    /**
     * The AVMaster instance being configured
     *
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AVConfig extends AVConfig.Any = AVConfig.Any> = DeepPartial<Configuration<AVConfig>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyAVConfig extends AVConfig<
  AVConfig.RenderContext,
  AVConfig.Configuration,
  AVConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AVConfig;
