declare const vtt: 'Foundry VTT';
declare const VTT: 'Foundry Virtual Tabletop';
declare const WEBSITE_URL: 'https://foundryvtt.com';
declare const ASCII = `_______________________________________________________________
 _____ ___  _   _ _   _ ____  ______   __ __     _______ _____
|  ___/ _ \\| | | | \\ | |  _ \\|  _ \\ \\ / / \\ \\   / |_   _|_   _|
| |_ | | | | | | |  \\| | | | | |_) \\ V /   \\ \\ / /  | |   | |
|  _|| |_| | |_| | |\\  | |_| |  _ < | |     \\ V /   | |   | |
|_|   \\___/ \\___/|_| \\_|____/|_| \\_\\|_|      \\_/    |_|   |_|
===============================================================`;

/* -------------------------------------------- */

/**
 * Define the allowed ActiveEffect application modes
 */
declare const ACTIVE_EFFECT_MODES: {
  CUSTOM: 0;
  MULTIPLY: 1;
  ADD: 2;
  DOWNGRADE: 3;
  UPGRADE: 4;
  OVERRIDE: 5;
};

/* -------------------------------------------- */

/**
 * Define the string name used for the base entity type when specific sub-types are not defined by the system
 */
declare const BASE_ENTITY_TYPE: 'base';

/**
 * Valid Chat Message types
 */
declare const CHAT_MESSAGE_TYPES: {
  OTHER: 0;
  OOC: 1;
  IC: 2;
  EMOTE: 3;
  WHISPER: 4;
  ROLL: 5;
};

/**
 * The allowed Entity types which may exist within a Compendium pack
 * This is a subset of ENTITY_TYPES
 */
declare const COMPENDIUM_ENTITY_TYPES: ['Actor', 'Item', 'Scene', 'JournalEntry', 'Macro', 'RollTable', 'Playlist'];

/**
 * Define the set of languages which have built-in support in the core software
 */
declare const CORE_SUPPORTED_LANGUAGES: ['en'];

/**
 * The default artwork used for Token images if none is provided
 * @defaultValue `'icons/svg/mystery-man.svg'`
 */
declare const DEFAULT_TOKEN: string;

/**
 * The default artwork used for Note placeables if none is provided
 * @defaultValue `'icons/svg/book.svg'`
 */
declare const DEFAULT_NOTE_ICON: string;

/**
 * The supported dice roll visibility modes
 */
declare const DICE_ROLL_MODES: {
  PUBLIC: 'roll';
  PRIVATE: 'gmroll';
  BLIND: 'blindroll';
  SELF: 'selfroll';
};

/**
 * The allowed Drawing types which may be saved
 */
declare const DRAWING_TYPES: {
  RECTANGLE: 'r';
  ELLIPSE: 'e';
  TEXT: 't';
  POLYGON: 'p';
  FREEHAND: 'f';
};

/**
 * The allowed fill types which a Drawing object may display
 * NONE: The drawing is not filled
 * SOLID: The drawing is filled with a solid color
 * PATTERN: The drawing is filled with a tiled image pattern
 */
declare const DRAWING_FILL_TYPES: {
  NONE: 0;
  SOLID: 1;
  PATTERN: 2;
};

/**
 * The default configuration values used for Drawing objects
 */
declare const DRAWING_DEFAULT_VALUES: {
  /**
   * @defaultValue `0`
   */
  width: number;

  /**
   * @defaultValue `0`
   */
  height: number;

  /**
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * @defaultValue `0`
   */
  z: number;

  /**
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * @defaultValue `false`
   */
  locked: boolean;

  /**
   * @defaultValue `0`
   */
  fillType: number;

  /**
   * @defaultValue `0.5`
   */
  fillAlpha: number;

  /**
   * @defaultValue `0.0`
   */
  bezierFactor: number;

  /**
   * @defaultValue `1.0`
   */
  strokeAlpha: number;

  /**
   * @defaultValue `8`
   */
  strokeWidth: number;

  /**
   * @defaultValue `48`
   */
  fontSize: number;

  /**
   * @defaultValue `1.0`
   */
  textAlpha: number;

  /**
   * @defaultValue `'#FFFFFF'`
   */
  textColor: string;
};

/**
 * Define the allowed Entity class types
 */
declare const ENTITY_TYPES: [
  'Actor',
  'ChatMessage',
  'Combat',
  'Item',
  'Folder',
  'JournalEntry',
  'Macro',
  'Playlist',
  'RollTable',
  'Scene',
  'User'
];

