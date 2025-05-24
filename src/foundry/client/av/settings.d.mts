import type { fields } from "#common/data/_module.mjs";
import type { DataSchema } from "#common/data/fields.mjs";
import type { GetKey, ValueOf } from "#utils";

declare global {
  /** @deprecated Replaced with {@linkcode AVSettings.Data} */
  type AVSettingsData = AVSettings.Data;

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

    static get schemaFields(): AVSettings.SchemaFields;

    /**
     * Default Client Settings
     */
    static DEFAULT_CLIENT_SETTINGS: AVSettings.ClientSettings;

    /**
     * Default world-level AV settings.
     */
    static DEFAULT_WORLD_SETTINGS: AVSettings.WorldSettings;

    static DEFAULT_USER_SETTINGS: AVSettings.StoredUserSettings;

    /**
     * Stores the transient AV activity data received from other users.
     */
    activity: Record<string, AVSettings.Data>;

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
    protected _getUserSettings(user: User.Implementation): AVSettings.UserSettings;

    /**
     * Handle setting changes to either rctClientSettings or rtcWorldSettings.
     * @internal
     */
    protected _onSettingsChanged(): void;

    /**
     * Handle another connected user changing their AV settings.
     */
    handleUserActivity(userId: string, settings: AVSettings.Data): void;
  }

  namespace AVSettings {
    interface ClientSettings {
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
    }

    interface WorldSettings {
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
    }

    interface StoredUserSettings {
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
    }

    interface UserSettings extends StoredUserSettings {
      canBroadcastAudio: boolean;
      canBroadcastVideo: boolean;
    }

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

    interface WorldSchema extends DataSchema {
      mode: fields.NumberField<{
        required: true;
        nullable: false;
        choices: AVSettings.AV_MODES[];
        initial: typeof AVSettings.AV_MODES.DISABLED;
      }>;
      turn: fields.SchemaField<{
        type: fields.StringField<{ required: true; choices: ["server", "custom"]; initial: "server" }>;
        url: fields.StringField<{ required: true }>;
        username: fields.StringField<{ required: true }>;
        password: fields.StringField<{ required: true }>;
      }>;
    }

    interface ClientSchema extends DataSchema {
      videoSrc: fields.StringField<{ required: true; initial: "default" }>;
      audioSrc: fields.StringField<{ required: true; initial: "default" }>;
      audioSink: fields.StringField<{ required: true; initial: "default" }>;
      dockPosition: fields.StringField<{
        required: true;
        // choices: Object.values(AVSettings.DOCK_POSITIONS>,
        initial: typeof AVSettings.DOCK_POSITIONS.LEFT;
      }>;
      hidePlayerList: fields.BooleanField;
      hideDock: fields.BooleanField;
      muteAll: fields.BooleanField;
      disableVideo: fields.BooleanField;
      borderColors: fields.BooleanField;
      dockWidth: fields.NumberField<{
        required: true;
        nullable: false;
        integer: true;
        positive: true;
        initial: 240;
      }>;
      nameplates: fields.NumberField<{
        required: true;
        nullable: false;
        choices: AVSettings.NAMEPLATE_MODES[];
        initial: typeof AVSettings.NAMEPLATE_MODES.BOTH;
      }>;
      voice: fields.SchemaField<{
        mode: fields.StringField<{
          required: true;
          choices: AVSettings.VOICE_MODES[];
          initial: typeof AVSettings.VOICE_MODES.PTT;
        }>;
        pttName: fields.StringField<{ required: true; initial: "`" }>;
        pttDelay: fields.NumberField<{ required: true; nullable: false; integer: true; min: 0; initial: 100 }>;
        activityThreshold: fields.NumberField<{ required: true; nullable: false; integer: true; initial: -45 }>;
      }>;
      users: fields.TypedObjectField<
        fields.SchemaField<{
          popout: fields.BooleanField;
          left: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 100 }>;
          top: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 100 }>;
          z: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;
          width: fields.NumberField<{ required: true; nullable: false; integer: true; positive: true; initial: 320 }>;
          volume: fields.NumberField<{ required: true; nullable: false; min: 0; max: 1; initial: 1 }>;
          muted: fields.BooleanField;
          hidden: fields.BooleanField;
          blocked: fields.BooleanField;
        }>,
        { validateKey: typeof foundry.data.validators.isValidId }
      >;
    }

    interface SchemaFields {
      world: fields.SchemaField<WorldSchema>;
      client: fields.SchemaField<ClientSchema>;
    }

    type AV_MODES = ValueOf<typeof AVSettings.AV_MODES>;

    interface Data {
      /** Whether this user has muted themselves. */
      muted?: boolean | undefined;

      /** Whether this user has hidden their video. */
      hidden?: boolean | undefined;

      /** Whether the user is broadcasting audio. */
      speaking?: boolean | undefined;
    }
  }
}
