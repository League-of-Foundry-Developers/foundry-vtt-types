// FOUNDRY_VERSION: 10.291

/**
 * The shortened software name
 */
export const vtt: "Foundry VTT";

/**
 * The full software name
 */
export const VTT: "Foundry Virtual Tabletop";

/**
 * The software website URL
 */
export const WEBSITE_URL: "https://foundryvtt.com";

/**
 * The serverless API URL
 */
export const WEBSITE_API_URL: "https://api.foundryvtt.com";

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
 * @remarks
 * Other arbitrary mode numbers can be used by systems and modules to identify special behaviors and are ignored
 */
export const ACTIVE_EFFECT_MODES: Readonly<{
  /**
   * Used to denote that the handling of the effect is programmatically provided by a system or module.
   */
  CUSTOM: 0;

  /**
   * Multiplies a numeric base value by the numeric effect value
   * @example
   * 2 (base value) * 3 (effect value) = 6 (derived value)
   */
  MULTIPLY: 1;

  /**
   * Adds a numeric base value to a numeric effect value, or concatenates strings
   * @example
   * 2 (base value) + 3 (effect value) = 5 (derived value)
   * @example
   * "Hello" (base value) + " World" (effect value) = "Hello World"
   */
  ADD: 2;

  /**
   * Keeps the lower value of the base value and the effect value
   * @example
   * 2 (base value), 0 (effect value) = 0 (derived value)
   * @example
   * 2 (base value), 3 (effect value) = 2 (derived value)
   */
  DOWNGRADE: 3;

  /**
   * Keeps the greater value of the base value and the effect value
   * @example
   * 2 (base value), 4 (effect value) = 4 (derived value)
   * @example
   * 2 (base value), 1 (effect value) = 2 (derived value)
   */
  UPGRADE: 4;

  /**
   * Directly replaces the base value with the effect value
   * @example
   * 2 (base value), 4 (effect value) = 4 (derived value)
   */
  OVERRIDE: 5;
}>;
export type ACTIVE_EFFECT_MODES = ValueOf<typeof ACTIVE_EFFECT_MODES>;

/**
 * Define the string name used for the base document type when specific sub-types are not defined by the system
 */
export const BASE_DOCUMENT_TYPE: "base";

/**
 * Define the methods by which a Card can be drawn from a Cards stack
 */
export const CARD_DRAW_MODES: Readonly<{
  /**
   * Draw the first card from the stack
   * Synonymous with {@link CARD_DRAW_MODES.TOP}
   */
  FIRST: 0;

  /**
   * Draw the top card from the stack
   * Synonymous with {@link CARD_DRAW_MODES.FIRST}
   */
  TOP: 0;

  /**
   * Draw the last card from the stack
   * Synonymous with {@link CARD_DRAW_MODES.BOTTOM}
   */
  LAST: 1;

  /**
   * Draw the bottom card from the stack
   * Synonymous with {@link CARD_DRAW_MODES.LAST}
   */
  BOTTOM: 1;

  /**
   * Draw a random card from the stack
   */
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
  /**
   * An uncategorized chat message
   */
  OTHER: 0;

  /**
   * The message is spoken out of character (OOC).
   * OOC messages will be outlined by the player's color to make them more easily recognizable.
   */
  OOC: 1;

  /**
   * The message is spoken by an associated character.
   */
  IC: 2;

  /**
   * The message is an emote performed by the selected character.
   * Entering "/emote waves his hand." while controlling a character named Simon will send the message, "Simon waves his hand."
   */
  EMOTE: 3;

  /**
   * A message whispered to the target.
   * If the user sending the message does not have the "Private Messages" permission, Gamemasters will be able to see the content of the message even if they were not a recipient.
   * If the whisper's target is a character, the whisper will be sent to whoever controls the token.
   */
  WHISPER: 4;

  /**
   * A message that is a dice roll.
   */
  ROLL: 5;
}>;
export type CHAT_MESSAGE_TYPES = ValueOf<typeof CHAT_MESSAGE_TYPES>;

/**
 * Define the set of languages which have built-in support in the core software
 */
export const CORE_SUPPORTED_LANGUAGES: readonly ["en"];

/**
 * Configure the severity of compatibility warnings.
 */