/**
 * Define the allowed Entity types which may be dynamically linked in chat
 */
declare const ENTITY_LINK_TYPES: ['Actor', 'Item', 'Scene', 'JournalEntry', 'Macro', 'RollTable'];

/**
 * Define the allowed permission levels for a non-user Entity.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
declare const ENTITY_PERMISSIONS: {
  NONE: 0;
  LIMITED: 1;
  OBSERVER: 2;
  OWNER: 3;
};

/**
 * EULA version number
 */
declare const EULA_VERSION: '0.6.1';

/**
 * Define the allowed Entity types which Folders may contain
 */
declare const FOLDER_ENTITY_TYPES: ['Actor', 'Item', 'Scene', 'JournalEntry', 'RollTable'];

/**
 * The maximum allowed level of depth for Folder nesting
 */
declare const FOLDER_MAX_DEPTH: 3;

/**
 * The minimum allowed grid size which is supported by the software
 */
declare const GRID_MIN_SIZE: 50;

/**
 * The allowed Grid types which are supported by the software
 */
declare const GRID_TYPES: {
  GRIDLESS: 0;
  SQUARE: 1;
  HEXODDR: 2;
  HEXEVENR: 3;
  HEXODDQ: 4;
  HEXEVENQ: 5;
};

/**
 * Enumerate the source types which can be used for an AmbientLight placeable object
 */
declare const SOURCE_TYPES: {
  LOCAL: 'l';
  GLOBAL: 'g';
  UNIVERSAL: 'u';
};

/**
 * An Array of valid MacroAction scope values
 */
declare const MACRO_SCOPES: ['global', 'actors', 'actor'];

/**
 * The allowed playback modes for an audio Playlist
 * DISABLED: The playlist does not play on its own, only individual Sound tracks played as a soundboard
 * SEQUENTIAL: The playlist plays sounds one at a time in sequence
 * SHUFFLE: The playlist plays sounds one at a time in randomized order
 * SIMULTANEOUS: The playlist plays all contained sounds at the same time
 */
declare const PLAYLIST_MODES: {
  DISABLED: -1;
  SEQUENTIAL: 0;
  SHUFFLE: 1;
  SIMULTANEOUS: 2;
};

/**
 * Encode the reasons why a package may be available or unavailable for use
 */
declare const PACKAGE_AVAILABILITY_CODES: {
  UNKNOWN: -1;
  REQUIRES_UPDATE: 0;
  AVAILABLE: 1;
  REQUIRES_SYSTEM: 2;
  REQUIRES_DEPENDENCY: 3;
  REQUIRES_CORE: 4;
};

/**
 * A safe password string which can be displayed
 * @defaultValue `'••••••••••••••••'`
 */
declare const PASSWORD_SAFE_STRING: string;

/**
 * The allowed software update channels
 */
declare const SOFTWARE_UPDATE_CHANNELS: {
  /**
   * @defaultValue `'SETUP.UpdateAlpha'`
   */
  alpha: string;

  /**
   * @defaultValue `'SETUP.UpdateBeta'`
   */
  beta: string;

  /**
   * @defaultValue `'SETUP.UpdateBeta'`
   */
  release: string;
};

/**
 * The default sorting density for manually ordering child objects within a parent
 * @defaultValue `100000`
 */
declare const SORT_INTEGER_DENSITY: number;

/**
 * The allowed types of a TableResult document
 */
declare const TABLE_RESULT_TYPES: {
  TEXT: 0;
  ENTITY: 1;
  COMPENDIUM: 2;
};

/**
 * Define the valid anchor locations for a Tooltip displayed on a Placeable Object
 */
declare const TEXT_ANCHOR_POINTS: {
  BOTTOM: 0;
  CENTER: 1;
  LEFT: 2;
  RIGHT: 3;
  TOP: 4;
};

/**
 * Describe the various thresholds of token control upon which to show certain pieces of information
 * NONE - no information is displayed
 * CONTROL - displayed when the token is controlled
 * OWNER HOVER - displayed when hovered by a GM or a user who owns the actor
 * HOVER - displayed when hovered by any user
 * OWNER - always displayed for a GM or for a user who owns the actor
 * ALWAYS - always displayed for everyone
 */
declare const TOKEN_DISPLAY_MODES: {
  NONE: 0;
  CONTROL: 10;
  OWNER_HOVER: 20;
  HOVER: 30;
  OWNER: 40;
  ALWAYS: 50;
};

