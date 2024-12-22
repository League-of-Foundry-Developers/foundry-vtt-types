import type { GetKey, ValueOf } from "../../../utils/index.d.mts";

declare global {
  interface AVSettingsData {
    /** Whether this user has muted themselves. */
    muted?: boolean | undefined;

    /** Whether this user has hidden their video. */
    hidden?: boolean | undefined;

    /** Whether the user is broadcasting audio. */
    speaking?: boolean | undefined;
  }

  class AVSettings {
    constructor();

    /** @internal */
    protected _set: <T>(key: string, value: T) => void;

    /** @internal */
    protected _change: () => void;

    client: AVSettings.ClientSettings;

    world: AVSettings.WorldSettings;

    protected _original: AVSettings.Settings;

    /**
     * WebRTC Mode, Disabled, Audio only, Video only, Audio & Video
     */
    static AV_MODES: {
      DISABLED: 0;
      AUDIO: 1;
      VIDEO: 2;
      AUDIO_VIDEO: 3;
    };

    /**
     * Voice modes: Always-broadcasting, voice-level triggered, push-to-talk.
     */
    static VOICE_MODES: AVSettings.VoiceModes;

    /**
     * Displayed nameplate options: Off entirely, animate between player and character name, player name only, character
     * name only.
     */
    static NAMEPLATE_MODES: AVSettings.NameplateModes;

    /**
     * AV dock positions.
     */
    static DOCK_POSITIONS: AVSettings.DockPositions;

    /**
     * Default Client Settings
     */
    static DEFAULT_CLIENT_SETTINGS: {
      /**
       * @defaultValue `"default"`
       */
      videoSrc: string;

      /**
       * @defaultValue `"default"`
       */
      audioSrc: string;

      /**
       * @defaultValue `"default"`
       */
      audioSink: string;

      /**
       * @defaultValue `"bottom"`
       */
      dockPosition: AVSettings.DOCK_POSITIONS;

      /**
       * @defaultValue `false`
       */
      hidePlayerList: boolean;

      /**
       * @defaultValue `false`
       */
      hideDock: boolean;

      /**
       * @defaultValue `false`
       */
      muteAll: boolean;

      /**
       * @defaultValue `false`
       */
      disableVideo: boolean;

      /**
       * @defaultValue `false`
       */
      borderColors: boolean;

      /**
       * @defaultValue `240`
       */
      dockWidth: number;

      /**
       * @defaultValue `1`
       */
      nameplates: AVSettings.NAMEPLATE_MODES;

      voice: {
        /**
         * @defaultValue `"AVSettings.VOICE_MODES.PTT"`
         */
        mode: AVSettings.VOICE_MODES;

        /**
         * @defaultValue
         * ```
         * "`"
         * ```
         */
        pttName: string;

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
      users: Record<string, AVSettings.StoredUserSettings>;
    };

    /**
     * Default world-level AV settings.
     */
    static DEFAULT_WORLD_SETTINGS: {
      /**
       * @defaultValue `AVSettings.AV_MODES.DISABLED`
       */
      mode: AVSettings.AV_MODES;

      turn: {
        /**
         * @defaultValue `"server"`
         */
        type: string;

        /**
         * @defaultValue `""`
         */
        url: string;

        /**
         * @defaultValue `""`
         */
        username: string;

        /**
         * @defaultValue `""`
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

      /**
       * @defaultValue `240`
       */
      dockWidth: number;
    };

    /**
     * Stores the transient AV activity data received from other users.
     */
    activity: Record<string, AVSettingsData>;

    initialize(): void;

    changed(): void;

    get<S extends "client" | "world">(scope: S, setting: string): unknown; // TODO: Improve once we have proper typing for dot notation

    getUser(userId: string): AVSettings.UserSettings | null;

    set<S extends "client" | "world">(scope: S, setting: string, value: unknown): void; // TODO: Improve once we have proper typing for dot notation

    /**
     * Return a mapping of AV settings for each game User.
     */
    get users(): Record<string, AVSettings.UserSettings>;

    /**
     * A helper to determine if the dock is configured in a vertical position.
     */
    get verticalDock(): boolean;

    /**
     * Prepare a standardized object of user settings data for a single User
     * @internal
     */
    protected _getUserSettings(user: User): AVSettings.UserSettings;

    /**
     * Handle setting changes to either rctClientSettings or rtcWorldSettings.
     * @internal
     */
    protected _onSettingsChanged(): void;

    /**
     * Handle another connected user changing their AV settings.
     */
    handleUserActivity(userId: string, settings: AVSettingsData): void;
  }

  namespace AVSettings {
    type ClientSettings = typeof AVSettings.DEFAULT_CLIENT_SETTINGS;
    type WorldSettings = typeof AVSettings.DEFAULT_WORLD_SETTINGS;
    type StoredUserSettings = typeof AVSettings.DEFAULT_USER_SETTINGS;
    type UserSettings = StoredUserSettings & { canBroadcastAudio: boolean; canBroadcastVideo: boolean };
    interface Settings {
      client: ClientSettings;
      world: WorldSettings;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Overrides {}

    interface DefaultVoiceModes {
      ALWAYS: "always";
      ACTIVITY: "activity";
      PTT: "ptt";
    }
    type VoiceModes = GetKey<AVSettings.Overrides, "VoiceModes", DefaultVoiceModes>;
    type VOICE_MODES = ValueOf<VoiceModes>;

    interface DefaultNamePlateModes {
      OFF: 0;
      BOTH: 1;
      PLAYER_ONLY: 2;
      CHAR_ONLY: 3;
    }
    type NameplateModes = GetKey<AVSettings.Overrides, "NameplateModes", DefaultNamePlateModes>;
    type NAMEPLATE_MODES = ValueOf<NameplateModes>;

    interface DefaultDockPositions {
      TOP: "top";
      RIGHT: "right";
      BOTTOM: "bottom";
      LEFT: "left";
    }
    type DockPositions = GetKey<AVSettings.Overrides, "DockPositions", DefaultDockPositions>;
    type DOCK_POSITIONS = ValueOf<DockPositions>;

    type AV_MODES = ValueOf<typeof AVSettings.AV_MODES>;
  }
}