export const COMPATIBILITY_MODES: Readonly<{
  /**
   * Nothing will be logged
   */
  SILENT: 0;

  /**
   * A message will be logged at the "warn" level
   */
  WARNING: 1;

  /**
   * A message will be logged at the "error" level
   */
  ERROR: 2;

  /**
   * An Error will be thrown
   */
  FAILURE: 3;
}>;
export type COMPATIBILITY_MODES = ValueOf<typeof COMPATIBILITY_MODES>;

/**
 * The default artwork used for Token images if none is provided
 */
export const DEFAULT_TOKEN: "icons/svg/mystery-man.svg";

/**
 * Define the allowed Document class types.
 */
export const DOCUMENT_TYPES: readonly [
  "Actor",
  "Cards",
  "ChatMessage",
  "Combat",
  "Item",
  "Folder",
  "JournalEntry",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
  "User"
];
export type DOCUMENT_TYPES = ValueOf<typeof DOCUMENT_TYPES>;

/**
 * The allowed Document types which may exist within a Compendium pack.
 */
export const COMPENDIUM_DOCUMENT_TYPES: readonly [
  "Actor",
  "Cards",
  "Item",
  "JournalEntry",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
  "Adventure"
];
export type COMPENDIUM_DOCUMENT_TYPES = ValueOf<typeof COMPENDIUM_DOCUMENT_TYPES>;

/**
 * Define the allowed ownership levels for a Document.
 * Each level is assigned a value in ascending order.
 * Higher levels grant more permissions.
 * @see https://foundryvtt.com/article/users/
 */
export const DOCUMENT_OWNERSHIP_LEVELS: Readonly<{
  /**
   * The User inherits permissions from the parent Folder.
   */
  INHERIT: -1;

  /**
   * Restricts the associated Document so that it may not be seen by this User.
   */
  NONE: 0;

  /**
   * Allows the User to interact with the Document in basic ways, allowing them to see it in sidebars and see only limited aspects of its contents. The limits of this interaction are defined by the game system being used.
   */
  LIMITED: 1;

  /**
   * Allows the User to view this Document as if they were owner, but prevents them from making any changes to it.
   */
  OBSERVER: 2;

  /**
   * Allows the User to view and make changes to the Document as its owner. Owned documents cannot be deleted by anyone other than a gamemaster level User.
   */
  OWNER: 3;
}>;
export type DOCUMENT_OWNERSHIP_LEVELS = ValueOf<typeof DOCUMENT_OWNERSHIP_LEVELS>;

/**
 * Meta ownership levels that are used in the UI but never stored.
 */
export const DOCUMENT_META_OWNERSHIP_LEVELS: Readonly<{
  DEFAULT: -20;
  NOCHANGE: -10;
}>;
export type DOCUMENT_META_OWNERSHIP_LEVELS = ValueOf<typeof DOCUMENT_META_OWNERSHIP_LEVELS>;

/**
 * @deprecated since v10
 * @see CONST.DOCUMENT_OWNERSHIP_LEVELS
 */
export const DOCUMENT_PERMISSION_LEVELS: typeof DOCUMENT_OWNERSHIP_LEVELS;
export type DOCUMENT_PERMISSION_LEVELS = DOCUMENT_OWNERSHIP_LEVELS;

/**
 * Define the allowed Document types which may be dynamically linked in chat
 */
export const DOCUMENT_LINK_TYPES: readonly [
  "Actor",
  "Cards",
  "Item",
  "Scene",
  "JournalEntry",
  "Macro",
  "RollTable",
  "PlaylistSound"
];
export type DOCUMENT_LINK_TYPES = ValueOf<typeof DOCUMENT_LINK_TYPES>;

/**
 * The supported dice roll visibility modes
 * @see https://foundryvtt.com/article/dice/
 */
export const DICE_ROLL_MODES: Readonly<{
  /**
   * This roll is visible to all players.
   */
  PUBLIC: "publicroll";

  /**
   * Rolls of this type are only visible to the player that rolled and any Game Master users.
   */
  PRIVATE: "gmroll";

  /**
   * A private dice roll only visible to Game Master users. The rolling player will not see the result of their own roll.
   */
  BLIND: "blindroll";

  /**
   * A private dice roll which is only visible to the user who rolled it.
   */
  SELF: "selfroll";
}>;
export type DICE_ROLL_MODES = ValueOf<typeof DICE_ROLL_MODES>;