/**
 * The allowed Token disposition types
 * HOSTILE - Displayed as an enemy with a red border
 * NEUTRAL - Displayed as neutral with a yellow border
 * FRIENDLY - Displayed as an ally with a cyan border
 */
declare const TOKEN_DISPOSITIONS: {
  HOSTILE: -1;
  NEUTRAL: 0;
  FRIENDLY: 1;
};

/**
 * Define the allowed User permission levels.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
declare const USER_ROLES: {
  NONE: 0;
  PLAYER: 1;
  TRUSTED: 2;
  ASSISTANT: 3;
  GAMEMASTER: 4;
};

/**
 * Invert the User Role mapping to recover role names from a role integer
 */
declare const USER_ROLE_NAMES: { [Key in keyof typeof USER_ROLES as typeof USER_ROLES[Key]]: Key };

/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 * @defaultValue
 * ```typescript
 * [
 *   'image/apng',
 *   'image/bmp',
 *   'image/gif',
 *   'image/jpeg',
 *   'image/png',
 *   'image/svg+xml',
 *   'image/tiff',
 *   'image/webp',
 *   'audio/wave',
 *   'audio/wav',
 *   'audio/webm',
 *   'audio/ogg',
 *   'audio/midi',
 *   'audio/mpeg',
 *   'audio/opus',
 *   'audio/aac',
 *   'video/mpeg',
 *   'video/mp4',
 *   'video/ogg',
 *   'application/json',
 *   'application/ogg',
 *   'application/pdf'
 * ]
 * ```
 */
declare const MEDIA_MIME_TYPES: string[];

/**
 * Define the named actions which users or user roles can be permitted to do.
 * Each key of this Object denotes an action for which permission may be granted (true) or withheld (false)
 */
declare const USER_PERMISSIONS: {
  BROADCAST_AUDIO: {
    /**
     * @defaultValue `'PERMISSION.BroadcastAudio'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.BroadcastAudioHint'`
     */
    hint: string;

    /**
     * @defaultValue `true`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  BROADCAST_VIDEO: {
    /**
     * @defaultValue `'PERMISSION.BroadcastVideo'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.BroadcastVideoHint'`
     */
    hint: string;

    /**
     * @defaultValue `true`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  ACTOR_CREATE: {
    /**
     * @defaultValue `'PERMISSION.ActorCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.ActorCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.ASSISTANT`
     */
    defaultRole: Const.UserRole;
  };

  DRAWING_CREATE: {
    /**
     * @defaultValue `'PERMISSION.DrawingCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.DrawingCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  ITEM_CREATE: {
    /**
     * @defaultValue `'PERMISSION.ItemCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.ItemCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.ASSISTANT`
     */
    defaultRole: Const.UserRole;
  };

  FILES_BROWSE: {
    /**
     * @defaultValue `'PERMISSION.FilesBrowse'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.FilesBrowseHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  FILES_UPLOAD: {
    /**
     * @defaultValue `'PERMISSION.FilesUpload'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.FilesUploadHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.ASSISTANT`
     */
    defaultRole: Const.UserRole;
  };

  JOURNAL_CREATE: {
    /**
     * @defaultValue `'PERMISSION.JournalCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.JournalCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  MACRO_SCRIPT: {
    /**
     * @defaultValue `'PERMISSION.MacroScript'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.MacroScriptHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };

  MESSAGE_WHISPER: {
    /**
     * @defaultValue `'PERMISSION.MessageWhisper'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.MessageWhisperHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };

  SETTINGS_MODIFY: {
    /**
     * @defaultValue `'PERMISSION.SettingsModify'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.SettingsModifyHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.ASSISTANT`
     */
    defaultRole: Const.UserRole;
  };

  SHOW_CURSOR: {
    /**
     * @defaultValue `'PERMISSION.ShowCursor'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.ShowCursorHint'`
     */
    hint: string;

    /**
     * @defaultValue `true`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };

  SHOW_RULER: {
    /**
     * @defaultValue `'PERMISSION.ShowRuler'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.ShowRulerHint'`
     */
    hint: string;

    /**
     * @defaultValue `true`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };

  TEMPLATE_CREATE: {
    /**
     * @defaultValue `'PERMISSION.TemplateCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.TemplateCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };

  TOKEN_CREATE: {
    /**
     * @defaultValue `'PERMISSION.TokenCreate'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.TokenCreateHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: boolean;

    /**
     * @defaultValue `USER_ROLES.ASSISTANT`
     */
    defaultRole: Const.UserRole;
  };

  TOKEN_CONFIGURE: {
    /**
     * @defaultValue `'PERMISSION.TokenConfigure'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.TokenConfigureHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: string;

    /**
     * @defaultValue `USER_ROLES.TRUSTED`
     */
    defaultRole: Const.UserRole;
  };

  WALL_DOORS: {
    /**
     * @defaultValue `'PERMISSION.WallDoors'`
     */
    label: string;

    /**
     * @defaultValue `'PERMISSION.WallDoorsHint'`
     */
    hint: string;

    /**
     * @defaultValue `false`
     */
    disableGM: string;

    /**
     * @defaultValue `USER_ROLES.PLAYER`
     */
    defaultRole: Const.UserRole;
  };
};

