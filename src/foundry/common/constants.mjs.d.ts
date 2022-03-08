/**
 * The shortened software name
 */
export const vtt: 'Foundry VTT';

/**
 * The full software name
 */
export const VTT: 'Foundry Virtual Tabletop';

/**
 * The software website URL
 */
export const WEBSITE_URL: 'https://foundryvtt.com';

/**
 * An ASCII greeting displayed to the client
 */
export const ASCII = `_______________________________________________________________
 _____ ___  _   _ _   _ ____  ______   __ __     _______ _____
|  ___/ _ \\| | | | \\ | |  _ \\|  _ \\ \\ / / \\ \\   / |_   _|_   _|
| |_ | | | | | | |  \\| | | | | |_) \\ V /   \\ \\ / /  | |   | |
|  _|| |_| | |_| | |\\  | |_| |  _ < | |     \\ V /   | |   | |
|_|   \\___/ \\___/|_| \\_|____/|_| \\_\\|_|      \\_/    |_|   |_|
===============================================================`;

/**
 * Define the allowed ActiveEffect application modes
 */
export const ACTIVE_EFFECT_MODES: Readonly<{
  CUSTOM: 0;
  MULTIPLY: 1;
  ADD: 2;
  DOWNGRADE: 3;
  UPGRADE: 4;
  OVERRIDE: 5;
}>;
export type ACTIVE_EFFECT_MODES = ValueOf<typeof ACTIVE_EFFECT_MODES>;

/**
 * Define the string name used for the base document type when specific sub-types are not defined by the system
 */
export const BASE_DOCUMENT_TYPE: 'base';

/**
 * Define the methods by which a Card can be drawn from a Cards stack
 * TOP and FIRST are synonymous, as are BOTTOM and LAST.
 */
export const CARD_DRAW_MODES: Readonly<{
  FIRST: 0;
  TOP: 0;
  LAST: 1;
  BOTTOM: 1;
  RANDOM: 2;
}>;
export type CARD_DRAW_MODES = ValueOf<typeof CARD_DRAW_MODES>;

/**
 * An enumeration of canvas performance modes.
 */
export const CANVAS_PERFORMANCE_MODES: Readonly<{
  LOW: 0;
  MED: 1;
  HIGH: 2;
  MAX: 3;
}>;
export type CANVAS_PERFORMANCE_MODES = ValueOf<typeof CANVAS_PERFORMANCE_MODES>;

/**
 * Valid Chat Message types
 */
export const CHAT_MESSAGE_TYPES: Readonly<{
  OTHER: 0;
  OOC: 1;
  IC: 2;
  EMOTE: 3;
  WHISPER: 4;
  ROLL: 5;
}>;
export type CHAT_MESSAGE_TYPES = ValueOf<typeof CHAT_MESSAGE_TYPES>;

/**
 * Define the set of languages which have built-in support in the core software
 */
export const CORE_SUPPORTED_LANGUAGES: readonly ['en'];

/**
 * The default artwork used for Token images if none is provided
 */
export const DEFAULT_TOKEN: 'icons/svg/mystery-man.svg';

/**
 * The default artwork used for Note placeables if none is provided
 * @deprecated since v9, use NoteData.DEFAULT_ICON instead.
 */
export const DEFAULT_NOTE_ICON: 'icons/svg/book.svg';

/**
 * The default icon image used for Macro documents if no other image is provided
 * @deprecated since v9, use MacroData.DEFAULT_ICON instead.
 */
export const DEFAULT_MACRO_ICON: 'icons/svg/dice-target.svg';

/**
 * Define the allowed Document class types.
 */