/**
 * The allowed fill types which a Drawing object may display
 * @see https://foundryvtt.com/article/drawings/
 */
export const DRAWING_FILL_TYPES: Readonly<{
  /**
   * The drawing is not filled
   */
  NONE: 0;

  /**
   * The drawing is filled with a solid color
   */
  SOLID: 1;

  /**
   * The drawing is filled with a tiled image pattern
   */
  PATTERN: 2;
}>;
export type DRAWING_FILL_TYPES = ValueOf<typeof DRAWING_FILL_TYPES>;

/**
 * Define the allowed Document types which Folders may contain
 */
export const FOLDER_DOCUMENT_TYPES: readonly [
  "Actor",
  "Item",
  "Scene",
  "JournalEntry",
  "Playlist",
  "RollTable",
  "Cards",
  "Macro"
];
export type FOLDER_DOCUMENT_TYPES = ValueOf<typeof FOLDER_DOCUMENT_TYPES>;

/**
 * The maximum allowed level of depth for Folder nesting
 */
export const FOLDER_MAX_DEPTH: 3;

/**
 * A list of allowed game URL names
 */
export const GAME_VIEWS: readonly ["game", "stream"];

/**
 * The minimum allowed grid size which is supported by the software
 */
export const GRID_MIN_SIZE: 50;

/**
 * The allowed Grid types which are supported by the software
 * @see https://foundryvtt.com/article/scenes/
 */
export const GRID_TYPES: Readonly<{
  /**
   * No fixed grid is used on this Scene allowing free-form point-to-point measurement without grid lines.
   */
  GRIDLESS: 0;

  /**
   * A square grid is used with width and height of each grid space equal to the chosen grid size.
   */
  SQUARE: 1;

  /**
   * A column-wise hexagon grid (flat-topped) where odd-numbered rows are offset.
   */
  HEXODDR: 2;

  /**
   * A column-wise hexagon grid (flat-topped) where even-numbered rows are offset.
   */
  HEXEVENR: 3;

  /**
   * A row-wise hexagon grid (pointy-topped) where odd-numbered columns are offset.
   */
  HEXODDQ: 4;

  /**
   * A row-wise hexagon grid (pointy-topped) where even-numbered columns are offset.
   */
  HEXEVENQ: 5;
}>;
export type GRID_TYPES = ValueOf<typeof GRID_TYPES>;

/**
 * A list of supported setup URL names
 */
export const SETUP_VIEWS: readonly ["license", "setup", "players", "join", "auth"];

/**
 * An Array of valid MacroAction scope values
 */
export const MACRO_SCOPES: readonly ["global", "actors", "actor"];
export type MACRO_SCOPES = ValueOf<typeof MACRO_SCOPES>;

/**
 * An enumeration of valid Macro types
 * @see https://foundryvtt.com/article/macros/
 */
export const MACRO_TYPES: Readonly<{
  /**
   * Complex and powerful macros which leverage the FVTT API through plain JavaScript to perform functions as simple or as advanced as you can imagine.
   */
  SCRIPT: "script";

  /**
   * Simple and easy to use, chat macros post pre-defined chat messages to the chat log when executed. All users can execute chat macros by default.
   */
  CHAT: "chat";
}>;
export type MACRO_TYPES = ValueOf<typeof MACRO_TYPES>;

/**
 * The allowed playback modes for an audio Playlist
 * @see https://foundryvtt.com/article/playlists/
 */
export const PLAYLIST_MODES: Readonly<{
  /**
   * The playlist does not play on its own, only individual Sound tracks played as a soundboard.
   */
  DISABLED: -1;

  /**
   * The playlist plays sounds one at a time in sequence.
   */
  SEQUENTIAL: 0;

  /**
   * The playlist plays sounds one at a time in randomized order.
   */
  SHUFFLE: 1;

  /**
   * The playlist plays all contained sounds at the same time.
   */
  SIMULTANEOUS: 2;
}>;
export type PLAYLIST_MODES = ValueOf<typeof PLAYLIST_MODES>;

/**
 * The available sort modes for an audio Playlist.
 * @see https://foundryvtt.com/article/playlists/
 */
export const PLAYLIST_SORT_MODES: Readonly<{
  /**
   * Sort sounds alphabetically.
   * @defaultValue
   */
  ALPHABETICAL: "a";

  /**
   * Sort sounds by manual drag-and-drop.
   */
  MANUAL: "m";
}>;
export type PLAYLIST_SORT_MODES = ValueOf<typeof PLAYLIST_SORT_MODES>;

