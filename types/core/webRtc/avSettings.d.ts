declare class AVSettings {
  constructor();

  protected _set<T>(key: string, value: T): void;

  protected _change(): void;

  client: AVSettings.ClientSettings;

  world: AVSettings.WorldSettings;

  protected _original: AVSettings.Settings;

  initialize(): void;

  changed(): void;

  get<S extends 'client' | 'world'>(scope: S, setting: string): unknown; // TODO: Improve once we have proper typing for dot notation

  getUser(userId: string): AVSettings.UserSettings | null;

  set<S extends 'client' | 'world'>(scope: S, setting: string, value: unknown): void; // TODO: Improve once we have proper typing for dot notation

  /**
   * Return a mapping of AV settings for each game User.
   */
  get users(): {
    string: AVSettings.UserSettings;
  };

  /**
   * Prepare a standardized object of user settings data for a single User
   */
  protected _getUserSettings(user: User): AVSettings.UserSettings;

  protected _onSettingsChanged(): void;

  /**
   * WebRTC Mode, Disabled, Audio only, Video only, Audio & Video
   */
  static AV_MODES: {
    DISABLED: 0;
    AUDIO: 1;
    VIDEO: 2;
    AUDIO_VIDEO: 3;
  };

  static VOICE_MODES: {
    ALWAYS: 'always';
    ACTIVITY: 'activity';
    PTT: 'ptt';
  };

  static DEFAULT_CLIENT_SETTINGS: {
    /**
     * @defaultValue `'default'`
     */
    videoSrc: string;

    /**
     * @defaultValue `'default'`
     */
    audioSrc: string;

    /**
     * @defaultValue `'default'`
     */
    audioSink: string;

    /**
     * @defaultValue
     */
    dockSize: 'large' | 'medium' | 'small';

    /**
     * @defaultValue `'bottom'`
     */
    dockPosition: string;

    /**
     * @defaultValue `false`
     */
    hidePlayerList: boolean;

    /**
     * @defaultValue `false`
     */
    muteAll: boolean;

    voice: {
      /**
       * @defaultValue `'AVSettings.VOICE_MODES.PTT'`
       */
      mode: typeof AVSettings.VOICE_MODES[keyof typeof AVSettings.VOICE_MODES];

      /**
       * @defaultValue `192` (Tilde)
       */
      pttKey: number;

      /* eslint-disable */
      /**
       * @defaultValue ``"`"``
       */
      /* eslint-enable */
      pttName: string;

      /**
       * @defaultValue `false`
       */
      pttMouse: boolean;

      /**
       * @defaultValue `100`
       */
      pttDelay: number;

      /**
       * @defaultValue `-45`
       */
      activityThreshold: number;
    };

    /**
     * @defaultValue `{}`
     */
    users: Partial<Record<string, AVSettings.StoredUserSettings>>;
  };

  static DEFAULT_WORLD_SETTINGS: {
    /**
     * @defaultValue `AVSettings.AV_MODES.DISABLED`
     */
    mode: typeof AVSettings.VOICE_MODES[keyof typeof AVSettings.VOICE_MODES];

    server: {
      /**
       * @defaultValue `'FVTT'`
       */
      type: string;

      /**
       * @defaultValue `''`
       */
      url: string;

      /**
       * @defaultValue `''`
       */
      room: string;

      /**
       * @defaultValue `''`
       */
      username: string;

      /**
       * @defaultValue `''`
       */
      password: string;
    };

    turn: {
      /**
       * @defaultValue `'server'`
       */
      type: string;

      /**
       * @defaultValue `''`
       */
      url: string;

      /**
       * @defaultValue `''`
       */
      username: string;

      /**
       * @defaultValue `''`
       */
      password: string;
    };
  };

  static DEFAULT_USER_SETTINGS: {
    /**
     * @defaultValue `false`
     */
    popout: boolean;

    /**
     * @defaultValue `100`
     */
    x: number;

    /**
     * @defaultValue `100`
     */
    y: number;

    /**
     * @defaultValue `0`
     */
    z: number;

    /**
     * @defaultValue `320`
     */
    width: number;

    /**
     * @defaultValue `1.0`
     */
    volume: number;

    /**
     * @defaultValue `false`
     */
    muted: boolean;

    /**
     * @defaultValue `false`
     */
    hidden: boolean;

    /**
     * @defaultValue `false`
     */
    blocked: boolean;
  };
}

declare namespace AVSettings {
  type ClientSettings = typeof AVSettings.DEFAULT_CLIENT_SETTINGS;
  type WorldSettings = typeof AVSettings.DEFAULT_WORLD_SETTINGS;
  type StoredUserSettings = typeof AVSettings.DEFAULT_USER_SETTINGS;
  type UserSettings = StoredUserSettings & { canBroadCastAudio: boolean; canBroadcastVideo: boolean };
  type Settings = { client: ClientSettings; world: WorldSettings };
}
