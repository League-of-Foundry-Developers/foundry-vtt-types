import type { GetDataReturnType, MaybePromise, Identity } from "fvtt-types/utils";

declare global {
  /**
   * Audio/Video Conferencing Configuration Sheet
   *
   * @typeParam Options - The type of the options object
   */
  class AVConfig<Options extends FormApplication.Options = FormApplication.Options> extends FormApplication<
    AVMaster,
    Options
  > {
    /**
     * @param object  - The {@link AVMaster | `AVMaster`} instance being configured.
     * @param options - Application configuration options.
     */
    constructor(object?: AVMaster, options?: Partial<Options>);

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *  title: game.i18n.localize("WEBRTC.Title"),
     *  id: "av-config",
     *  template: "templates/sidebar/apps/av-config.html",
     *  popOut: true,
     *  width: 480,
     *  height: "auto",
     *  tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "general"}]
     * });
     * ```
     */
    static override get defaultOptions(): FormApplication.Options;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<AVConfig.AVConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Set a section's input to enabled or disabled
     * @param selector - Selector for the section to enable or disable
     * @param enabled  - Whether to enable or disable this section
     *                   (default: true)
     * @internal
     */
    protected _setConfigSectionEnabled(selector: string, enabled?: boolean): void;

    /**
     * Determine whether a given video or audio source, or audio sink has become
     * unavailable since the last time it was set.
     * @param sources - The available devices
     * @param source  - The selected device
     * @internal
     */
    protected _isSourceUnavailable(sources: Record<string, string>, source: string): boolean;

    /**
     * Callback when the turn server type changes
     * Will enable or disable the turn section based on whether the user selected a custom turn or not
     * @param event - The event that triggered the turn server type change
     * @internal
     */
    protected _onTurnTypeChanged(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData?: object): Promise<void>;
  }

  namespace AVConfig {
    interface Any extends AnyAVConfig {}
    interface AnyConstructor extends Identity<typeof AnyAVConfig> {}

    interface AVConfigData {
      user: User.Implementation;
      modes: Record<AVSettings.AV_MODES, string>;
      voiceModes: Record<AVSettings.VOICE_MODES, string>;
      serverTypes: { FVTT: "WEBRTC.FVTTSignalingServer"; custom: "WEBRTC.CustomSignalingServer" };
      turnTypes: { server: "WEBRTC.TURNServerProvisioned"; custom: "WEBRTC.CustomTURNServer" };
      settings: AVSettings;
      canSelectMode: boolean;
      noSSL: boolean;
      videoSources: Record<string, string>;
      audioSources: Record<string, string>;
      audioSinks: false | Record<string, string>;
      videoSrcUnavailable: boolean;
      audioSrcUnavailable: boolean;
      audioSinkUnavailable: boolean;
      audioDisabled: boolean;
      videoDisabled: boolean;
      nameplates: Record<AVSettings.NAMEPLATE_MODES, string>;
      nameplateSetting: AVSettings.NAMEPLATE_MODES;
      dockPositions: Record<AVSettings.DOCK_POSITIONS, string>;
    }
  }
}

declare abstract class AnyAVConfig extends AVConfig<FormApplication.Options> {
  constructor(...args: never);
}