/**
 * The allowed package types
 */
export const PACKAGE_TYPES: readonly ["world", "system", "module"];
export type PACKAGE_TYPES = ValueOf<typeof PACKAGE_TYPES>;

/**
 * Encode the reasons why a package may be available or unavailable for use
 */
export const PACKAGE_AVAILABILITY_CODES: Readonly<{
  /**
   * Package availability could not be determined
   */
  UNKNOWN: -1;

  /**
   * Package is available for use
   */
  AVAILABLE: 0;

  /**
   * Package requires an update to a newer Package version
   */
  REQUIRES_UPDATE: 1;

  /**
   * The System that the Package relies on is not available
   */
  REQUIRES_SYSTEM: 2;

  /**
   * A dependency of the Package is not available
   */
  REQUIRES_DEPENDENCY: 3;

  /**
   * The Package is compatible with an older version of Foundry than the currently installed version
   */
  REQUIRES_CORE_DOWNGRADE: 4;

  /**
   * The Package is compatible with a newer version of Foundry than the currently installed version, and that version is Stable
   */
  REQUIRES_CORE_UPGRADE_STABLE: 5;

  /**
   * The Package is compatible with a newer version of Foundry than the currently installed version, and that version is not yet Stable
   */
  REQUIRES_CORE_UPGRADE_UNSTABLE: 5;
}>;
export type PACKAGE_AVAILABILITY_CODES = ValueOf<typeof PACKAGE_AVAILABILITY_CODES>;

/**
 * A safe password string which can be displayed
 */
export const PASSWORD_SAFE_STRING: "••••••••••••••••";

/**
 * The allowed software update channels
 */
export const SOFTWARE_UPDATE_CHANNELS: Readonly<{
  /**
   * The Stable release channel
   */
  stable: "SETUP.UpdateStable";

  /**
   * The User Testing release channel
   */
  testing: "SETUP.UpdateTesting";

  /**
   * The Development release channel
   */
  development: "SETUP.UpdateDevelopment";

  /**
   * The Prototype release channel
   */
  prototype: "SETUP.UpdatePrototype";
}>;
export type SOFTWARE_UPDATE_CHANNELS = ValueOf<typeof SOFTWARE_UPDATE_CHANNELS>;

/**
 * The default sorting density for manually ordering child objects within a parent
 */
export const SORT_INTEGER_DENSITY: 100000;

/**
 * The allowed types of a TableResult document
 * @see https://foundryvtt.com/article/roll-tables/
 */
export const TABLE_RESULT_TYPES: Readonly<{
  /**
   *  Plain text or HTML scripted entries which will be output to Chat.
   */
  TEXT: 0;

  /**
   * An in-World Document reference which will be linked to in the chat message.
   */
  DOCUMENT: 1;

  /**
   * A Compendium Pack reference which will be linked to in the chat message.
   */
  COMPENDIUM: 2;
}>;
export type TABLE_RESULT_TYPES = ValueOf<typeof TABLE_RESULT_TYPES>;

/**
 * The allowed formats of a Journal Entry Page.
 * @see https://foundryvtt.com/article/journal/
 */
export const JOURNAL_ENTRY_PAGE_FORMATS: Readonly<{
  /**
   * The page is formatted as HTML.
   */
  HTML: 1;

  /**
   * The page is formatted as Markdown.
   */
  MARKDOWN: 2;
}>;
export type JOURNAL_ENTRY_PAGE_FORMATS = ValueOf<typeof JOURNAL_ENTRY_PAGE_FORMATS>;

/**
 * Define the valid anchor locations for a Tooltip displayed on a Placeable Object
 * @see {@link TooltipManager}
 */
export const TEXT_ANCHOR_POINTS: Readonly<{
  /**
   * Anchor the tooltip to the center of the element.
   */
  CENTER: 0;

  /**
   * Anchor the tooltip to the bottom of the element.
   */
  BOTTOM: 1;

  /**
   * Anchor the tooltip to the top of the element.
   */
  TOP: 2;

  /**
   * Anchor the tooltip to the left of the element.
   */
  LEFT: 3;

  /**
   * Anchor the tooltip to the right of the element.
   */
  RIGHT: 4;
}>;
export type TEXT_ANCHOR_POINTS = ValueOf<typeof TEXT_ANCHOR_POINTS>;

