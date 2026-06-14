import type { Brand } from "#utils";
import type { fields } from "#common/data/_module.mjs";
import type { ClientSettings } from "#client/helpers/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type AVMaster from "#client/av/master.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Only used for links.
import type { AllHooks } from "#client/hooks.d.mts";

declare class AVSettings {
  constructor();

  /**
   * @remarks A debounce callback for setting a setting in the `"core"` namespace.
   * @privateRemarks Not defined in the class body, but during construction.
   * @internal
   */
  _set: <K extends ClientSettings.KeyFor<"core">>(key: K, value: ClientSettings.SettingCreateData<"core", K>) => void;

  /**
   * @remarks A cached value of the `core.rtcClientSettings` setting. Updated every time the setting is changed via
   * the registered `onChange` function being {@linkcode AVSettings.changed | () => game.webrtc.settings.changed()}.
   *
   * @privateRemarks This isn't defined in the class body, but in `##initialize`,
   * which is called during construction, as well as by `changed`.
   */
  client: AVSettings.ClientSettingData;

  /**
   * @remarks A cached value of the `core.rtcWorldSettings` setting. Updated every time the setting is changed via
   * the registered `onChange` function being {@linkcode AVSettings.changed | () => game.webrtc.settings.changed()}.
   *
   * @privateRemarks This isn't defined in the class body, but in `##initialize`,
   * which is called during construction, as well as by `changed`.
   */
  world: AVSettings.WorldSettingData;

  /**
   * @remarks A record of the last known setting values; diffed against to get the value passed to
   * {@linkcode AVMaster.onSettingsChanged | game.webrtc.onSettingsChanged} and the
   * {@linkcode AllHooks.rtcSettingsChanged | rtcSettingsChanged} hook. Updated every time the setting is changed via
   * the registered `onChange` function being {@linkcode AVSettings.changed | () => game.webrtc.settings.changed()}.
   *
   * @privateRemarks This isn't defined in the class body, but in `##initialize`,
   * which is called during construction, as well as by `changed`.
   */
  _original: Readonly<AVSettings.Settings>;

  /**
   * WebRTC Mode, Disabled, Audio only, Video only, Audio & Video
   */
  static AV_MODES: AVSettings.AVModes;

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
   * Schemas for world and client settings
   * @privateRemarks This replaces itself with a property on first read. Since that property is readonly and non-enumerable, exactly like a
   * getter, it has just been typed as such.
   */
  static get schemaFields(): AVSettings.SchemaFields;

  /**
   * Default client settings for each connected user.
   */
  static get DEFAULT_USER_SETTINGS(): AVSettings.UserData;

  /**
   * Register world and client WebRTC settings.
   * @remarks Called in {@linkcode foundry.Game.registerSettings | Game#registerSettings}.
   */
  static register(): void;

  /**
   * A debounce callback for when either the world or client settings change.
   */
  changed: () => void;

  /**
   * Stores the transient AV activity data received from other users.
   */
  activity: Record<string, AVSettings.Data>;

  /** @deprecated Foundry made this private in v13. This warning will be removed in v14. */
  initialize(): never;

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
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _getUserSettings(user: never): AVSettings.UserSettings;

  /**
   * Handle setting changes to either rctClientSettings or rtcWorldSettings.
   * @internal
   * @deprecated Foundry made this hard private in v13. This warning will be removed in v14.
   */
  protected _onSettingsChanged(): void;

  /**
   * Handle another connected user changing their AV settings.
   */
  handleUserActivity(userId: string, settings: AVSettings.Data): void;

  #AVSettings: true;
}

declare namespace AVSettings {
  interface UserSettings extends UserData {
    canBroadcastAudio: boolean;
    canBroadcastVideo: boolean;
    speaking: boolean | undefined;
  }

  interface Settings {
    client: ClientSettingData;
    world: WorldSettingData;
  }

  type AV_MODES = Brand<number, "AVSettings.AV_MODES">;

  interface AVModes {
    DISABLED: 0 & AV_MODES;
    AUDIO: 1 & AV_MODES;
    VIDEO: 2 & AV_MODES;
    AUDIO_VIDEO: 3 & AV_MODES;
  }

  type VOICE_MODES = Brand<string, "AVSettings.VOICE_MODES">;

  interface VoiceModes {
    ALWAYS: "always" & VOICE_MODES;
    ACTIVITY: "activity" & VOICE_MODES;
    PTT: "ptt" & VOICE_MODES;
  }

  type NAMEPLATE_MODES = Brand<number, "AVSettings.NAMEPLATE_MODES">;

  interface NameplateModes {
    OFF: 0 & NAMEPLATE_MODES;
    BOTH: 1 & NAMEPLATE_MODES;
    PLAYER_ONLY: 2 & NAMEPLATE_MODES;
    CHAR_ONLY: 3 & NAMEPLATE_MODES;
  }

  type DOCK_POSITIONS = Brand<string, "AVSettings.DOCK_POSITIONS">;

  interface DockPositions {
    TOP: "top" & DOCK_POSITIONS;
    RIGHT: "right" & DOCK_POSITIONS;
    BOTTOM: "bottom" & DOCK_POSITIONS;
    LEFT: "left" & DOCK_POSITIONS;
  }

  interface TurnSchema extends fields.DataSchema {
    /** @defaultValue `"server"` */
    type: fields.StringField<{ required: true; choices: ["server", "custom"]; initial: "server" }>;

    /** @defaultValue `""` */
    url: fields.StringField<{ required: true }>;

    /** @defaultValue `""` */
    username: fields.StringField<{ required: true }>;

