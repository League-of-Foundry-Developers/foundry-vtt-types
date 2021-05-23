/**
 * Audio/Video Conferencing Configuration Sheet
 */
declare class AVConfig extends FormApplication<AVConfig.Options, AVConfig.Data, AVMaster> {
  /** @override */
  static get defaultOptions(): AVConfig.Options;

  /** @override */
  activateListeners(html: JQuery): void;

  /** @override */
  getData(options: Application.RenderOptions): Promise<AVConfig.Data>;

  /**
   * Handle the assignment of a push-to-talk/push-to-mute key
   */
  protected _onPTTKeyDown(event: JQuery.KeyDownEvent): void;

  /**
   * Handle the assignment of a push-to-talk/push-to-mute mouse key
   */
  protected _onPTTMouseDown(event: JQuery.MouseDownEvent): void;

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
   * Set a section's input to enabled or disabled
   * @param selector - Selector for the section to enable or disable
   * @param enabled  - Whether to enable or disable this section
   *                   (default: true)
   */
  protected _setConfigSectionEnabled(selector: string, enabled?: boolean): void;

  /** @override */
  protected _updateObject(event: Event, formData?: object): Promise<void>;
}

declare namespace AVConfig {
  interface Options extends FormApplication.Options {
    /**
     * @defaultValue `'auto'`
     */
    height: number | 'auto';

    /**
     * @defaultValue `'av-config'`
     */
    id: string;

    /**
     * @defaultValue `true`
     */
    popOut: boolean;

    /**
     * @defaultValue `[{navSelector: '.tabs', contentSelector: 'form', initial: 'general'}]`
     */
    tabs: (Tabs.Options & { contentSelector: string; initial: string })[];

    /**
     * @defaultValue `'templates/sidebar/apps/av-config.html'`
     */
    template: string;

    /**
     * @defaultValue `game.i18n.localize('WEBRTC.Title')`
     */
    title: string;

    /**
     * @defaultValue `480`
     */
    width: number;
  }

  interface Data {
    audioSinkUnavailable: boolean;
    audioSinks: Record<string, string> | false;
    audioSources: Record<string, string>;
    audioSrcUnavailable: boolean;
    canSelectMode: boolean;
    modes: {
      [Key in ValueOf<typeof AVSettings.AV_MODES>]: string;
    };
    noSSL: boolean;
    serverTypes: {
      FVTT: string;
      custom: string;
    };
    settings: AVSettings;
    turnTypes: {
      FVTT: string;
      custom: string;
    };
    user: User | null;
    videoSources: Record<string, string>;
    videoSrcUnavailable: boolean;
    voiceModes: {
      [Key in ValueOf<typeof AVSettings.VOICE_MODES>]: string;
    };
  }
}