/**
 * Define the valid occlusion modes which an overhead tile can use
 * @see https://foundryvtt.com/article/tiles/
 */
export const TILE_OCCLUSION_MODES: Readonly<{
  /**
   * Turns off occlusion, making the tile never fade while tokens are under it.
   */
  NONE: 0;

  /**
   * Causes the whole tile to fade when an actor token moves under it.
   * @defaultValue
   */
  FADE: 1;

  // ROOF: 2;  This mode is no longer supported so we don't use 2 for any other mode

  /**
   * Causes the tile to reveal the background in the vicinity of an actor token under it. The radius is determined by the token's size.
   */
  RADIAL: 3;

  /**
   * Causes the tile to be partially revealed based on the vision of the actor, which does not need to be under the tile to see what's beneath it.
   *
   * @remarks
   * This is useful for rooves on buildings where players could see through a window or door, viewing only a portion of what is obscured by the roof itself.
   */
  VISION: 4;
}>;
export type TILE_OCCLUSION_MODES = ValueOf<typeof TILE_OCCLUSION_MODES>;

/**
 * Describe the various thresholds of token control upon which to show certain pieces of information
 * @see https://foundryvtt.com/article/tokens/
 */
export const TOKEN_DISPLAY_MODES: Readonly<{
  /**
   * No information is displayed.
   */
  NONE: 0;

  /**
   * Displayed when the token is controlled.
   */
  CONTROL: 10;

  /**
   * Displayed when hovered by a GM or a user who owns the actor.
   */
  OWNER_HOVER: 20;

  /**
   * Displayed when hovered by any user.
   */
  HOVER: 30;

  /**
   * Always displayed for a GM or for a user who owns the actor.
   */
  OWNER: 40;

  /**
   * Always displayed for everyone.
   */
  ALWAYS: 50;
}>;
export type TOKEN_DISPLAY_MODES = ValueOf<typeof TOKEN_DISPLAY_MODES>;

/**
 * The allowed Token disposition types
 * @see https://foundryvtt.com/article/tokens/
 */
export const TOKEN_DISPOSITIONS: Readonly<{
  /**
   * Displayed as an enemy with a red border.
   */
  HOSTILE: -1;

  /**
   * Displayed as neutral with a yellow border.
   */
  NEUTRAL: 0;

  /**
   * Displayed as an ally with a cyan border.
   */
  FRIENDLY: 1;
}>;
export type TOKEN_DISPOSITIONS = ValueOf<typeof TOKEN_DISPOSITIONS>;

/**
 * Define the allowed User permission levels.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
export const USER_ROLES: Readonly<{
  /**
   * The User is blocked from taking actions in Foundry Virtual Tabletop.
   * You can use this role to temporarily or permanently ban a user from joining the game.
   */
  NONE: 0;

  /**
   * The User is able to join the game with permissions available to a standard player.
   * They cannot take some more advanced actions which require Trusted permissions, but they have the basic functionalities needed to operate in the virtual tabletop.
   */
  PLAYER: 1;

  /**
   * Similar to the Player role, except a Trusted User has the ability to perform some more advanced actions like create drawings, measured templates, or even to (optionally) upload media files to the server.
   */
  TRUSTED: 2;

  /**
   * A special User who has many of the same in-game controls as a Game Master User, but does not have the ability to perform administrative actions like changing User roles or modifying World-level settings.
   */
  ASSISTANT: 3;

  /**
   *  A special User who has administrative control over this specific World.
   *  Game Masters behave quite differently than Players in that they have the ability to see all Documents and Objects within the world as well as the capability to configure World settings.
   */
  GAMEMASTER: 4;
}>;
export type USER_ROLES = ValueOf<typeof USER_ROLES>;

/**
 * Invert the User Role mapping to recover role names from a role integer
 * @see {@link USER_ROLES}
 */
export const USER_ROLE_NAMES: Readonly<{ [Key in keyof typeof USER_ROLES as typeof USER_ROLES[Key]]: Key }>;
export type USER_ROLE_NAMES = ValueOf<typeof USER_ROLE_NAMES>;

/**
 * An enumeration of the allowed types for a MeasuredTemplate embedded document
 * @see https://foundryvtt.com/article/measurement/
 */