    /** @defaultValue `""` */
    password: fields.StringField<{ required: true }>;
  }

  interface WorldSchema extends fields.DataSchema {
    /** @defaultValue {@linkcode AVSettings.AV_MODES.DISABLED} */
    mode: fields.NumberField<{
      required: true;
      nullable: false;
      choices: AVSettings.AV_MODES[];
      initial: typeof AVSettings.AV_MODES.DISABLED;
    }>;
    turn: fields.SchemaField<TurnSchema>;
  }

  interface WorldSettingData extends fields.SchemaField.InitializedData<WorldSchema> {}

  interface VoiceSchema extends fields.DataSchema {
    /** @defaultValue {@linkcode AVSettings.VOICE_MODES.PTT} */
    mode: fields.StringField<{
      required: true;
      choices: AVSettings.VOICE_MODES[];
      initial: typeof AVSettings.VOICE_MODES.PTT;
    }>;

    /**
     * @defaultValue A string containing a backtick, i.e.:
     * ```js
     * "`"
     * ```
     */
    pttName: fields.StringField<{ required: true; initial: "`" }>;

    /** @defaultValue 100 */
    pttDelay: fields.NumberField<{ required: true; nullable: false; integer: true; min: 0; initial: 100 }>;

    /** @defaultValue -45 */
    activityThreshold: fields.NumberField<{ required: true; nullable: false; integer: true; initial: -45 }>;
  }

  interface UserSchema extends fields.DataSchema {
    /** @defaultValue `false` */
    popout: fields.BooleanField;

    /** @defaultValue `100` */
    left: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 100 }>;

    /** @defaultValue `100` */
    top: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 100 }>;

    /** @defaultValue `0` */
    z: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

    /** @defaultValue `320` */
    width: fields.NumberField<{ required: true; nullable: false; integer: true; positive: true; initial: 320 }>;

    /** @defaultValue `1` */
    volume: fields.NumberField<{ required: true; nullable: false; min: 0; max: 1; initial: 1 }>;

    /** @defaultValue `false` */
    muted: fields.BooleanField;

    /** @defaultValue `false` */
    hidden: fields.BooleanField;

    /** @defaultValue `false` */
    blocked: fields.BooleanField;
  }

  interface UserData extends fields.SchemaField.InitializedData<UserSchema> {}

  interface ClientSchema extends fields.DataSchema {
    /** @defaultValue `"default"` */
    videoSrc: fields.StringField<{ required: true; initial: "default" }>;

    /** @defaultValue `"default"` */
    audioSrc: fields.StringField<{ required: true; initial: "default" }>;

    /** @defaultValue `"default"` */
    audioSink: fields.StringField<{ required: true; initial: "default" }>;

    /** @defaultValue {@linkcode AVSettings.DOCK_POSITIONS.LEFT} */
    dockPosition: fields.StringField<{
      required: true;
      choices: AVSettings.DOCK_POSITIONS[];
      initial: typeof AVSettings.DOCK_POSITIONS.LEFT;
    }>;

    /** @defaultValue `false` */
    hidePlayerList: fields.BooleanField;

    /** @defaultValue `false` */
    hideDock: fields.BooleanField;

    /** @defaultValue `false` */
    muteAll: fields.BooleanField;

    /** @defaultValue `false` */
    disableVideo: fields.BooleanField;

    /** @defaultValue `false` */
    borderColors: fields.BooleanField;

    /** @defaultValue `240` */
    dockWidth: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      positive: true;
      initial: 240;
    }>;

    /** @defaultValue {@linkcode AVSettings.NAMEPLATE_MODES.BOTH} */
    nameplates: fields.NumberField<{
      required: true;
      nullable: false;
      choices: AVSettings.NAMEPLATE_MODES[];
      initial: typeof AVSettings.NAMEPLATE_MODES.BOTH;
    }>;

    voice: fields.SchemaField<VoiceSchema>;

    users: fields.TypedObjectField<
      fields.SchemaField<UserSchema>,
      { validateKey: typeof foundry.data.validators.isValidId }
    >;
  }

  interface ClientSettingData extends fields.SchemaField.InitializedData<ClientSchema> {}

  /** @privateRemarks This weirdly doesn't extend `fields.DataSchema` as its never used as a schema itself. */
  interface SchemaFields {
    world: fields.SchemaField<WorldSchema>;
    client: fields.SchemaField<ClientSchema>;
  }

  interface Data {
    /**
     * Whether this user has muted themselves.
     * @remarks Non-nullish due to use of `in`, and because this will be coming in over a socket.
     */
    muted?: boolean;

    /**
     * Whether this user has hidden their video.
     * @remarks Non-nullish due to use of `in`, and because this will be coming in over a socket.
     */
    hidden?: boolean;

    /**
     * Whether the user is broadcasting audio.
     * @remarks Non-nullish due to use of `in`, and because this will be coming in over a socket.
     */
    speaking?: boolean;
  }

  /** @deprecated Use {@linkcode AVSettings.WorldSettingData} instead. This type will be removed in v14. */
  type WorldSettings = WorldSettingData;

  /** @deprecated Use {@linkcode AVSettings.ClientSettingData} instead. This type will be removed in v14. */
  type ClientSettings = ClientSettingData;

  /** @deprecated Use {@linkcode AVSettings.UserData} instead. This type will be removed in v14. */
  type StoredUserSettings = UserData;

  /** @deprecated This interface has been deprecated, the types it was allowing configuration of are not intended to be extended. */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Overrides {}
}

export default AVSettings;