/**
 * The allowed directions of effect that a Wall can have
 * BOTH: The wall collides from both directions
 * LEFT: The wall collides only when a ray strikes its left side
 * RIGHT: The wall collides only when a ray strikes its right side
 */
declare const WALL_DIRECTIONS: {
  BOTH: 0;
  LEFT: 1;
  RIGHT: 2;
};

/**
 * The allowed door types which a Wall may contain
 * NONE: The wall does not contain a door
 * DOOR: The wall contains a regular door
 * SECRET: The wall contains a secret door
 */
declare const WALL_DOOR_TYPES: {
  NONE: 0;
  DOOR: 1;
  SECRET: 2;
};

/**
 * The allowed door states which may describe a Wall that contains a door
 * CLOSED: The door is closed
 * OPEN: The door is open
 * LOCKED: The door is closed and locked
 */
declare const WALL_DOOR_STATES: {
  CLOSED: 0;
  OPEN: 1;
  LOCKED: 2;
};

/**
 * The types of movement collision which a Wall may impose
 * NONE: Movement does not collide with this wall
 * NORMAL: Movement collides with this wall
 */
declare const WALL_MOVEMENT_TYPES: {
  NONE: 0;
  NORMAL: 1;
};

/**
 * The types of sensory collision which a Wall may impose
 * NONE: Senses do not collide with this wall
 * NORMAL: Senses collide with this wall
 * LIMITED: Senses collide with the second intersection, bypassing the first
 */
declare const WALL_SENSE_TYPES: {
  NONE: 0;
  NORMAL: 1;
  LIMITED: 2;
};

/**
 * The allowed set of HTML template extensions
 * @defaultValue `['html', 'hbs']`
 */
declare const HTML_FILE_EXTENSIONS: string[];

/**
 * The supported file extensions for image-type files
 * @defaultValue `['jpg', 'jpeg', 'png', 'svg', 'webp']`
 */
declare const IMAGE_FILE_EXTENSIONS: string[];

/**
 * The supported file extensions for video-type files
 * @defaultValue `['mp4', 'ogg', 'webm', 'm4v']`
 */
declare const VIDEO_FILE_EXTENSIONS: string[];

/**
 * The supported file extensions for audio-type files
 * @defaultValue `['flac', 'mp3', 'ogg', 'wav', 'webm']`
 */
declare const AUDIO_FILE_EXTENSIONS: string[];

/**
 * The global CONSTANTS object
 */
