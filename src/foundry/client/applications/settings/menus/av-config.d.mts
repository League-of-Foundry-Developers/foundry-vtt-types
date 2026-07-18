import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type AVSettings from "../../../av/settings.d.mts";
import type { FormSelectOption } from "../../forms/fields.d.mts";

import AVMaster = foundry.av.AVMaster;

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
  constructor(options?: AVConfig.InputOptions<Configuration>);

  /**
   * The AVMaster instance being configured
   * @defaultValue `this.options.webrtc ?? game.webrtc`
   */
  webrtc: AVMaster;

  /**
   * @defaultValue
   * ```js
   * {
   *   tag: "form",
   *   id: "av-config",
   *   window: {
   *     title: "WEBRTC.Title",
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-headset"
   *   },
   *   position: {
   *     width: 480
   *   },
   *   form: {
   *     closeOnSubmit: true,
   *     handler: AVConfig.#onSubmit
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: AVConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   main: {
   *     tabs: [
   *       { id: "general", icon: "fa-solid fa-gear" },
   *       { id: "devices", icon: "fa-solid fa-microphone" },
   *       { id: "server", icon: "fa-solid fa-server" }
   *     ],
   *     initial: "general",
   *     labelPrefix: "WEBRTC.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  #AVConfig: true;
}

declare namespace AVConfig {
  interface Any extends AnyAVConfig {}
  interface AnyConstructor extends Identity<typeof AnyAVConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    tabClasses: string;
    rootId: string;
    settings: AVSettings;
    fields: { world: AVSettings.WorldSchema; client: AVSettings.ClientSchema };
    isSSL: boolean;

    // The following are only present on the context for the part they're relevant to, set by `_preparePartContext`.
    tab?: ApplicationV2.Tab | undefined;
    canSelectMode?: boolean | undefined;
    modes?: Record<AVSettings.AV_MODES, string> | undefined;
    voiceModes?: Record<AVSettings.VOICE_MODES, string> | undefined;
    dockPositions?: Record<AVSettings.DOCK_POSITIONS, string> | undefined;
    nameplates?: Record<AVSettings.NAMEPLATE_MODES, string> | undefined;
    videoDevices?: FormSelectOption[] | undefined;
    audioDevices?: FormSelectOption[] | undefined;
    audioSinks?: FormSelectOption[] | undefined;
    turnTypes?: { server: string; custom: string } | undefined;
    buttons?: ApplicationV2.FormFooterButton[] | undefined;
  }

  interface Configuration<AVConfig extends AVConfig.Any = AVConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<AVConfig> {
    /**
     * The AVMaster instance being configured
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster | undefined;
  }

  /**
   * @remarks `webrtc` is deliberately excluded from the `DeepPartial` applied to the rest of the options:
   * `AVMaster` instances are not designed to be deep-partialed, so allowing that recursion to reach into
   * them produces incorrect and extremely expensive-to-check types.
   */
  type InputOptions<Configuration extends AVConfig.Configuration = AVConfig.Configuration> = DeepPartial<
    Omit<Configuration, "webrtc">
  > & {
    /**
     * The AVMaster instance being configured
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster | undefined;
  };

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
