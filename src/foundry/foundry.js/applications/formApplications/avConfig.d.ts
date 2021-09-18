/**
 * Audio/Video Conferencing Configuration Sheet
 */
declare class AVConfig extends FormApplication<AVConfig.Options, AVConfig.Data, AVMaster> {
  /** @override */
  static get defaultOptions(): AVConfig.Options;

  /** @override */
  getData(options: Partial<AVConfig.Options>): Promise<AVConfig.Data>;

  /** @override */
  activateListeners(html: JQuery): void;

  /**
   * Set a section's input to enabled or disabled
   * @param selector - Selector for the section to enable or disable
   * @param enabled  - Whether to enable or disable this section
   *                   (default: true)
   */
  protected _setConfigSectionEnabled(selector: string, enabled?: boolean): void;

  /**
   * Determine whether a given video or audio source, or audio sink has become
   * unavailable since the last time it was set.
   * @param sources - The available devices
   * @param source  - The selected device
   */
  protected _isSourceUnavailable(sources: Record<string, string>, source: string): boolean;

  /**
   * Callback when the server type changes
   * Will enable or disable the server section based on whether the user selected a custom server or not
   * @param event - The event that triggered the server type change
   */
  protected _onServerTypeChanged(event: JQuery.ChangeEvent): void;

  /**
   * Callback when the turn server type changes
   * Will enable or disable the turn section based on whether the user selected a custom turn or not
   * @param event - The event that triggered the turn server type change
   */
  protected _onTurnTypeChanged(event: JQuery.ChangeEvent): void;

  /**
   * Handle the assignment of a push-to-talk/push-to-mute key
   */
  protected _onPTTKeyDown(event: JQuery.KeyDownEvent): void;

  /**
   * Handle the assignment of a push-to-talk/push-to-mute mouse key
   */
  protected _onPTTMouseDown(event: JQuery.MouseDownEvent): void;

  /** @override */
  protected _updateObject(event: Event, formData?: object): Promise<void>;
}

declare namespace AVConfig {
  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `game.i18n.localize('WEBRTC.Title')`
     */
    title: string;

    /**
     * @defaultValue `'av-config'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/apps/av-config.html'`
     */
    template: string;

    /**
     * @defaultValue `true`
     */
    popOut: boolean;

    /**
     * @defaultValue `480`
     */
    width: number;

    /**
     * @defaultValue `'auto'`
     */
    height: number | 'auto';

    /**
     * @defaultValue `[{navSelector: '.tabs', contentSelector: 'form', initial: 'general'}]`
     */
    tabs: (TabsConfiguration & { contentSelector: string; initial: string })[];
  }

  interface Data {
    user: Game['user'];
    modes: {
      [Key in ValueOf<typeof AVSettings.AV_MODES>]: string;
    };
    voiceModes: {
      [Key in ValueOf<typeof AVSettings.VOICE_MODES>]: string;
    };
    serverTypes: {
      FVTT: string;
      custom: string;
    };
    turnTypes: {
      FVTT: string;
      custom: string;
    };
    settings: AVSettings;
    canSelectMode: boolean;
    noSSL: boolean;
    videoSources: Record<string, string>;
    audioSources: Record<string, string>;
    audioSinks: Record<string, string> | false;
    videoSrcUnavailable: boolean;
    audioSrcUnavailable: boolean;
    audioSinkUnavailable: boolean;
    audioDisabled: boolean;
    videoDisabled: boolean;
  }
}