export const DOCUMENT_TYPES: readonly [
  'Actor',
  'Cards',
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
export type DOCUMENT_TYPES = ValueOf<typeof DOCUMENT_TYPES>;

/**
 * The allowed Document types which may exist within a Compendium pack.
 */
export const COMPENDIUM_DOCUMENT_TYPES: readonly [
  'Actor',
  'Cards',
  'Item',
  'JournalEntry',
  'Macro',
  'Playlist',
  'RollTable',
  'Scene',
  'Adventure'
];
export type COMPENDIUM_DOCUMENT_TYPES = ValueOf<typeof COMPENDIUM_DOCUMENT_TYPES>;

/**
 * Define the allowed permission levels for a non-user Document.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
export const DOCUMENT_PERMISSION_LEVELS: Readonly<{
  NONE: 0;
  LIMITED: 1;
  OBSERVER: 2;
  OWNER: 3;
}>;
export type DOCUMENT_PERMISSION_LEVELS = ValueOf<typeof DOCUMENT_PERMISSION_LEVELS>;

/**
 * Define the allowed Document types which may be dynamically linked in chat
 */
export const DOCUMENT_LINK_TYPES: readonly [
  'Actor',
  'Cards',
  'Item',
  'Scene',
  'JournalEntry',
  'Macro',
  'RollTable',
  'PlaylistSound'
];
export type DOCUMENT_LINK_TYPES = ValueOf<typeof DOCUMENT_LINK_TYPES>;

/**
 * The supported dice roll visibility modes
 */
export const DICE_ROLL_MODES: Readonly<{
  PUBLIC: 'publicroll';
  PRIVATE: 'gmroll';
  BLIND: 'blindroll';
  SELF: 'selfroll';
}>;
export type DICE_ROLL_MODES = ValueOf<typeof DICE_ROLL_MODES>;

/**
 * The allowed Drawing types which may be saved
 */
export const DRAWING_TYPES: Readonly<{
  RECTANGLE: 'r';
  ELLIPSE: 'e';
  TEXT: 't';
  POLYGON: 'p';
  FREEHAND: 'f';
}>;
export type DRAWING_TYPES = ValueOf<typeof DRAWING_TYPES>;

/**
 * The allowed fill types which a Drawing object may display
 * NONE: The drawing is not filled
 * SOLID: The drawing is filled with a solid color
 * PATTERN: The drawing is filled with a tiled image pattern
 */
export const DRAWING_FILL_TYPES: Readonly<{
  NONE: 0;
  SOLID: 1;
  PATTERN: 2;
}>;
export type DRAWING_FILL_TYPES = ValueOf<typeof DRAWING_FILL_TYPES>;

/**
 * Define the allowed Document types which Folders may contain
 */
export const FOLDER_DOCUMENT_TYPES: readonly [
  'Actor',
  'Item',
  'Scene',
  'JournalEntry',
  'Playlist',
  'RollTable',
  'Cards',
  'Macro'
];
export type FOLDER_DOCUMENT_TYPES = ValueOf<typeof FOLDER_DOCUMENT_TYPES>;

/**
 * The maximum allowed level of depth for Folder nesting
 */
export const FOLDER_MAX_DEPTH: 3;

/**
 * A list of allowed game URL names
 */
export const GAME_VIEWS: readonly ['game', 'stream'];

/**
 * The minimum allowed grid size which is supported by the software
 */
export const GRID_MIN_SIZE: 50;

/**
 * The allowed Grid types which are supported by the software
 */
export const GRID_TYPES: Readonly<{
  GRIDLESS: 0;
  SQUARE: 1;
  HEXODDR: 2;
  HEXEVENR: 3;
  HEXODDQ: 4;
  HEXEVENQ: 5;
}>;
export type GRID_TYPES = ValueOf<typeof GRID_TYPES>;

/**
 * A list of supported setup URL names
 */
export const SETUP_VIEWS: readonly ['license', 'setup', 'players', 'join', 'auth'];

/**
 * An Array of valid MacroAction scope values
 */
export const MACRO_SCOPES: readonly ['global', 'actors', 'actor'];
export type MACRO_SCOPES = ValueOf<typeof MACRO_SCOPES>;

/**
 * An enumeration of valid Macro types
 */
export const MACRO_TYPES: Readonly<{
  SCRIPT: 'script';
  CHAT: 'chat';
}>;
export type MACRO_TYPES = ValueOf<typeof MACRO_TYPES>;

/**
 * The allowed playback modes for an audio Playlist
 * DISABLED: The playlist does not play on its own, only individual Sound tracks played as a soundboard
 * SEQUENTIAL: The playlist plays sounds one at a time in sequence
 * SHUFFLE: The playlist plays sounds one at a time in randomized order
 * SIMULTANEOUS: The playlist plays all contained sounds at the same time
 */
export const PLAYLIST_MODES: Readonly<{
  DISABLED: -1;
  SEQUENTIAL: 0;
  SHUFFLE: 1;
  SIMULTANEOUS: 2;
}>;
export type PLAYLIST_MODES = ValueOf<typeof PLAYLIST_MODES>;

/**
 * The available sort modes for an audio Playlist.
 * ALPHABETICAL (default): Sort sounds alphabetically.
 * MANUAL: Sort sounds by manual drag-and-drop.
 */
export const PLAYLIST_SORT_MODES: Readonly<{
  ALPHABETICAL: 'a';
  MANUAL: 'm';
}>;
export type PLAYLIST_SORT_MODES = ValueOf<typeof PLAYLIST_SORT_MODES>;

/**
 * The allowed package types
 */
export const PACKAGE_TYPES: readonly ['world', 'system', 'module'];
export type PACKAGE_TYPES = ValueOf<typeof PACKAGE_TYPES>;

/**
 * Encode the reasons why a package may be available or unavailable for use
 */
export const PACKAGE_AVAILABILITY_CODES: Readonly<{
  UNKNOWN: -1;
  REQUIRES_UPDATE: 0;
  AVAILABLE: 1;
  REQUIRES_SYSTEM: 2;
  REQUIRES_DEPENDENCY: 3;
  REQUIRES_CORE: 4;
}>;
export type PACKAGE_AVAILABILITY_CODES = ValueOf<typeof PACKAGE_AVAILABILITY_CODES>;

/**
 * A safe password string which can be displayed
 */
export const PASSWORD_SAFE_STRING: '••••••••••••••••';

/**
 * The allowed software update channels
 */
export const SOFTWARE_UPDATE_CHANNELS: Readonly<{
  stable: 'SETUP.UpdateStable';
  testing: 'SETUP.UpdateTesting';
  development: 'SETUP.UpdateDevelopment';
  prototype: 'SETUP.UpdatePrototype';
}>;
export type SOFTWARE_UPDATE_CHANNELS = ValueOf<typeof SOFTWARE_UPDATE_CHANNELS>;

/**
 * The default sorting density for manually ordering child objects within a parent
 */
export const SORT_INTEGER_DENSITY: 100000;

/**
 * The allowed types of a TableResult document
 */
declare const tableResultTypes: Readonly<{
  TEXT: 0;
  DOCUMENT: 1;
  COMPENDIUM: 2;
  /**
   * @deprecated TABLE_RESULT_TYPES.ENTITY is deprecated. Please use TABLE_RESULT_TYPES.DOCUMENT instead.
   */
  get ENTITY(): 1;
}>;

/**
 * The allowed types of a TableResult document
 */
export const TABLE_RESULT_TYPES: typeof tableResultTypes;
export type TABLE_RESULT_TYPES = ValueOf<typeof TABLE_RESULT_TYPES>;

/**
 * Define the valid anchor locations for a Tooltip displayed on a Placeable Object
 */
export const TEXT_ANCHOR_POINTS: Readonly<{
  CENTER: 0;
  BOTTOM: 1;
  TOP: 2;
  LEFT: 3;
  RIGHT: 4;
}>;
export type TEXT_ANCHOR_POINTS = ValueOf<typeof TEXT_ANCHOR_POINTS>;

/**
 * Define the valid occlusion modes which an overhead tile can use
 */
export const TILE_OCCLUSION_MODES: Readonly<{
  NONE: 0;
  FADE: 1;
  ROOF: 2;
  RADIAL: 3;
}>;
export type TILE_OCCLUSION_MODES = ValueOf<typeof TILE_OCCLUSION_MODES>;

/**
 * Describe the various thresholds of token control upon which to show certain pieces of information
 * NONE - no information is displayed
 * CONTROL - displayed when the token is controlled
 * OWNER HOVER - displayed when hovered by a GM or a user who owns the actor
 * HOVER - displayed when hovered by any user
 * OWNER - always displayed for a GM or for a user who owns the actor
 * ALWAYS - always displayed for everyone
 */
export const TOKEN_DISPLAY_MODES: Readonly<{
  NONE: 0;
  CONTROL: 10;
  OWNER_HOVER: 20;
  HOVER: 30;
  OWNER: 40;
  ALWAYS: 50;
}>;
export type TOKEN_DISPLAY_MODES = ValueOf<typeof TOKEN_DISPLAY_MODES>;

/**
 * The allowed Token disposition types
 * HOSTILE - Displayed as an enemy with a red border
 * NEUTRAL - Displayed as neutral with a yellow border
 * FRIENDLY - Displayed as an ally with a cyan border
 */
export const TOKEN_DISPOSITIONS: Readonly<{
  HOSTILE: -1;
  NEUTRAL: 0;
  FRIENDLY: 1;
}>;
export type TOKEN_DISPOSITIONS = ValueOf<typeof TOKEN_DISPOSITIONS>;

/**
 * Define the allowed User permission levels.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
export const USER_ROLES: Readonly<{
  NONE: 0;
  PLAYER: 1;
  TRUSTED: 2;
  ASSISTANT: 3;
  GAMEMASTER: 4;
}>;
export type USER_ROLES = ValueOf<typeof USER_ROLES>;

/**
 * Invert the User Role mapping to recover role names from a role integer
 */
export const USER_ROLE_NAMES: Readonly<{ [Key in keyof typeof USER_ROLES as typeof USER_ROLES[Key]]: Key }>;
export type USER_ROLE_NAMES = ValueOf<typeof USER_ROLE_NAMES>;

/**
 * An enumeration of the allowed types for a MeasuredTemplate embedded document
 */
export const MEASURED_TEMPLATE_TYPES: Readonly<{
  CIRCLE: 'circle';
  CONE: 'cone';
  RECTANGLE: 'rect';
  RAY: 'ray';
}>;
export type MEASURED_TEMPLATE_TYPES = ValueOf<typeof MEASURED_TEMPLATE_TYPES>;

export interface UserCapability {
  disableGM: boolean;
  hint: string;
  label: string;
  defaultRole: USER_ROLES;
}

/**
 * Define the recognized User capabilities which individual Users or role levels may be permitted to perform
 */
export const USER_PERMISSIONS: Readonly<{
  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.ActorCreate",
   *    hint: "PERMISSION.ActorCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  ACTOR_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.BroadcastAudio",
   *    hint: "PERMISSION.BroadcastAudioHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  BROADCAST_AUDIO: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.BroadcastVideo",
   *    hint: "PERMISSION.BroadcastVideoHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  BROADCAST_VIDEO: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.DrawingCreate",
   *    hint: "PERMISSION.DrawingCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  DRAWING_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.ItemCreate",
   *    hint: "PERMISSION.ItemCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  ITEM_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.FilesBrowse",
   *    hint: "PERMISSION.FilesBrowseHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  FILES_BROWSE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.FilesUpload",
   *    hint: "PERMISSION.FilesUploadHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  FILES_UPLOAD: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.JournalCreate"
   *    hint: "PERMISSION.JournalCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  JOURNAL_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.MacroScript",
   *    hint: "PERMISSION.MacroScriptHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  MACRO_SCRIPT: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.MessageWhisper",
   *    hint: "PERMISSION.MessageWhisperHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  MESSAGE_WHISPER: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.NoteCreate",
   *    hint: "PERMISSION.NoteCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  NOTE_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.SettingsModify",
   *    hint: "PERMISSION.SettingsModifyHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  SETTINGS_MODIFY: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.ShowCursor",
   *    hint: "PERMISSION.ShowCursorHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  SHOW_CURSOR: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.ShowRuler",
   *    hint: "PERMISSION.ShowRulerHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  SHOW_RULER: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.TemplateCreate",
   *    hint: "PERMISSION.TemplateCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  TEMPLATE_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.TokenCreate",
   *    hint: "PERMISSION.TokenCreateHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  TOKEN_CREATE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.TokenConfigure",
   *    hint: "PERMISSION.TokenConfigureHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  TOKEN_CONFIGURE: UserCapability;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.WallDoors",
   *    hint: "PERMISSION.WallDoorsHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  WALL_DOORS: UserCapability;
}>;

/**
 * The allowed directions of effect that a Wall can have
 * BOTH: The wall collides from both directions
 * LEFT: The wall collides only when a ray strikes its left side
 * RIGHT: The wall collides only when a ray strikes its right side
 */
export const WALL_DIRECTIONS: Readonly<{
  BOTH: 0;
  LEFT: 1;
  RIGHT: 2;
}>;
export type WALL_DIRECTIONS = ValueOf<typeof WALL_DIRECTIONS>;

/**
 * The allowed door types which a Wall may contain
 * NONE: The wall does not contain a door
 * DOOR: The wall contains a regular door
 * SECRET: The wall contains a secret door
 */
export const WALL_DOOR_TYPES: Readonly<{
  NONE: 0;
  DOOR: 1;
  SECRET: 2;
}>;
export type WALL_DOOR_TYPES = ValueOf<typeof WALL_DOOR_TYPES>;

/**
 * The allowed door states which may describe a Wall that contains a door
 * CLOSED: The door is closed
 * OPEN: The door is open
 * LOCKED: The door is closed and locked
 */
export const WALL_DOOR_STATES: Readonly<{
  CLOSED: 0;
  OPEN: 1;
  LOCKED: 2;
}>;
export type WALL_DOOR_STATES = ValueOf<typeof WALL_DOOR_STATES>;

/**
 * The wall properties which restrict the way interaction occurs with a specific wall
 */
export const WALL_RESTRICTION_TYPES: readonly ['light', 'sight', 'sound', 'move'];
export type WALL_RESTRICTION_TYPES = ValueOf<typeof WALL_RESTRICTION_TYPES>;

/**
 * The types of sensory collision which a Wall may impose
 * NONE: Senses do not collide with this wall
 * NORMAL: Senses collide with this wall
 * LIMITED: Senses collide with the second intersection, bypassing the first
 */
export const WALL_SENSE_TYPES: Readonly<{
  NONE: 0;
  LIMITED: 10;
  NORMAL: 20;
}>;
export type WALL_SENSE_TYPES = ValueOf<typeof WALL_SENSE_TYPES>;

/**
 * The types of movement collision which a Wall may impose
 * NONE: Movement does not collide with this wall
 * NORMAL: Movement collides with this wall
 */
export const WALL_MOVEMENT_TYPES: Readonly<{
  NONE: typeof WALL_SENSE_TYPES.NONE;
  NORMAL: typeof WALL_SENSE_TYPES.NORMAL;
}>;
export type WALL_MOVEMENT_TYPES = ValueOf<typeof WALL_MOVEMENT_TYPES>;

/**
 * The possible precedence values a Keybinding might run in
 * PRIORITY: Runs in the first group along with other PRIORITY keybindings
 * NORMAL: Runs after the PRIORITY group along with other NORMAL keybindings
 * DEFERRED: Runs in the last group along with other DEFERRED keybindings
 */
export const KEYBINDING_PRECEDENCE: Readonly<{
  PRIORITY: 0;
  NORMAL: 1;
  DEFERRED: 2;
}>;
export type KEYBINDING_PRECEDENCE = ValueOf<typeof KEYBINDING_PRECEDENCE>;

/**
 * The allowed set of HTML template extensions
 */
export const HTML_FILE_EXTENSIONS: readonly ['html', 'handlebars', 'hbs'];

/**
 * The supported file extensions for image-type files, and their corresponding mime types.
 */
export const IMAGE_FILE_EXTENSIONS: Readonly<{
  apng: 'image/apng';
  avif: 'image/avif';
  bmp: 'image/bmp';
  gif: 'image/gif';
  jpg: 'image/jpeg';
  jpeg: 'image/jpeg';
  png: 'image/png';
  svg: 'image/svg+xml';
  tiff: 'image/tiff';
  webp: 'image/webp';
}>;
export type IMAGE_FILE_EXTENSIONS = ValueOf<typeof IMAGE_FILE_EXTENSIONS>;

/**
 * The supported file extensions for video-type files, and their corresponding mime types.
 */
export const VIDEO_FILE_EXTENSIONS: Readonly<{
  m4v: 'video/mp4';
  mp4: 'video/mp4';
  ogg: 'video/ogg';
  webm: 'video/webm';
}>;
export type VIDEO_FILE_EXTENSIONS = ValueOf<typeof VIDEO_FILE_EXTENSIONS>;

/**
 * The supported file extensions for audio-type files, and their corresponding mime types.
 */
export const AUDIO_FILE_EXTENSIONS: Readonly<{
  aac: 'audio/aac';
  flac: 'audio/flac';
  m4a: 'audio/mp4';
  mid: 'audio/midi';
  mp3: 'audio/mpeg';
  ogg: 'audio/ogg';
  opus: 'audio/opus';
  wav: 'audio/wav';
  webm: 'audio/webm';
}>;
export type AUDIO_FILE_EXTENSIONS = ValueOf<typeof AUDIO_FILE_EXTENSIONS>;

/**
 * The supported file extensions for text files, and their corresponding mime types.
 */
export const TEXT_FILE_EXTENSIONS: Readonly<{
  json: 'application/json';
  md: 'text/markdown';
  pdf: 'application/pdf';
  txt: 'text/plain';
  xml: 'application/xml';
}>;
export type TEXT_FILE_EXTENSIONS = ValueOf<typeof TEXT_FILE_EXTENSIONS>;

/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 */
export const MEDIA_MIME_TYPES: readonly [
  'image/apng',
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'video/mp4',
  'video/mp4',
  'video/ogg',
  'video/webm',
  'audio/aac',
  'audio/flac',
  'audio/mp4',
  'audio/midi',
  'audio/mpeg',
  'audio/ogg',
  'audio/opus',
  'audio/wav',
  'audio/webm',
  'application/json',
  'text/markdown',
  'application/pdf',
  'text/plain'
];

/**
 * Stores shared commonly used timeouts, measured in MS
 */
export const TIMEOUTS: Readonly<{
  FOUNDRY_WEBSITE: 10000;
  PACKAGE_REPOSITORY: 5000;
  IP_DISCOVERY: 5000;
}>;
export type TIMEOUTS = ValueOf<typeof TIMEOUTS>;

/**
 * Enumerate the source types which can be used for an AmbientLight placeable object
 * @deprecated since v9
 */
export const SOURCE_TYPES: Readonly<{
  LOCAL: 'l';
  GLOBAL: 'g';
  UNIVERSAL: 'u';
}>;
/**
 * Enumerate the source types which can be used for an AmbientLight placeable object
 * @deprecated since v9
 */
export type SOURCE_TYPES = ValueOf<typeof SOURCE_TYPES>;

/**
 * Define the allowed Entity class types
 * @deprecated since v9 - use CONST.DOCUMENT_TYPES instead.
 */
export const ENTITY_TYPES: typeof DOCUMENT_TYPES;
/**
 * Define the allowed Entity class types
 * @deprecated since v9 - use CONST.DOCUMENT_TYPES instead.
 */
export type ENTITY_TYPES = ValueOf<typeof ENTITY_TYPES>;

/**
 * Define the allowed Document types which Folders may contain
 * @deprecated since v9 - use CONST.FOLDER_DOCUMENT_TYPES instead.
 */
export const FOLDER_ENTITY_TYPES: typeof FOLDER_DOCUMENT_TYPES;
/**
 * Define the allowed Document types which Folders may contain
 * @deprecated since v9 - use CONST.FOLDER_DOCUMENT_TYPES instead.
 */
export type FOLDER_ENTITY_TYPES = ValueOf<typeof FOLDER_ENTITY_TYPES>;

/**
 * Define the allowed permission levels for a non-user Entity.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 * @deprecated since v9 - use CONST.DOCUMENT_PERMISSION_LEVELS instead.
 */
export const ENTITY_PERMISSIONS: typeof DOCUMENT_PERMISSION_LEVELS;
/**
 * Define the allowed permission levels for a non-user Entity.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 * @deprecated since v9 - use CONST.DOCUMENT_PERMISSION_LEVELS instead.
 */
export type ENTITY_PERMISSIONS = ValueOf<typeof ENTITY_PERMISSIONS>;

/**
 * Define the allowed Entity types which may be dynamically linked in chat
 * @deprecated since v9 - use CONST.DOCUMENT_LINK_TYPES instead.
 */
export const ENTITY_LINK_TYPES: typeof DOCUMENT_LINK_TYPES;
/**
 * Define the allowed Entity types which may be dynamically linked in chat
 * @deprecated since v9 - use CONST.DOCUMENT_LINK_TYPES instead.
 */
export type ENTITY_LINK_TYPES = ValueOf<typeof ENTITY_LINK_TYPES>;

/**
 * The allowed Entity types which may exist within a Compendium pack
 * This is a subset of ENTITY_TYPES
 * @deprecated sinve v9 - use CONST.COMPENDIUM_DOCUMENT_TYPES instead.
 */
export const COMPENDIUM_ENTITY_TYPES: typeof COMPENDIUM_DOCUMENT_TYPES;
/**
 * The allowed Entity types which may exist within a Compendium pack
 * This is a subset of ENTITY_TYPES
 * @deprecated sinve v9 - use CONST.COMPENDIUM_DOCUMENT_TYPES instead.
 */
export type COMPENDIUM_ENTITY_TYPES = ValueOf<typeof COMPENDIUM_ENTITY_TYPES>;