export const MEASURED_TEMPLATE_TYPES: Readonly<{
  /**
   * Circular templates create a radius around the starting point.
   */
  CIRCLE: "circle";

  /**
   * Cones create an effect in the shape of a triangle or pizza slice from the starting point.
   */
  CONE: "cone";

  /**
   * A rectangle uses the origin point as one of the corners, treating the origin as being inside of the rectangle's area.
   */
  RECTANGLE: "rect";

  /**
   * A ray creates a single line that is one square in width and as long as you want it to be.
   */
  RAY: "ray";
}>;
export type MEASURED_TEMPLATE_TYPES = ValueOf<typeof MEASURED_TEMPLATE_TYPES>;

export interface UserPermission {
  label: string;
  hint: string;
  disableGM: boolean;
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
  ACTOR_CREATE: UserPermission;

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
  BROADCAST_AUDIO: UserPermission;

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
  BROADCAST_VIDEO: UserPermission;

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
  DRAWING_CREATE: UserPermission;

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
  ITEM_CREATE: UserPermission;

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
  FILES_BROWSE: UserPermission;

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
  FILES_UPLOAD: UserPermission;

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
  JOURNAL_CREATE: UserPermission;

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
  MACRO_SCRIPT: UserPermission;

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
  MESSAGE_WHISPER: UserPermission;

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
  NOTE_CREATE: UserPermission;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.PingCanvas",
   *    hint: "PERMISSION.PingCanvasHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  PING_CANVAS: UserPermission;

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
  SETTINGS_MODIFY: UserPermission;

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
  SHOW_CURSOR: UserPermission;

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
  SHOW_RULER: UserPermission;

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
  TEMPLATE_CREATE: UserPermission;

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
  TOKEN_CREATE: UserPermission;