declare const CONST: {
  ASCII: typeof ASCII;
  vtt: typeof vtt;
  VTT: typeof VTT;
  WEBSITE_URL: typeof WEBSITE_URL;
  ACTIVE_EFFECT_MODES: typeof ACTIVE_EFFECT_MODES;
  BASE_ENTITY_TYPE: typeof BASE_ENTITY_TYPE;
  CHAT_MESSAGE_TYPES: typeof CHAT_MESSAGE_TYPES;
  COMPENDIUM_ENTITY_TYPES: typeof COMPENDIUM_ENTITY_TYPES;
  CORE_SUPPORTED_LANGUAGES: typeof CORE_SUPPORTED_LANGUAGES;
  DEFAULT_TOKEN: typeof DEFAULT_TOKEN;
  DEFAULT_NOTE_ICON: typeof DEFAULT_NOTE_ICON;
  DICE_ROLL_MODES: typeof DICE_ROLL_MODES;
  DRAWING_DEFAULT_VALUES: typeof DRAWING_DEFAULT_VALUES;
  DRAWING_TYPES: typeof DRAWING_TYPES;
  DRAWING_FILL_TYPES: typeof DRAWING_FILL_TYPES;
  ENTITY_PERMISSIONS: typeof ENTITY_PERMISSIONS;
  ENTITY_TYPES: typeof ENTITY_TYPES;
  ENTITY_LINK_TYPES: typeof ENTITY_LINK_TYPES;
  EULA_VERSION: typeof EULA_VERSION;
  FOLDER_ENTITY_TYPES: typeof FOLDER_ENTITY_TYPES;
  FOLDER_MAX_DEPTH: typeof FOLDER_MAX_DEPTH;
  GRID_MIN_SIZE: typeof GRID_MIN_SIZE;
  GRID_TYPES: typeof GRID_TYPES;
  MACRO_SCOPES: typeof MACRO_SCOPES;
  PLAYLIST_MODES: typeof PLAYLIST_MODES;
  PACKAGE_AVAILABILITY_CODES: typeof PACKAGE_AVAILABILITY_CODES;
  PASSWORD_SAFE_STRING: typeof PASSWORD_SAFE_STRING;
  SOURCE_TYPES: typeof SOURCE_TYPES;
  MEDIA_MIME_TYPES: typeof MEDIA_MIME_TYPES;
  SOFTWARE_UPDATE_CHANNELS: typeof SOFTWARE_UPDATE_CHANNELS;
  SORT_INTEGER_DENSITY: typeof SORT_INTEGER_DENSITY;
  TABLE_RESULT_TYPES: typeof TABLE_RESULT_TYPES;
  TEXT_ANCHOR_POINTS: typeof TEXT_ANCHOR_POINTS;
  TOKEN_DISPLAY_MODES: typeof TOKEN_DISPLAY_MODES;
  TOKEN_DISPOSITIONS: typeof TOKEN_DISPOSITIONS;
  USER_PERMISSIONS: typeof USER_PERMISSIONS;
  USER_ROLES: typeof USER_ROLES;
  USER_ROLE_NAMES: typeof USER_ROLE_NAMES;
  WALL_SENSE_TYPES: typeof WALL_SENSE_TYPES;
  WALL_MOVEMENT_TYPES: typeof WALL_MOVEMENT_TYPES;
  WALL_DOOR_STATES: typeof WALL_DOOR_STATES;
  WALL_DIRECTIONS: typeof WALL_DIRECTIONS;
  WALL_DOOR_TYPES: typeof WALL_DOOR_TYPES;
  HTML_FILE_EXTENSIONS: typeof HTML_FILE_EXTENSIONS;
  IMAGE_FILE_EXTENSIONS: typeof IMAGE_FILE_EXTENSIONS;
  VIDEO_FILE_EXTENSIONS: typeof VIDEO_FILE_EXTENSIONS;
  AUDIO_FILE_EXTENSIONS: typeof AUDIO_FILE_EXTENSIONS;
};

declare namespace Const {
  type ActiveEffectMode = ValueOf<typeof ACTIVE_EFFECT_MODES>;
  type ChatMessageType = ValueOf<typeof CHAT_MESSAGE_TYPES>;
  type DiceRollMode = ValueOf<typeof DICE_ROLL_MODES>;
  type DrawingFillType = ValueOf<typeof DRAWING_FILL_TYPES>;
  type DrawingType = ValueOf<typeof DRAWING_TYPES>;
  type EntityPermission = ValueOf<typeof ENTITY_PERMISSIONS>;
  type GridType = ValueOf<typeof GRID_TYPES>;
  type PackageAvailabilityCode = ValueOf<typeof PACKAGE_AVAILABILITY_CODES>;
  type PlaylistMode = ValueOf<typeof PLAYLIST_MODES>;
  type SoftwareUpdateChannel = ValueOf<typeof SOFTWARE_UPDATE_CHANNELS>;
  type SourceType = ValueOf<typeof SOURCE_TYPES>;
  type TableResultType = ValueOf<typeof TABLE_RESULT_TYPES>;
  type TextAnchorPoint = ValueOf<typeof TEXT_ANCHOR_POINTS>;
  type TokenDisplayMode = ValueOf<typeof TOKEN_DISPLAY_MODES>;
  type TokenDisposition = ValueOf<typeof TOKEN_DISPOSITIONS>;
  type UserRole = ValueOf<typeof USER_ROLES>;
  type UserRoleName = ValueOf<typeof USER_ROLE_NAMES>;
  type WallDirection = ValueOf<typeof WALL_DIRECTIONS>;
  type WallDoorState = ValueOf<typeof WALL_DOOR_STATES>;
  type WallDoorType = ValueOf<typeof WALL_DOOR_TYPES>;
  type WallMovementType = ValueOf<typeof WALL_MOVEMENT_TYPES>;
  type WallSenseType = ValueOf<typeof WALL_SENSE_TYPES>;
}