  /**
   * @defaultValue
   * ```typescript
   * {
   *    label: "PERMISSION.TokenDelete",
   *    hint: "PERMISSION.TokenDeleteHint",
   *    disableGM: false,
   *    defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  TOKEN_DELETE: UserPermission;

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
  TOKEN_CONFIGURE: UserPermission;

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
  WALL_DOORS: UserPermission;
}>;

/**
 * The allowed directions of effect that a Wall can have
 * @see https://foundryvtt.com/article/walls/
 */
export const WALL_DIRECTIONS: Readonly<{
  /**
   * The wall collides from both directions.
   */
  BOTH: 0;

  /**
   * The wall collides only when a ray strikes its left side.
   */
  LEFT: 1;

  /**
   * The wall collides only when a ray strikes its right side.
   */
  RIGHT: 2;
}>;
export type WALL_DIRECTIONS = ValueOf<typeof WALL_DIRECTIONS>;

/**
 * The allowed door types which a Wall may contain
 * @see https://foundryvtt.com/article/walls/
 */
export const WALL_DOOR_TYPES: Readonly<{
  /**
   * The wall does not contain a door.
   */
  NONE: 0;

  /**
   *  The wall contains a regular door.
   */
  DOOR: 1;

  /**
   * The wall contains a secret door.
   */
  SECRET: 2;
}>;
export type WALL_DOOR_TYPES = ValueOf<typeof WALL_DOOR_TYPES>;

/**
 * The allowed door states which may describe a Wall that contains a door
 * @see https://foundryvtt.com/article/walls/
 */
export const WALL_DOOR_STATES: Readonly<{
  /**
   * The door is closed.
   */
  CLOSED: 0;

  /**
   * The door is open.
   */
  OPEN: 1;

  /**
   * The door is closed and locked.
   */
  LOCKED: 2;
}>;
export type WALL_DOOR_STATES = ValueOf<typeof WALL_DOOR_STATES>;

/**
 * The wall properties which restrict the way interaction occurs with a specific wall
 */
export const WALL_RESTRICTION_TYPES: readonly ["light", "sight", "sound", "move"];
export type WALL_RESTRICTION_TYPES = ValueOf<typeof WALL_RESTRICTION_TYPES>;

/**
 * The types of sensory collision which a Wall may impose
 * @see https://foundryvtt.com/article/walls/
 */
export const WALL_SENSE_TYPES: Readonly<{
  /**
   * Senses do not collide with this wall.
   */
  NONE: 0;

  /**
   * Senses collide with this wall.
   */
  LIMITED: 10;

  /**
   * Senses collide with the second intersection, bypassing the first.
   */
  NORMAL: 20;
}>;
export type WALL_SENSE_TYPES = ValueOf<typeof WALL_SENSE_TYPES>;

/**
 * The types of movement collision which a Wall may impose
 * @see https://foundryvtt.com/article/walls/
 */
export const WALL_MOVEMENT_TYPES: Readonly<{
  /**
   * Movement does not collide with this wall.
   */
  NONE: typeof WALL_SENSE_TYPES.NONE;

  /**
   * Movement collides with this wall.
   */
  NORMAL: typeof WALL_SENSE_TYPES.NORMAL;
}>;
export type WALL_MOVEMENT_TYPES = ValueOf<typeof WALL_MOVEMENT_TYPES>;

/**
 * The possible precedence values a Keybinding might run in
 * @see https://foundryvtt.com/article/keybinds/
 */
export const KEYBINDING_PRECEDENCE: Readonly<{
  /**
   * Runs in the first group along with other PRIORITY keybindings.
   */
  PRIORITY: 0;

  /**
   * Runs after the PRIORITY group along with other NORMAL keybindings.
   */
  NORMAL: 1;

  /**
   * Runs in the last group along with other DEFERRED keybindings.
   */
  DEFERRED: 2;
}>;
export type KEYBINDING_PRECEDENCE = ValueOf<typeof KEYBINDING_PRECEDENCE>;

/**
 * The allowed set of HTML template extensions
 */
export const HTML_FILE_EXTENSIONS: readonly ["html", "handlebars", "hbs"];

interface _IMAGE_FILE_EXTENSIONS {
  apng: "image/apng";
  avif: "image/avif";
  bmp: "image/bmp";
  gif: "image/gif";
  jpg: "image/jpeg";
  jpeg: "image/jpeg";
  png: "image/png";
  svg: "image/svg+xml";
  tiff: "image/tiff";
  webp: "image/webp";
}

/**
 * The supported file extensions for image-type files, and their corresponding mime types.
 */
export const IMAGE_FILE_EXTENSIONS: Readonly<_IMAGE_FILE_EXTENSIONS>;
export type IMAGE_FILE_EXTENSIONS = ValueOf<_IMAGE_FILE_EXTENSIONS>;

interface _VIDEO_FILE_EXTENSIONS {
  m4v: "video/mp4";
  mp4: "video/mp4";
  ogg: "video/ogg";
  webm: "video/webm";
}

/**
 * The supported file extensions for video-type files, and their corresponding mime types.
 */
export const VIDEO_FILE_EXTENSIONS: Readonly<_VIDEO_FILE_EXTENSIONS>;
export type VIDEO_FILE_EXTENSIONS = ValueOf<_VIDEO_FILE_EXTENSIONS>;

interface _AUDIO_FILE_EXTENSIONS {
  aac: "audio/aac";
  flac: "audio/flac";
  m4a: "audio/mp4";
  mid: "audio/midi";
  mp3: "audio/mpeg";
  ogg: "audio/ogg";
  opus: "audio/opus";
  wav: "audio/wav";
  webm: "audio/webm";
}
/**
 * The supported file extensions for audio-type files, and their corresponding mime types.
 */
export const AUDIO_FILE_EXTENSIONS: Readonly<_AUDIO_FILE_EXTENSIONS>;
export type AUDIO_FILE_EXTENSIONS = ValueOf<_AUDIO_FILE_EXTENSIONS>;

interface _TEXT_FILE_EXTENSIONS {
  csv: "text/csv";
  json: "application/json";
  md: "text/markdown";
  pdf: "application/pdf";
  tsv: "text/tab-separated-values";
  txt: "text/plain";
  xml: "application/xml";
  yml: "application/yaml";
  yaml: "application/yaml";
}
/**
 * The supported file extensions for text files, and their corresponding mime types.
 */
export const TEXT_FILE_EXTENSIONS: Readonly<_TEXT_FILE_EXTENSIONS>;
export type TEXT_FILE_EXTENSIONS = ValueOf<_TEXT_FILE_EXTENSIONS>;

interface _FONT_FILE_EXTENSIONS {
  ttf: "font/ttf";
  otf: "font/otf";
  woff: "font/woff";
  woff2: "font/woff2";
}
/**
 * Supported file extensions for font files, and their corresponding mime types.
 */
export const FONT_FILE_EXTENSIONS: Readonly<_FONT_FILE_EXTENSIONS>;
export type FONT_FILE_EXTENSIONS = ValueOf<_FONT_FILE_EXTENSIONS>;

interface _GRAPHICS_FILE_EXTENSIONS {
  fbx: "application/octet-stream";
  glb: "model/gltf-binary";
  gltf: "model/gltf+json";
  mtl: "model/mtl";
  obj: "model/obj";
  stl: "model/stl";
  usdz: "model/vnd.usdz+zip";
}
/**
 * Supported file extensions for 3D files, and their corresponding mime types.
 */
export const GRAPHICS_FILE_EXTENSIONS: Readonly<_GRAPHICS_FILE_EXTENSIONS>;
export type GRAPHICS_FILE_EXTENSIONS = ValueOf<_GRAPHICS_FILE_EXTENSIONS>;

interface _UPLOADABLE_FILE_EXTENSIONS
  extends _IMAGE_FILE_EXTENSIONS,
    Omit<_VIDEO_FILE_EXTENSIONS, "ogg" | "webm">,
    _AUDIO_FILE_EXTENSIONS,
    _TEXT_FILE_EXTENSIONS,
    _FONT_FILE_EXTENSIONS,
    _GRAPHICS_FILE_EXTENSIONS {}

export const UPLOADABLE_FILE_EXTENSIONS: _UPLOADABLE_FILE_EXTENSIONS;

/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 */
export const MEDIA_MIME_TYPES: ValueOf<_UPLOADABLE_FILE_EXTENSIONS>;

/**
 * An enumeration of file type categories which can be selected
 */
export const FILE_CATEGORIES: {
  HTML: typeof HTML_FILE_EXTENSIONS;
  IMAGE: _IMAGE_FILE_EXTENSIONS;
  VIDEO: _VIDEO_FILE_EXTENSIONS;
  AUDIO: _AUDIO_FILE_EXTENSIONS;
  TEXT: _TEXT_FILE_EXTENSIONS;
  FONT: _FONT_FILE_EXTENSIONS;
  GRAPHICS: _GRAPHICS_FILE_EXTENSIONS;
  MEDIA: typeof MEDIA_MIME_TYPES;
};

/**
 * A font weight to name mapping.
 */
export const FONT_WEIGHTS: {
  Thin: 100;
  ExtraLight: 200;
  Light: 300;
  Regular: 400;
  Medium: 500;
  SemiBold: 600;
  Bold: 700;
  ExtraBold: 800;
  Black: 900;
};

/**
 * Stores shared commonly used timeouts, measured in MS
 */
export const TIMEOUTS: Readonly<{
  /**
   * The default timeout for interacting with the foundryvtt.com API.
   */
  FOUNDRY_WEBSITE: 10000;

  /**
   * The specific timeout for loading the list of packages from the foundryvtt.com API.
   */
  PACKAGE_REPOSITORY: 5000;

  /**
   * The specific timeout for the IP address lookup service.
   */
  IP_DISCOVERY: 5000;
}>;
export type TIMEOUTS = ValueOf<typeof TIMEOUTS>;

/**
 * A subset of Compendium types which require a specific system to be designated
 */
export const SYSTEM_SPECIFIC_COMPENDIUM_TYPES: readonly ["Actor", "Item"];
export type SYSTEM_SPECIFIC_COMPENDIUM_TYPES = typeof SYSTEM_SPECIFIC_COMPENDIUM_TYPES[number];

/**
 * The configured showdown bi-directional HTML \<-\> Markdown converter options.
 */
export const SHOWDOWN_OPTIONS: {
  disableForced4SpacesIndentedSublists: true;
  noHeaderId: true;
  parseImgDimensions: true;
  strikethrough: true;
  tables: true;
  tablesHeaderId: true;
};

/**
 * @deprecated since v10.
 * @see {@link foundry.data.ShapeData.TYPES}
 */
export const DRAWING_TYPES: Readonly<{
  RECTANGLE: "r";
  ELLIPSE: "e";
  TEXT: "t";
  POLYGON: "p";
  FREEHAND: "f";
}>;
/**
 * @deprecated since v10.
 * @see {@link foundry.data.ShapeData.TYPES}
 */
export type DRAWING_TYPES = ValueOf<typeof DRAWING_TYPES>;
