import type { Brand, DeepReadonly, Identity, ValueOf } from "#utils";

/**
 * The shortened software name
 */
export declare const vtt: "Foundry VTT";

/**
 * The full software name
 */
export declare const VTT: "Foundry Virtual Tabletop";

/**
 * The software website URL
 */
export declare const WEBSITE_URL: "https://foundryvtt.com";

/**
 * The serverless API URL
 */
export declare const WEBSITE_API_URL: "https://api.foundryvtt.com";

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
 * Define the allowed ActiveEffect application modes.
 * Other arbitrary mode numbers can be used by systems and modules to identify special behaviors and are ignored
 */
export declare const ACTIVE_EFFECT_MODES: Readonly<{
  /**
   * Used to denote that the handling of the effect is programmatically provided by a system or module.
   */
  CUSTOM: 0 & ACTIVE_EFFECT_MODES;

  /**
   * Multiplies a numeric base value by the numeric effect value
   * @example
   * 2 (base value) * 3 (effect value) = 6 (derived value)
   */
  MULTIPLY: 1 & ACTIVE_EFFECT_MODES;

  /**
   * Adds a numeric base value to a numeric effect value, or concatenates strings
   * @example
   * 2 (base value) + 3 (effect value) = 5 (derived value)
   * @example
   * "Hello" (base value) + " World" (effect value) = "Hello World"
   */
  ADD: 2 & ACTIVE_EFFECT_MODES;

  /**
   * Keeps the lower value of the base value and the effect value
   * @example
   * 2 (base value), 0 (effect value) = 0 (derived value)
   * @example
   * 2 (base value), 3 (effect value) = 2 (derived value)
   */
  DOWNGRADE: 3 & ACTIVE_EFFECT_MODES;

  /**
   * Keeps the greater value of the base value and the effect value
   * @example
   * 2 (base value), 4 (effect value) = 4 (derived value)
   * @example
   * 2 (base value), 1 (effect value) = 2 (derived value)
   */
  UPGRADE: 4 & ACTIVE_EFFECT_MODES;

  /**
   * Directly replaces the base value with the effect value
   * @example
   * 2 (base value), 4 (effect value) = 4 (derived value)
   */
  OVERRIDE: 5 & ACTIVE_EFFECT_MODES;
}>;
export type ACTIVE_EFFECT_MODES = Brand<number, "constants.ACTIVE_EFFECT_MODES">;

/**
 * Define the string name used for the base document type when specific sub-types are not defined by the system
 */
export declare const BASE_DOCUMENT_TYPE: "base";
export type BASE_DOCUMENT_TYPE = typeof BASE_DOCUMENT_TYPE;

/**
 * Define the methods by which a Card can be drawn from a Cards stack
 * @remarks `TOP` and `FIRST` are synonymous, as are `BOTTOM` and `LAST`.
 */
export declare const CARD_DRAW_MODES: Readonly<{
  /**
   * Draw the first card from the stack
   * Synonymous with {@linkcode CARD_DRAW_MODES.TOP}
   */
  FIRST: 0 & CARD_DRAW_MODES;

  /**
   * Draw the top card from the stack
   * Synonymous with {@linkcode CARD_DRAW_MODES.FIRST}
   */
  TOP: 0 & CARD_DRAW_MODES;

  /**
   * Draw the last card from the stack
   * Synonymous with {@linkcode CARD_DRAW_MODES.BOTTOM}
   */
  LAST: 1 & CARD_DRAW_MODES;

  /**
   * Draw the bottom card from the stack
   * Synonymous with {@linkcode CARD_DRAW_MODES.LAST}
   */
  BOTTOM: 1 & CARD_DRAW_MODES;

  /**
   * Draw a random card from the stack
   */
  RANDOM: 2 & CARD_DRAW_MODES;
}>;
export type CARD_DRAW_MODES = Brand<number, "constants.CARD_DRAW_MODES">;

/**
 * An enumeration of canvas performance modes.
 */
export declare const CANVAS_PERFORMANCE_MODES: Readonly<{
  LOW: 0 & CANVAS_PERFORMANCE_MODES;
  MED: 1 & CANVAS_PERFORMANCE_MODES;
  HIGH: 2 & CANVAS_PERFORMANCE_MODES;
  MAX: 3 & CANVAS_PERFORMANCE_MODES;
}>;
export type CANVAS_PERFORMANCE_MODES = Brand<number, "constants.CANVAS_PERFORMANCE_MODES">;

/**
 * Valid Chat Message styles which affect how the message is presented in the chat log.
 */
export declare const CHAT_MESSAGE_STYLES: Readonly<{
  /**
   * An uncategorized chat message
   */
  OTHER: 0 & CHAT_MESSAGE_STYLES;

  /**
   * The message is spoken out of character (OOC).
   * OOC messages will be outlined by the player's color to make them more easily recognizable.
   */
  OOC: 1 & CHAT_MESSAGE_STYLES;

  /**
   * The message is spoken by an associated character.
   */
  IC: 2 & CHAT_MESSAGE_STYLES;

  /**
   * The message is an emote performed by the selected character.
   * Entering "/emote waves his hand." while controlling a character named Simon will send the message, "Simon waves his hand."
   */
  EMOTE: 3 & CHAT_MESSAGE_STYLES;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_STYLES.ROLL` is deprecated in favor of defining rolls directly in
   * {@linkcode ChatMessage.rolls | ChatMessage#rolls}" (since v12, until v14)
   */
  ROLL: 0 & CHAT_MESSAGE_STYLES;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_STYLES.Whisper` is deprecated in favor of defining whisper recipients
   * directly in {@linkcode ChatMessage.whisper | ChatMessage#whisper}"
   * (since v12, until v14)
   */
  WHISPER: 0 & CHAT_MESSAGE_STYLES;
}>;
export type CHAT_MESSAGE_STYLES = Brand<number, "constants.CHAT_MESSAGE_STYLES">;

/**
 * Define the set of languages which have built-in support in the core software
 */
export declare const CORE_SUPPORTED_LANGUAGES: readonly ["en"];
export type CORE_SUPPORTED_LANGUAGES = ValueOf<typeof CORE_SUPPORTED_LANGUAGES>;

/**
 * Configure the severity of compatibility warnings.
 */
export declare const COMPATIBILITY_MODES: Readonly<{
  /**
   * Nothing will be logged
   */
  SILENT: 0 & COMPATIBILITY_MODES;

  /**
   * A message will be logged at the "warn" level
   */
  WARNING: 1 & COMPATIBILITY_MODES;

  /**
   * A message will be logged at the "error" level
   */
  ERROR: 2 & COMPATIBILITY_MODES;

  /**
   * An Error will be thrown
   */
  FAILURE: 3 & COMPATIBILITY_MODES;
}>;
export type COMPATIBILITY_MODES = Brand<number, "constants.COMPATIBILITY_MODES">;

/**
 * Configure custom cursor images to use when interacting with the application.
 */
export declare const CURSOR_STYLES: Readonly<{
  default: "default";
  "default-down": "default";
  pointer: "pointer";
  "pointer-down": "pointer";
  grab: "grab";
  "grab-down": "grabbing";
  text: "text";
  "text-down": "text";
}>;
export type CURSOR_STYLES = keyof typeof CURSOR_STYLES;

/**
 * The lighting illumination levels which are supported.
 */
export declare const LIGHTING_LEVELS: Readonly<{
  DARKNESS: -2 & LIGHTING_LEVELS;
  HALFDARK: -1 & LIGHTING_LEVELS;
  UNLIT: 0 & LIGHTING_LEVELS;
  DIM: 1 & LIGHTING_LEVELS;
  BRIGHT: 2 & LIGHTING_LEVELS;
  BRIGHTEST: 3 & LIGHTING_LEVELS;
}>;
export type LIGHTING_LEVELS = Brand<number, "constants.LIGHTING_LEVELS">;

/**
 * The CSS themes which are currently supported for the V11 Setup menu.
 */
export declare const CSS_THEMES: Readonly<{
  foundry: "THEME.foundry";
  fantasy: "THEME.fantasy";
  scifi: "THEME.scifi";
}>;
export type CSS_THEMES = ValueOf<typeof CSS_THEMES>;

/**
 * The default artwork used for Token images if none is provided
 */
export declare const DEFAULT_TOKEN: "icons/svg/mystery-man.svg";
export type DEFAULT_TOKEN = typeof DEFAULT_TOKEN;

/**
 * Define the allowed Document class types.
 */
export declare const PRIMARY_DOCUMENT_TYPES: readonly [
  "Actor",
  "Adventure",
  "Cards",
  "ChatMessage",
  "Combat",
  "FogExploration",
  "Folder",
  "Item",
  "JournalEntry",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
  "Setting",
  "User",
];
export type PRIMARY_DOCUMENT_TYPES = ValueOf<typeof PRIMARY_DOCUMENT_TYPES>;

/**
 * The embedded Document types.
 */
export const EMBEDDED_DOCUMENT_TYPES: readonly [
  "ActiveEffect",
  "ActorDelta",
  "AmbientLight",
  "AmbientSound",
  "Card",
  "Combatant",
  "CombatantGroup",
  "Drawing",
  "Item",
  "JournalEntryCategory",
  "JournalEntryPage",
  "MeasuredTemplate",
  "Note",
  "PlaylistSound",
  "Region",
  "RegionBehavior",
  "TableResult",
  "Tile",
  "Token",
  "Wall",
];
export type EMBEDDED_DOCUMENT_TYPES = ValueOf<typeof EMBEDDED_DOCUMENT_TYPES>;

/**
 * A listing of all valid Document types, both primary and embedded.
 */
export const ALL_DOCUMENT_TYPES: readonly ALL_DOCUMENT_TYPES[];
export type ALL_DOCUMENT_TYPES = PRIMARY_DOCUMENT_TYPES | EMBEDDED_DOCUMENT_TYPES;

/**
 * The allowed primary Document types which may exist within a World.
 */
export declare const WORLD_DOCUMENT_TYPES: readonly [
  "Actor",
  "Cards",
  "ChatMessage",
  "Combat",
  "FogExploration",
  "Folder",
  "Item",
  "JournalEntry",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
  "Setting",
  "User",
];
export type WORLD_DOCUMENT_TYPES = ValueOf<typeof WORLD_DOCUMENT_TYPES>;

/**
 * The allowed primary Document types which may exist within a Compendium pack.
 */
export declare const COMPENDIUM_DOCUMENT_TYPES: readonly [
  "Actor",
  "Adventure",
  "Cards",
  "Item",
  "JournalEntry",
  "Macro",
  "Playlist",
  "RollTable",
  "Scene",
];
export type COMPENDIUM_DOCUMENT_TYPES = ValueOf<typeof COMPENDIUM_DOCUMENT_TYPES>;

/**
 * Define the allowed ownership levels for a Document.
 * Each level is assigned a value in ascending order.
 * Higher levels grant more permissions.
 * @see {@link https://foundryvtt.com/article/users/}
 */
export declare const DOCUMENT_OWNERSHIP_LEVELS: Readonly<{
  /**
   * The User inherits permissions from the parent Folder.
   */
  INHERIT: -1 & DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Restricts the associated Document so that it may not be seen by this User.
   */
  NONE: 0 & DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Allows the User to interact with the Document in basic ways, allowing them to see it in sidebars and see only limited aspects of its contents.
   * The limits of this interaction are defined by the game system being used.
   */
  LIMITED: 1 & DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Allows the User to view this Document as if they were owner, but prevents them from making any changes to it.
   */
  OBSERVER: 2 & DOCUMENT_OWNERSHIP_LEVELS;

  /**
   * Allows the User to view and make changes to the Document as its owner. Owned documents cannot be deleted by anyone other than a gamemaster level User.
   */
  OWNER: 3 & DOCUMENT_OWNERSHIP_LEVELS;
}>;
export type DOCUMENT_OWNERSHIP_LEVELS = Brand<number, "constants.DOCUMENT_OWNERSHIP_LEVELS">;

/**
 * Meta ownership levels that are used in the UI but never stored.
 */
export declare const DOCUMENT_META_OWNERSHIP_LEVELS: Readonly<{
  DEFAULT: -20 & DOCUMENT_META_OWNERSHIP_LEVELS;
  NOCHANGE: -10 & DOCUMENT_META_OWNERSHIP_LEVELS;
}>;
export type DOCUMENT_META_OWNERSHIP_LEVELS = Brand<number, "constants.DOCUMENT_META_OWNERSHIP_LEVELS">;

/**
 * Define the allowed Document types which may be dynamically linked in chat
 */
export declare const DOCUMENT_LINK_TYPES: readonly [
  "Actor",
  "Cards",
  "Item",
  "Scene",
  "JournalEntry",
  "Macro",
  "RollTable",
  "PlaylistSound",
];
export type DOCUMENT_LINK_TYPES = ValueOf<typeof DOCUMENT_LINK_TYPES>;

/**
 * The supported dice roll visibility modes
 * @see {@link https://foundryvtt.com/article/dice/}
 */
export declare const DICE_ROLL_MODES: Readonly<{
  /**
   * This roll is visible to all players.
   */
  PUBLIC: "publicroll";

  /**
   * Rolls of this type are only visible to the player that rolled and any Game Master users.
   */
  PRIVATE: "gmroll";

  /**
   * A private dice roll only visible to Gamemaster users. The rolling player will not see the result of their own roll.
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
 * @see {@link https://foundryvtt.com/article/drawings/}
 */
export declare const DRAWING_FILL_TYPES: Readonly<{
  /**
   * The drawing is not filled
   */
  NONE: 0 & DRAWING_FILL_TYPES;

  /**
   * The drawing is filled with a solid color
   */
  SOLID: 1 & DRAWING_FILL_TYPES;

  /**
   * The drawing is filled with a tiled image pattern
   */
  PATTERN: 2 & DRAWING_FILL_TYPES;
}>;
export type DRAWING_FILL_TYPES = Brand<number, "constants.DRAWING_FILL_TYPES">;

/**
 * Define the allowed Document types which Folders may contain
 */
export declare const FOLDER_DOCUMENT_TYPES: readonly [
  "Actor",
  "Adventure",
  "Item",
  "Scene",
  "JournalEntry",
  "Playlist",
  "RollTable",
  "Cards",
  "Macro",
  "Compendium",
];
export type FOLDER_DOCUMENT_TYPES = ValueOf<typeof FOLDER_DOCUMENT_TYPES>;

/**
 * The maximum allowed level of depth for Folder nesting
 * @defaultValue `4`
 */
export declare const FOLDER_MAX_DEPTH: number;

/**
 * A list of allowed game URL names
 */
export declare const GAME_VIEWS: readonly ["game", "stream"];
export type GAME_VIEWS = ValueOf<typeof GAME_VIEWS>;

/**
 * The directions of movement.
 */
export declare const MOVEMENT_DIRECTIONS: Readonly<{
  UP: 0x1 & MOVEMENT_DIRECTIONS;
  DOWN: 0x2 & MOVEMENT_DIRECTIONS;
  LEFT: 0x4 & MOVEMENT_DIRECTIONS;
  RIGHT: 0x8 & MOVEMENT_DIRECTIONS;

  /** @remarks `0x1 | 0x4` */
  UP_LEFT: 0x5 & MOVEMENT_DIRECTIONS;

  /** @remarks `0x1 | 0x8` */
  UP_RIGHT: 0x9 & MOVEMENT_DIRECTIONS;

  /** @remarks `0x2 | 0x4` */
  DOWN_LEFT: 0x6 & MOVEMENT_DIRECTIONS;

  /** @remarks `0x2 | 0x8` */
  DOWN_RIGHT: 0xa & MOVEMENT_DIRECTIONS;
}>;
export type MOVEMENT_DIRECTIONS = Brand<number, "constants.MOVEMENT_DIRECTIONS">;

/**
 * The minimum allowed grid size which is supported by the software
 * @defaultValue `20`
 */
export declare const GRID_MIN_SIZE: number;

/**
 * The allowed Grid types which are supported by the software
 * @see {@link https://foundryvtt.com/article/scenes/}
 */
export declare const GRID_TYPES: Readonly<{
  /**
   * No fixed grid is used on this Scene allowing free-form point-to-point measurement without grid lines.
   */
  GRIDLESS: 0 & GRID_TYPES;

  /**
   * A square grid is used with width and height of each grid space equal to the chosen grid size.
   */
  SQUARE: 1 & GRID_TYPES;

  /**
   * A row-wise hexagon grid (pointy-topped) where odd-numbered rows are offset.
   */
  HEXODDR: 2 & GRID_TYPES;

  /**
   * A row-wise hexagon grid (pointy-topped) where even-numbered rows are offset.
   */
  HEXEVENR: 3 & GRID_TYPES;

  /**
   * A column-wise hexagon grid (flat-topped) where odd-numbered columns are offset.
   */
  HEXODDQ: 4 & GRID_TYPES;

  /**
   * A column-wise hexagon grid (flat-topped) where even-numbered columns are offset.
   */
  HEXEVENQ: 5 & GRID_TYPES;
}>;
export type GRID_TYPES = Brand<number, "constants.GRID_TYPES">;

/**
 * The different rules to define and measure diagonal distance/cost in a square grid.
 * The description of each option refers to the distance/cost of moving diagonally relative to the distance/cost of a
 * horizontal or vertical move.
 */
export declare const GRID_DIAGONALS: Readonly<{
  /**
   * The diagonal distance is 1. Diagonal movement costs the same as horizontal/vertical movement.
   */
  EQUIDISTANT: 0 & GRID_DIAGONALS;

  /**
   * The diagonal distance is √2. Diagonal movement costs √2 times as much as horizontal/vertical movement.
   */
  EXACT: 1 & GRID_DIAGONALS;

  /**
   * The diagonal distance is 1.5. Diagonal movement costs 1.5 times as much as horizontal/vertical movement.
   */
  APPROXIMATE: 2 & GRID_DIAGONALS;

  /**
   * The diagonal distance is 2. Diagonal movement costs 2 times as much as horizontal/vertical movement.
   */
  RECTILINEAR: 3 & GRID_DIAGONALS;

  /**
   * The diagonal distance alternates between 1 and 2 starting at 1.
   * The first diagonal movement costs the same as horizontal/vertical movement
   * The second diagonal movement costs 2 times as much as horizontal/vertical movement.
   * And so on...
   */
  ALTERNATING_1: 4 & GRID_DIAGONALS;

  /**
   * The diagonal distance alternates between 2 and 1 starting at 2.
   * The first diagonal movement costs 2 times as much as horizontal/vertical movement.
   * The second diagonal movement costs the same as horizontal/vertical movement.
   * And so on...
   */
  ALTERNATING_2: 5 & GRID_DIAGONALS;

  /**
   * The diagonal distance is ∞. Diagonal movement is not allowed/possible.
   */
  ILLEGAL: 6 & GRID_DIAGONALS;
}>;
export type GRID_DIAGONALS = Brand<number, "constants.GRID_DIAGONALS">;

/**
 * The grid snapping modes.
 */
export declare const GRID_SNAPPING_MODES: Readonly<{
  /**
   * Nearest center point.
   */
  CENTER: 0x1 & GRID_SNAPPING_MODES;

  /**
   * Nearest edge midpoint.
   */
  EDGE_MIDPOINT: 0x2 & GRID_SNAPPING_MODES;

  /**
   * Nearest top-left vertex.
   */
  TOP_LEFT_VERTEX: 0x10 & GRID_SNAPPING_MODES;

  /**
   * Nearest top-right vertex.
   */
  TOP_RIGHT_VERTEX: 0x20 & GRID_SNAPPING_MODES;

  /**
   * Nearest bottom-left vertex.
   */
  BOTTOM_LEFT_VERTEX: 0x40 & GRID_SNAPPING_MODES;

  /**
   * Nearest bottom-right vertex.
   */
  BOTTOM_RIGHT_VERTEX: 0x80 & GRID_SNAPPING_MODES;

  /**
   * Nearest vertex.
   * Alias for `TOP_LEFT_VERTEX | TOP_RIGHT_VERTEX | BOTTOM_LEFT_VERTEX | BOTTOM_RIGHT_VERTEX`.
   */
  VERTEX: 0xf0 & GRID_SNAPPING_MODES;

  /**
   * Nearest top-left corner.
   */
  TOP_LEFT_CORNER: 0x100 & GRID_SNAPPING_MODES;

  /**
   * Nearest top-right corner.
   */
  TOP_RIGHT_CORNER: 0x200 & GRID_SNAPPING_MODES;

  /**
   * Nearest bottom-left corner.
   */
  BOTTOM_LEFT_CORNER: 0x400 & GRID_SNAPPING_MODES;

  /**
   * Nearest bottom-right corner.
   */
  BOTTOM_RIGHT_CORNER: 0x800 & GRID_SNAPPING_MODES;

  /**
   * Nearest corner.
   * Alias for `TOP_LEFT_CORNER | TOP_RIGHT_CORNER | BOTTOM_LEFT_CORNER | BOTTOM_RIGHT_CORNER`.
   */
  CORNER: 0xf00 & GRID_SNAPPING_MODES;

  /**
   * Nearest top side midpoint.
   */
  TOP_SIDE_MIDPOINT: 0x1000 & GRID_SNAPPING_MODES;

  /**
   * Nearest bottom side midpoint.
   */
  BOTTOM_SIDE_MIDPOINT: 0x2000 & GRID_SNAPPING_MODES;

  /**
   * Nearest left side midpoint.
   */
  LEFT_SIDE_MIDPOINT: 0x4000 & GRID_SNAPPING_MODES;

  /**
   * Nearest right side midpoint.
   */
  RIGHT_SIDE_MIDPOINT: 0x8000 & GRID_SNAPPING_MODES;

  /**
   * Nearest side midpoint.
   * Alias for `TOP_SIDE_MIDPOINT | BOTTOM_SIDE_MIDPOINT | LEFT_SIDE_MIDPOINT | RIGHT_SIDE_MIDPOINT`.
   */
  SIDE_MIDPOINT: 0xf000 & GRID_SNAPPING_MODES;
}>;
export type GRID_SNAPPING_MODES = Brand<number, "constants.GRID_SNAPPING_MODES">;

/**
 * A list of supported setup URL names
 */
export declare const SETUP_VIEWS: readonly ["auth", "license", "setup", "players", "join", "update"];
export type SETUP_VIEWS = ValueOf<typeof SETUP_VIEWS>;

/**
 * An Array of valid MacroAction scope values
 */
export declare const MACRO_SCOPES: readonly ["global", "actors", "actor"];
export type MACRO_SCOPES = ValueOf<typeof MACRO_SCOPES>;

/**
 * An enumeration of valid Macro types
 * @see {@link https://foundryvtt.com/article/macros/}
 */
export declare const MACRO_TYPES: Readonly<{
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
 * The allowed channels for audio playback.
 */
export declare const AUDIO_CHANNELS: Readonly<{
  music: "AUDIO.CHANNELS.MUSIC.label";
  environment: "AUDIO.CHANNELS.ENVIRONMENT.label";
  interface: "AUDIO.CHANNELS.INTERFACE.label";
}>;
export type AUDIO_CHANNELS = ValueOf<typeof AUDIO_CHANNELS>;

/**
 * The allowed playback modes for an audio Playlist
 * @see {@link https://foundryvtt.com/article/playlists/}
 */
export declare const PLAYLIST_MODES: Readonly<{
  /**
   * The playlist does not play on its own, only individual Sound tracks played as a soundboard.
   */
  DISABLED: -1 & PLAYLIST_MODES;

  /**
   * The playlist plays sounds one at a time in sequence.
   */
  SEQUENTIAL: 0 & PLAYLIST_MODES;

  /**
   * The playlist plays sounds one at a time in randomized order.
   */
  SHUFFLE: 1 & PLAYLIST_MODES;

  /**
   * The playlist plays all contained sounds at the same time.
   */
  SIMULTANEOUS: 2 & PLAYLIST_MODES;
}>;
export type PLAYLIST_MODES = Brand<number, "constants.PLAYLIST_MODES">;

/**
 * The available sort modes for an audio Playlist.
 * @defaultValue `"a"`
 * @see {@link https://foundryvtt.com/article/playlists/}
 */
export declare const PLAYLIST_SORT_MODES: Readonly<{
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
 * The available modes for searching within a DirectoryCollection
 */
export declare const DIRECTORY_SEARCH_MODES: Readonly<{
  FULL: "full";
  NAME: "name";
}>;
export type DIRECTORY_SEARCH_MODES = ValueOf<typeof DIRECTORY_SEARCH_MODES>;

/**
 * The allowed package types
 */
export declare const PACKAGE_TYPES: readonly ["world", "system", "module"];
export type PACKAGE_TYPES = ValueOf<typeof PACKAGE_TYPES>;

/**
 * Encode the reasons why a package may be available or unavailable for use
 */
export declare const PACKAGE_AVAILABILITY_CODES: Readonly<{
  /**
   * Package availability could not be determined
   */
  UNKNOWN: 0 & PACKAGE_AVAILABILITY_CODES;

  /**
   * The Package is verified to be compatible with the current core software build
   */
  VERIFIED: 1 & PACKAGE_AVAILABILITY_CODES;

  /**
   * Package is available for use, but not verified for the current core software build
   */
  UNVERIFIED_BUILD: 2 & PACKAGE_AVAILABILITY_CODES;

  /**
   * One or more installed system is incompatible with the Package.
   */
  UNVERIFIED_SYSTEM: 3 & PACKAGE_AVAILABILITY_CODES;

  /**
   * Package is available for use, but not verified for the current core software generation
   */
  UNVERIFIED_GENERATION: 4 & PACKAGE_AVAILABILITY_CODES;

  /**
   * The System that the Package relies on is not available
   */
  MISSING_SYSTEM: 5 & PACKAGE_AVAILABILITY_CODES;

  /**
   * A dependency of the Package is not available
   */
  MISSING_DEPENDENCY: 6 & PACKAGE_AVAILABILITY_CODES;

  /**
   * The Package is compatible with an older version of Foundry than the currently installed version
   */
  REQUIRES_CORE_DOWNGRADE: 7 & PACKAGE_AVAILABILITY_CODES;

  /**
   * The Package is compatible with a newer version of Foundry than the currently installed version, and that version is Stable
   */
  REQUIRES_CORE_UPGRADE_STABLE: 8 & PACKAGE_AVAILABILITY_CODES;

  /**
   * The Package is compatible with a newer version of Foundry than the currently installed version, and that version is not yet Stable
   */
  REQUIRES_CORE_UPGRADE_UNSTABLE: 9 & PACKAGE_AVAILABILITY_CODES;

  /**
   * A required dependency is not compatible with the current version of Foundry
   */
  REQUIRES_DEPENDENCY_UPDATE: 10 & PACKAGE_AVAILABILITY_CODES;
}>;
export type PACKAGE_AVAILABILITY_CODES = Brand<number, "constants.PACKAGE_AVAILABILITY_CODES">;

/**
 * A safe password string which can be displayed
 */
export declare const PASSWORD_SAFE_STRING: "••••••••••••••••";

/**
 * The allowed software update channels
 */
export declare const SOFTWARE_UPDATE_CHANNELS: Readonly<{
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
 * @defaultValue `100000`
 */
export declare const SORT_INTEGER_DENSITY: number;

/**
 * The allowed types of a TableResult document
 * @see {@link https://foundryvtt.com/article/roll-tables/}
 */
export declare const TABLE_RESULT_TYPES: Readonly<{
  /**
   *  Plain text or HTML scripted entries which will be output to Chat.
   */
  TEXT: "text";

  /**
   * An in-World Document reference which will be linked to in the chat message.
   */
  DOCUMENT: "document";

  /**
   * A Compendium Pack reference which will be linked to in the chat message.
   * @deprecated "`CONST.TABLE_RESULT_TYPES.COMPENDIUM` is is deprecated in favor of {@linkcode CONST.TABLE_RESULT_TYPES.DOCUMENT}
   * due to the "compendium" being merged with the "document" type." (since v13, until v15)
   */
  get COMPENDIUM(): "pack";
}>;
export type TABLE_RESULT_TYPES = ValueOf<typeof TABLE_RESULT_TYPES>;

/**
 * The allowed formats of a Journal Entry Page.
 * @see {@link https://foundryvtt.com/article/journal/}
 */
export declare const JOURNAL_ENTRY_PAGE_FORMATS: Readonly<{
  /**
   * The page is formatted as HTML.
   */
  HTML: 1 & JOURNAL_ENTRY_PAGE_FORMATS;

  /**
   * The page is formatted as Markdown.
   */
  MARKDOWN: 2 & JOURNAL_ENTRY_PAGE_FORMATS;
}>;
export type JOURNAL_ENTRY_PAGE_FORMATS = Brand<number, "constants.JOURNAL_ENTRY_PAGE_FORMATS">;

/**
 * Define the valid anchor locations for a Tooltip displayed on a Placeable Object
 * @see {@linkcode foundry.helpers.interaction.TooltipManager}
 */
export declare const TEXT_ANCHOR_POINTS: Readonly<{
  /**
   * Anchor the tooltip to the center of the element.
   */
  CENTER: 0 & TEXT_ANCHOR_POINTS;

  /**
   * Anchor the tooltip to the bottom of the element.
   */
  BOTTOM: 1 & TEXT_ANCHOR_POINTS;

  /**
   * Anchor the tooltip to the top of the element.
   */
  TOP: 2 & TEXT_ANCHOR_POINTS;

  /**
   * Anchor the tooltip to the left of the element.
   */
  LEFT: 3 & TEXT_ANCHOR_POINTS;

  /**
   * Anchor the tooltip to the right of the element.
   */
  RIGHT: 4 & TEXT_ANCHOR_POINTS;
}>;
export type TEXT_ANCHOR_POINTS = Brand<number, "constants.TEXT_ANCHOR_POINTS">;

/**
 * Define the valid occlusion modes which a tile can use
 * @remarks Foundry leaves a comment in the middle of the object: "// ROOF: 2;  This mode is no longer supported so we don't use 2 for any other mode"
 * @see {@link https://foundryvtt.com/article/tiles/}
 */
export declare const OCCLUSION_MODES: Readonly<{
  /**
   * Turns off occlusion, making the tile never fade while tokens are under it.
   */
  NONE: 0 & OCCLUSION_MODES;

  /**
   * Causes the whole tile to fade when an actor token moves under it.
   * @defaultValue
   */
  FADE: 1 & OCCLUSION_MODES;

  /**
   * Causes the tile to reveal the background in the vicinity of an actor token under it. The radius is determined by the token's size.
   */
  RADIAL: 3 & OCCLUSION_MODES;

  /**
   * Causes the tile to be partially revealed based on the vision of the actor, which does not need to be under the tile to see what's beneath it.
   * This is useful for roofs on buildings where players could see through a window or door, viewing only a portion of what is obscured by the roof itself.
   */
  VISION: 4 & OCCLUSION_MODES;
}>;
export type OCCLUSION_MODES = Brand<number, "constants.OCCLUSION_MODES">;

/**
 * Alias for old tile occlusion modes definition
 * @remarks Foundry leaves a comment in the middle of the object: "// ROOF: 2;  This mode is no longer supported so we don't use 2 for any other mode"
 * @privateRemarks Foundry just does `export const TILE_OCCLUSION_MODES = OCCLUSION_MODES` but we have to be un-DRY if we want a different brand
 */
export declare const TILE_OCCLUSION_MODES: {
  /**
   * Turns off occlusion, making the tile never fade while tokens are under it.
   */
  NONE: 0 & TILE_OCCLUSION_MODES;

  /**
   * Causes the whole tile to fade when an actor token moves under it.
   * @defaultValue
   */
  FADE: 1 & TILE_OCCLUSION_MODES;

  /**
   * Causes the tile to reveal the background in the vicinity of an actor token under it. The radius is determined by the token's size.
   */
  RADIAL: 3 & TILE_OCCLUSION_MODES;

  /**
   * Causes the tile to be partially revealed based on the vision of the actor, which does not need to be under the tile to see what's beneath it.
   * This is useful for roofs on buildings where players could see through a window or door, viewing only a portion of what is obscured by the roof itself.
   */
  VISION: 4 & TILE_OCCLUSION_MODES;
};
export type TILE_OCCLUSION_MODES = Brand<number, "constants.TILE_OCCLUSION_MODES">;

/**
 * The occlusion modes that define the set of tokens that trigger occlusion.
 */
export declare const TOKEN_OCCLUSION_MODES: Readonly<{
  /**
   * Owned tokens that aren't hidden.
   */
  OWNED: 0x1 & TOKEN_OCCLUSION_MODES;

  /**
   * Controlled tokens.
   */
  CONTROLLED: 0x2 & TOKEN_OCCLUSION_MODES;

  /**
   * Hovered tokens that are visible.
   */
  HOVERED: 0x4 & TOKEN_OCCLUSION_MODES;

  /**
   * Highlighted tokens that are visible.
   */
  HIGHLIGHTED: 0x8 & TOKEN_OCCLUSION_MODES;

  /**
   * All visible tokens.
   */
  VISIBLE: 0x10 & TOKEN_OCCLUSION_MODES;
}>;
export type TOKEN_OCCLUSION_MODES = Brand<number, "constants.TOKEN_OCCLUSION_MODES">;

/**
 * Describe the various thresholds of token control upon which to show certain pieces of information
 * @see {@link https://foundryvtt.com/article/tokens/}
 */
export declare const TOKEN_DISPLAY_MODES: Readonly<{
  /**
   * No information is displayed.
   */
  NONE: 0 & TOKEN_DISPLAY_MODES;

  /**
   * Displayed when the token is controlled.
   */
  CONTROL: 10 & TOKEN_DISPLAY_MODES;

  /**
   * Displayed when hovered by a GM or a user who owns the actor.
   */
  OWNER_HOVER: 20 & TOKEN_DISPLAY_MODES;

  /**
   * Displayed when hovered by any user.
   */
  HOVER: 30 & TOKEN_DISPLAY_MODES;

  /**
   * Always displayed for a GM or for a user who owns the actor.
   */
  OWNER: 40 & TOKEN_DISPLAY_MODES;

  /**
   * Always displayed for everyone.
   */
  ALWAYS: 50 & TOKEN_DISPLAY_MODES;
}>;
export type TOKEN_DISPLAY_MODES = Brand<number, "constants.TOKEN_DISPLAY_MODES">;

/**
 * The allowed Token disposition types
 * @see {@link https://foundryvtt.com/article/tokens/}
 */
export declare const TOKEN_DISPOSITIONS: Readonly<{
  /**
   * Displayed with a purple borders for owners and with no borders for others (and no pointer change).
   */
  SECRET: -2 & TOKEN_DISPOSITIONS;

  /**
   * Displayed as an enemy with a red border.
   */
  HOSTILE: -1 & TOKEN_DISPOSITIONS;

  /**
   * Displayed as neutral with a yellow border.
   */
  NEUTRAL: 0 & TOKEN_DISPOSITIONS;

  /**
   * Displayed as an ally with a cyan border.
   */
  FRIENDLY: 1 & TOKEN_DISPOSITIONS;
}>;
export type TOKEN_DISPOSITIONS = Brand<number, "constants.TOKEN_DISPOSITIONS">;

/**
 * The allowed token turn markers modes.
 */
export declare const TOKEN_TURN_MARKER_MODES: Readonly<{
  /**
   * The turn marker is disabled for this token.
   */
  DISABLED: 0 & TOKEN_TURN_MARKER_MODES;

  /**
   * The turn marker for this token is using the combat tracker settings (which could be disabled).
   */
  DEFAULT: 1 & TOKEN_TURN_MARKER_MODES;

  /**
   * The turn marker is using the token settings (unless the combat tracker turn marker setting is disabled)
   */
  CUSTOM: 2 & TOKEN_TURN_MARKER_MODES;
}>;
export type TOKEN_TURN_MARKER_MODES = Brand<number, "constants.TOKEN_TURN_MARKER_MODES">;

/**
 * The possible shapes of Tokens.
 */
export declare const TOKEN_SHAPES: Readonly<{
  /**
   * Ellipse (Variant 1)
   */
  ELLIPSE_1: 0 & TOKEN_SHAPES;

  /**
   * Ellipse (Variant 2)
   */
  ELLIPSE_2: 1 & TOKEN_SHAPES;

  /**
   * Trapezoid (Variant 1)
   */
  TRAPEZOID_1: 2 & TOKEN_SHAPES;

  /**
   * Trapezoid (Variant 2)
   */
  TRAPEZOID_2: 3 & TOKEN_SHAPES;

  /**
   * Rectangle (Variant 1)
   */
  RECTANGLE_1: 4 & TOKEN_SHAPES;

  /**
   * Rectangle (Variant 2)
   */
  RECTANGLE_2: 5 & TOKEN_SHAPES;
}>;
export type TOKEN_SHAPES = Brand<number, "constants.TOKEN_SHAPES">;

/**
 * Define the allowed User permission levels.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 * @see {@link https://foundryvtt.com/article/users/}
 */
export declare const USER_ROLES: Readonly<{
  /**
   * The User is blocked from taking actions in Foundry Virtual Tabletop.
   * You can use this role to temporarily or permanently ban a user from joining the game.
   */
  NONE: 0 & USER_ROLES;

  /**
   * The User is able to join the game with permissions available to a standard player.
   * They cannot take some more advanced actions which require Trusted permissions, but they have the basic
   * functionalities needed to operate in the virtual tabletop.
   */
  PLAYER: 1 & USER_ROLES;

  /**
   * Similar to the Player role, except a Trusted User has the ability to perform some more advanced actions
   * like create drawings, measured templates, or even to (optionally) upload media files to the server.
   */
  TRUSTED: 2 & USER_ROLES;

  /**
   * A special User who has many of the same in-game controls as a Game Master User, but does not have the ability
   * to perform administrative actions like changing User roles or modifying World-level settings.
   */
  ASSISTANT: 3 & USER_ROLES;

  /**
   * A special User who has administrative control over this specific World.
   * Game Masters behave quite differently than Players in that they have the ability to see all Documents and
   * Objects within the world as well as the capability to configure World settings.
   */
  GAMEMASTER: 4 & USER_ROLES;
}>;
export type USER_ROLES = Brand<number, "constants.USER_ROLES">;

/**
 * Invert the User Role mapping to recover role names from a role integer
 */
export declare const USER_ROLE_NAMES: Readonly<{
  /**
   * The User is blocked from taking actions in Foundry Virtual Tabletop.
   * You can use this role to temporarily or permanently ban a user from joining the game.
   */
  "0": "NONE";

  /**
   * The User is able to join the game with permissions available to a standard player.
   * They cannot take some more advanced actions which require Trusted permissions, but they have the basic
   * functionalities needed to operate in the virtual tabletop.
   */
  "1": "PLAYER";

  /**
   * Similar to the Player role, except a Trusted User has the ability to perform some more advanced actions
   * like create drawings, measured templates, or even to (optionally) upload media files to the server.
   */
  "2": "TRUSTED";

  /**
   * A special User who has many of the same in-game controls as a Game Master User, but does not have the
   * ability to perform administrative actions like changing User roles or modifying World-level settings.
   */
  "3": "ASSISTANT";

  /**
   * A special User who has administrative control over this specific World.
   * Game Masters behave quite differently than Players in that they have the ability to see all Documents
   * and Objects within the world as well as the capability to configure World settings.
   */
  "4": "GAMEMASTER";
}>;
export type USER_ROLE_NAMES = ValueOf<typeof USER_ROLE_NAMES>;

/**
 * An enumeration of the allowed types for a MeasuredTemplate embedded document
 * @see {@link https://foundryvtt.com/article/measurement/}
 */
export declare const MEASURED_TEMPLATE_TYPES: Readonly<{
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
  disableGM: boolean;
  hint: string;
  label: string;
  defaultRole: USER_ROLES;
}

/**
 * Define the recognized User capabilities which individual Users or role levels may be permitted to perform
 */
export declare const USER_PERMISSIONS: DeepReadonly<{
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
   *   label: "PERMISSION.CardsCreate",
   *   hint: "PERMISSION.CardsCreateHint",
   *   disableGM: false,
   *   defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */

  CARDS_CREATE: UserPermission;

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
   *    label: "PERMISSION.ManualRolls",
   *    hint: "PERMISSION.ManualRollsHint",
   *    disableGM: true,
   *    defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  MANUAL_ROLLS: UserPermission;

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
   *   label: "PERMISSION.NoteCreate",
   *   hint: "PERMISSION.NoteCreateHint",
   *   disableGM: false,
   *   defaultRole: USER_ROLES.TRUSTED
   * }
   * ```
   */
  PING_CANVAS: UserPermission;

  /**
   * @defaultValue
   * ```typescript
   * {
   *   label: "PERMISSION.PlaylistCreate",
   *   hint: "PERMISSION.PlaylistCreateHint",
   *   disableGM: false,
   *   defaultRole: USER_ROLES.ASSISTANT
   * }
   * ```
   */
  PLAYLIST_CREATE: UserPermission;

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

  /**
   * @defaultValue
   * ```ts
   * {
   *   label: "PERMISSION.QueryUser",
   *   hint: "PERMISSION.QueryUserHint",
   *   disableGM: false,
   *   defaultRole: USER_ROLES.PLAYER
   * }
   * ```
   */
  QUERY_USER: UserPermission;
}>;
export type USER_PERMISSIONS = keyof typeof USER_PERMISSIONS;

/**
 * The allowed directions of effect that a Wall can have
 * @see {@link https://foundryvtt.com/article/walls/}
 */
export declare const WALL_DIRECTIONS: Readonly<{
  /**
   * The wall collides from both directions.
   */
  BOTH: 0 & WALL_DIRECTIONS;

  /**
   * The wall collides only when a ray strikes its left side.
   */
  LEFT: 1 & WALL_DIRECTIONS;

  /**
   * The wall collides only when a ray strikes its right side.
   */
  RIGHT: 2 & WALL_DIRECTIONS;
}>;
export type WALL_DIRECTIONS = Brand<number, "constants.WALL_DIRECTIONS">;

/**
 * The allowed door types which a Wall may contain
 * @see {@link https://foundryvtt.com/article/walls/}
 */
export declare const WALL_DOOR_TYPES: Readonly<{
  /**
   * The wall does not contain a door.
   */
  NONE: 0 & WALL_DOOR_TYPES;

  /**
   *  The wall contains a regular door.
   */
  DOOR: 1 & WALL_DOOR_TYPES;

  /**
   * The wall contains a secret door.
   */
  SECRET: 2 & WALL_DOOR_TYPES;
}>;
export type WALL_DOOR_TYPES = Brand<number, "constants.WALL_DOOR_TYPES">;

/**
 * The allowed door states which may describe a Wall that contains a door
 * @see {@link https://foundryvtt.com/article/walls/}
 */
export declare const WALL_DOOR_STATES: Readonly<{
  /**
   * The door is closed.
   */
  CLOSED: 0 & WALL_DOOR_STATES;

  /**
   * The door is open.
   */
  OPEN: 1 & WALL_DOOR_STATES;

  /**
   * The door is closed and locked.
   */
  LOCKED: 2 & WALL_DOOR_STATES;
}>;
export type WALL_DOOR_STATES = Brand<number, "constants.WALL_DOOR_STATES">;

/**
 * The possible ways to interact with a door
 */
export declare const WALL_DOOR_INTERACTIONS: readonly ["open", "close", "lock", "unlock", "test"];
export type WALL_DOOR_INTERACTIONS = ValueOf<typeof WALL_DOOR_INTERACTIONS>;

/**
 * The wall properties which restrict the way interaction occurs with a specific wall
 */
export declare const WALL_RESTRICTION_TYPES: readonly ["light", "sight", "sound", "move"];
export type WALL_RESTRICTION_TYPES = ValueOf<typeof WALL_RESTRICTION_TYPES>;

/**
 * The types of sensory collision which a Wall may impose
 * @see {@link https://foundryvtt.com/article/walls/}
 */
export declare const WALL_SENSE_TYPES: Readonly<{
  /**
   * Senses do not collide with this wall.
   */
  NONE: 0 & WALL_SENSE_TYPES;

  /**
   * Senses collide with this wall.
   */
  LIMITED: 10 & WALL_SENSE_TYPES;

  /**
   * Senses collide with the second intersection, bypassing the first.
   */
  NORMAL: 20 & WALL_SENSE_TYPES;

  /**
   * Senses bypass the wall within a certain proximity threshold.
   */
  PROXIMITY: 30 & WALL_SENSE_TYPES;

  /**
   * Senses bypass the wall outside a certain proximity threshold.
   */
  DISTANCE: 40 & WALL_SENSE_TYPES;
}>;
export type WALL_SENSE_TYPES = Brand<number, "constants.WALL_SENSE_TYPES">;

/**
 * The types of movement collision which a Wall may impose
 * @see {@link https://foundryvtt.com/article/walls/}
 * @privateRemarks Foundry just does `NONE: WALL_SENSE_TYPES.NONE` etc but we want to have a separate brand
 */
export declare const WALL_MOVEMENT_TYPES: Readonly<{
  /**
   * Movement does not collide with this wall.
   */
  NONE: 0 & WALL_MOVEMENT_TYPES;

  /**
   * Movement collides with this wall.
   */
  NORMAL: 20 & WALL_MOVEMENT_TYPES;
}>;
export type WALL_MOVEMENT_TYPES = Brand<number, "constants.WALL_MOVEMENT_TYPES">;

/**
 * The possible precedence values a Keybinding might run in
 * @see {@link https://foundryvtt.com/article/keybinds/}
 */
export declare const KEYBINDING_PRECEDENCE: Readonly<{
  /**
   * Runs in the first group along with other PRIORITY keybindings.
   */
  PRIORITY: 0 & KEYBINDING_PRECEDENCE;

  /**
   * Runs after the PRIORITY group along with other NORMAL keybindings.
   */
  NORMAL: 1 & KEYBINDING_PRECEDENCE;

  /**
   * Runs in the last group along with other DEFERRED keybindings.
   */
  DEFERRED: 2 & KEYBINDING_PRECEDENCE;
}>;
export type KEYBINDING_PRECEDENCE = Brand<number, "constants.KEYBINDING_PRECEDENCE">;

/**
 * Directories in the public storage path.
 */
export const FILE_PICKER_PUBLIC_DIRS: readonly ["cards", "css", "fonts", "icons", "lang", "scripts", "sounds", "ui"];
export type FILE_PICKER_PUBLIC_DIRS = ValueOf<typeof FILE_PICKER_PUBLIC_DIRS>;

/**
 * The allowed set of HTML template extensions
 */
export declare const HTML_FILE_EXTENSIONS: Readonly<{
  handlebars: "text/x-handlebars-template";
  hbs: "text/x-handlebars-template";
  html: "text/html";
}>;
export declare type HTML_FILE_EXTENSIONS = keyof typeof HTML_FILE_EXTENSIONS;

/**
 * The supported file extensions for image-type files, and their corresponding mime types.
 */
export declare const IMAGE_FILE_EXTENSIONS: Readonly<{
  apng: "image/apng";
  avif: "image/avif";
  bmp: "image/bmp";
  gif: "image/gif";
  jpeg: "image/jpeg";
  jpg: "image/jpeg";
  png: "image/png";
  svg: "image/svg+xml";
  tiff: "image/tiff";
  webp: "image/webp";
}>;
export type IMAGE_FILE_EXTENSIONS = keyof typeof IMAGE_FILE_EXTENSIONS;

/**
 * The supported file extensions for video-type files, and their corresponding mime types.
 */
export declare const VIDEO_FILE_EXTENSIONS: Readonly<{
  m4v: "video/mp4";
  mp4: "video/mp4";
  ogv: "video/ogg";
  webm: "video/webm";
}>;
export type VIDEO_FILE_EXTENSIONS = keyof typeof VIDEO_FILE_EXTENSIONS;

/**
 * The supported file extensions for audio-type files, and their corresponding mime types.
 */
export declare const AUDIO_FILE_EXTENSIONS: Readonly<{
  aac: "audio/aac";
  flac: "audio/flac";
  m4a: "audio/mp4";
  mid: "audio/midi";
  mp3: "audio/mpeg";
  ogg: "audio/ogg";
  opus: "audio/opus";
  wav: "audio/wav";
  webm: "audio/webm";
}>;
export type AUDIO_FILE_EXTENSIONS = keyof typeof AUDIO_FILE_EXTENSIONS;

/**
 * The supported file extensions for text files, and their corresponding mime types.
 */
export declare const TEXT_FILE_EXTENSIONS: Readonly<{
  csv: "text/csv";
  json: "application/json";
  md: "text/markdown";
  pdf: "application/pdf";
  tsv: "text/tab-separated-values";
  txt: "text/plain";
  xml: "application/xml";
  yml: "application/yaml";
  yaml: "application/yaml";
}>;
export type TEXT_FILE_EXTENSIONS = keyof typeof TEXT_FILE_EXTENSIONS;

/**
 * Supported file extensions for font files, and their corresponding mime types.
 */
export declare const FONT_FILE_EXTENSIONS: Readonly<{
  otf: "font/otf";
  ttf: "font/ttf";
  woff: "font/woff";
  woff2: "font/woff2";
}>;
export type FONT_FILE_EXTENSIONS = keyof typeof FONT_FILE_EXTENSIONS;

/**
 * Supported file extensions for 3D files, and their corresponding mime types.
 */
export declare const GRAPHICS_FILE_EXTENSIONS: Readonly<{
  fbx: "application/octet-stream";
  glb: "model/gltf-binary";
  gltf: "model/gltf+json";
  mtl: "model/mtl";
  obj: "model/obj";
  stl: "model/stl";
  usdz: "model/vnd.usdz+zip";
}>;
export type GRAPHICS_FILE_EXTENSIONS = keyof typeof GRAPHICS_FILE_EXTENSIONS;

/**
 * @privateRemarks Video is spread in after audio, so its `ogg` and `webm` keys override
 */
interface _UPLOADABLE_FILE_EXTENSIONS
  extends Identity<typeof IMAGE_FILE_EXTENSIONS>,
    Omit<typeof AUDIO_FILE_EXTENSIONS, "ogg" | "webm">,
    Identity<typeof VIDEO_FILE_EXTENSIONS>,
    Identity<typeof TEXT_FILE_EXTENSIONS>,
    Identity<typeof FONT_FILE_EXTENSIONS>,
    Identity<typeof GRAPHICS_FILE_EXTENSIONS> {}

export declare const UPLOADABLE_FILE_EXTENSIONS: Readonly<_UPLOADABLE_FILE_EXTENSIONS>;
export type UPLOADABLE_FILE_EXTENSIONS = keyof typeof UPLOADABLE_FILE_EXTENSIONS;

/**
 * An enumeration of file type categories which can be selected
 */
export declare const FILE_CATEGORIES: Readonly<{
  HTML: typeof HTML_FILE_EXTENSIONS;
  IMAGE: typeof IMAGE_FILE_EXTENSIONS;
  VIDEO: typeof VIDEO_FILE_EXTENSIONS;
  AUDIO: typeof AUDIO_FILE_EXTENSIONS;
  TEXT: typeof TEXT_FILE_EXTENSIONS;
  FONT: typeof FONT_FILE_EXTENSIONS;
  GRAPHICS: typeof GRAPHICS_FILE_EXTENSIONS;

  /**
   * @deprecated "`CONST.FILE_CATEGORIES.MEDIA` is deprecated. Use {@linkcode CONST.MEDIA_MIME_TYPES} instead." (since v13, until v15)
   * @remarks Included in the const body as a getter, *then* `defineProperty`'d to be `enumerable: false` separately
   */
  get MEDIA(): typeof MEDIA_MIME_TYPES;
}>;
export type FILE_CATEGORIES = keyof typeof FILE_CATEGORIES;

/**
 * The list of file categories that are "media".
 */
export declare const MEDIA_FILE_CATEGORIES: readonly ["IMAGE", "VIDEO", "AUDIO", "TEXT", "FONT", "GRAPHICS"];
export type MEDIA_FILE_CATEGORIES = ValueOf<typeof MEDIA_FILE_CATEGORIES>;

/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 * @remarks Not frozen as of 13.346
 * @privateRemarks The *keys* `ogg` and `webm` conflict when building {@linkcode UPLOADABLE_FILE_EXTENSIONS}, but the values don't, and Foundry
 * constructs this differently than we are so they keep the values
 */
export declare const MEDIA_MIME_TYPES: MEDIA_MIME_TYPES[];
export type MEDIA_MIME_TYPES =
  | ValueOf<_UPLOADABLE_FILE_EXTENSIONS>
  | ValueOf<Pick<typeof AUDIO_FILE_EXTENSIONS, "ogg" | "webm">>;

/**
 * A font weight to name mapping.
 */
export declare const FONT_WEIGHTS: Readonly<{
  Thin: 100 & FONT_WEIGHTS;
  ExtraLight: 200 & FONT_WEIGHTS;
  Light: 300 & FONT_WEIGHTS;
  Regular: 400 & FONT_WEIGHTS;
  Medium: 500 & FONT_WEIGHTS;
  SemiBold: 600 & FONT_WEIGHTS;
  Bold: 700 & FONT_WEIGHTS;
  ExtraBold: 800 & FONT_WEIGHTS;
  Black: 900 & FONT_WEIGHTS;
}>;
export type FONT_WEIGHTS = Brand<number, "constants.FONT_WEIGHTS">;

/**
 * Stores shared commonly used timeouts, measured in MS
 */
export declare const TIMEOUTS: Readonly<{
  /**
   * The default timeout for interacting with the foundryvtt.com API.
   */
  FOUNDRY_WEBSITE: 10000;

  /**
   * The specific timeout for loading the list of packages from the foundryvtt.com API.
   */
  PACKAGE_REPOSITORY: 10000;

  /**
   * The specific timeout for the IP address lookup service.
   */
  IP_DISCOVERY: 5000;

  /**
   * A remote package manifest JSON or download ZIP.
   */
  REMOTE_PACKAGE: 5000;
}>;

/**
 * A subset of Compendium types which require a specific system to be designated
 */
export declare const SYSTEM_SPECIFIC_COMPENDIUM_TYPES: readonly ["Actor", "Item"];
export type SYSTEM_SPECIFIC_COMPENDIUM_TYPES = ValueOf<typeof SYSTEM_SPECIFIC_COMPENDIUM_TYPES>;

/**
 * The configured showdown bi-directional HTML \<-\> Markdown converter options.
 */
export declare const SHOWDOWN_OPTIONS: Readonly<{
  disableForced4SpacesIndentedSublists: true;
  noHeaderId: true;
  parseImgDimensions: true;
  strikethrough: true;
  tables: true;
  tablesHeaderId: true;
}>;

/**
 * The list of allowed HTML tags.
 */
export declare const ALLOWED_HTML_TAGS: readonly [
  "header",
  "main",
  "section",
  "article",
  "aside",
  "nav",
  "footer",
  "div",
  "address", // Structural Elements
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "br", // Headers and Dividers
  "p",
  "blockquote",
  "summary",
  "details",
  "span",
  "code",
  "pre",
  "a",
  "label",
  "abbr",
  "cite",
  "mark",
  "q",
  "ruby",
  "rp",
  "rt",
  "small",
  "time",
  "var",
  "kbd",
  "samp", // Text Types
  "dfn",
  "sub",
  "sup",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "s",
  "del",
  "ins", // Text Styles
  "ol",
  "ul",
  "li",
  "dl",
  "dd",
  "dt",
  "menu", // Lists
  "table",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
  "col",
  "colgroup", // Tables
  "form",
  "input",
  "select",
  "option",
  "button",
  "datalist",
  "fieldset",
  "legend",
  "meter",
  "optgroup",
  "progress",
  "textarea",
  "output", // Forms
  "figure",
  "figcaption",
  "caption",
  "img",
  "video",
  "map",
  "area",
  "track",
  "picture",
  "source",
  "audio", // Media
  "iframe", // Embedded content
  "color-picker",
  "code-mirror",
  "document-embed",
  "document-tags",
  "enriched-content",
  "file-picker",
  "hue-slider",
  "multi-select",
  "multi-checkbox",
  "range-picker",
  "secret-block",
  "string-tags",
  "prose-mirror", // Custom elements
];
export type ALLOWED_HTML_TAGS = ValueOf<typeof ALLOWED_HTML_TAGS>;

/**
 * The list of allowed attributes in HTML elements.
 */
export const ALLOWED_HTML_ATTRIBUTES: DeepReadonly<{
  "*": [
    "class",
    "data-*",
    "id",
    "title",
    "style",
    "draggable",
    "aria-*",
    "tabindex",
    "dir",
    "hidden",
    "inert",
    "role",
    "is",
    "lang",
    "popover",
    "autocapitalize",
    "autocorrect",
    "autofocus",
    "contenteditable",
    "spellcheck",
    "translate",
  ];
  a: ["href", "name", "target", "rel"];
  area: ["alt", "coords", "href", "rel", "shape", "target"];
  audio: ["controls", "loop", "muted", "src", "autoplay"];
  blockquote: ["cite"];
  button: ["disabled", "name", "type", "value"];
  col: ["span"];
  colgroup: ["span"];
  "code-mirror": ["disabled", "name", "value", "placeholder", "readonly", "required", "language", "indent", "nowrap"];
  "color-picker": ["disabled", "name", "value", "placeholder", "readonly", "required"];
  details: ["open"];
  "document-embed": ["uuid"];
  "document-tags": ["disabled", "name", "value", "placeholder", "readonly", "required", "type", "single", "max"];
  "enriched-content": ["enricher"];
  fieldset: ["disabled"];
  "file-picker": ["disabled", "name", "value", "placeholder", "readonly", "required", "type", "noupload"];
  form: ["name"];
  "hue-slider": ["disabled", "name", "value", "readonly", "required"];
  iframe: ["src", "srcdoc", "name", "height", "width", "loading", "sandbox"];
  img: ["height", "src", "width", "usemap", "sizes", "srcset", "alt"];
  input: [
    "checked",
    "disabled",
    "name",
    "value",
    "placeholder",
    "type",
    "alt",
    "height",
    "list",
    "max",
    "min",
    "readonly",
    "size",
    "src",
    "step",
    "width",
    "required",
  ];
  label: ["for"];
  li: ["value"];
  map: ["name"];
  meter: ["value", "min", "max", "low", "high", "optimum"];
  "multi-checkbox": ["disabled", "name", "required"];
  "multi-select": ["disabled", "name", "required"];
  ol: ["reversed", "start", "type"];
  optgroup: ["disabled", "label"];
  option: ["disabled", "selected", "label", "value"];
  output: ["for", "form", "name"];
  progress: ["max", "value"];
  "prose-mirror": ["disabled", "name", "value", "placeholder", "readonly", "required", "toggled", "open"];
  "range-picker": ["disabled", "name", "value", "placeholder", "readonly", "min", "max", "step"];
  select: ["name", "disabled", "multiple", "size", "required"];
  source: ["media", "sizes", "src", "srcset", "type"];
  "string-tags": ["disabled", "name", "value", "placeholder", "readonly", "required"];
  table: ["border"];
  td: ["colspan", "headers", "rowspan"];
  textarea: ["rows", "cols", "disabled", "name", "readonly", "wrap", "required"];
  time: ["datetime"];
  th: ["abbr", "colspan", "headers", "rowspan", "scope", "sorted"];
  track: ["default", "kind", "label", "src", "srclang"];
  video: ["controls", "height", "width", "loop", "muted", "poster", "src", "autoplay"];
}>;
export type ALLOWED_HTML_ATTRIBUTES = typeof ALLOWED_HTML_ATTRIBUTES;

/**
 * The list of allowed URL schemes.
 */
export declare const ALLOWED_URL_SCHEMES: readonly ["http", "https", "data", "mailto", "obsidian", "syrinscape-online"];
export type ALLOWED_URL_SCHEMES = ValueOf<typeof ALLOWED_URL_SCHEMES>;

/**
 * The list of attributes validated as URLs.
 */
export declare const ALLOWED_URL_SCHEMES_APPLIED_TO_ATTRIBUTES: readonly ["href", "src", "cite"];
export type ALLOWED_URL_SCHEMES_APPLIED_TO_ATTRIBUTES = ValueOf<typeof ALLOWED_URL_SCHEMES_APPLIED_TO_ATTRIBUTES>;

/**
 * The list of trusted iframe domains.
 */
export declare const TRUSTED_IFRAME_DOMAINS: ["google.com", "youtube.com"];
export type TRUSTED_IFRAME_DOMAINS = ValueOf<typeof TRUSTED_IFRAME_DOMAINS>;

/**
 * Available themes for the world join page.
 */
export const WORLD_JOIN_THEMES: Readonly<{
  default: "WORLD.JOIN_THEMES.default";
  minimal: "WORLD.JOIN_THEMES.minimal";
}>;
export type WORLD_JOIN_THEMES = ValueOf<typeof WORLD_JOIN_THEMES>;

/**
 * Setup page package progress protocol.
 */
export declare const SETUP_PACKAGE_PROGRESS: DeepReadonly<{
  ACTIONS: {
    CREATE_BACKUP: "createBackup";
    RESTORE_BACKUP: "restoreBackup";
    DELETE_BACKUP: "deleteBackup";
    CREATE_SNAPSHOT: "createSnapshot";
    RESTORE_SNAPSHOT: "restoreSnapshot";
    DELETE_SNAPSHOT: "deleteSnapshot";
    INSTALL_PKG: "installPackage";
    LAUNCH_WORLD: "launchWorld";
    UPDATE_CORE: "updateCore";
    UPDATE_DOWNLOAD: "updateDownload";
  };
  STEPS: {
    ARCHIVE: "archive";
    CHECK_DISK_SPACE: "checkDiskSpace";
    CLEAN_WORLD: "cleanWorld";
    EXTRACT_DEMO: "extractDemo";
    CONNECT_WORLD: "connectWorld";
    MIGRATE_WORLD: "migrateWorld";
    CONNECT_PKG: "connectPackage";
    MIGRATE_PKG: "migratePackage";
    MIGRATE_CORE: "migrateCore";
    MIGRATE_SYSTEM: "migrateSystem";
    DOWNLOAD: "download";
    EXTRACT: "extract";
    INSTALL: "install";
    CLEANUP: "cleanup";
    COMPLETE: "complete";
    DELETE: "delete";
    ERROR: "error";
    VEND: "vend";
    SNAPSHOT_MODULES: "snapshotModules";
    SNAPSHOT_SYSTEMS: "snapshotSystems";
    SNAPSHOT_WORLDS: "snapshotWorlds";
  };
}>;
declare namespace SETUP_PACKAGE_PROGRESS {
  export type ACTIONS = ValueOf<typeof SETUP_PACKAGE_PROGRESS.ACTIONS>;
  export type STEPS = ValueOf<typeof SETUP_PACKAGE_PROGRESS.STEPS>;
}

/**
 * The combat announcements.
 */
export declare const COMBAT_ANNOUNCEMENTS: readonly ["startEncounter", "nextUp", "yourTurn"];
export type COMBAT_ANNOUNCEMENTS = ValueOf<typeof COMBAT_ANNOUNCEMENTS>;

/**
 * The fit modes of {@link foundry.data.TextureData.fit | `foundry.data.TextureData#fit`}.
 */
export declare const TEXTURE_DATA_FIT_MODES: readonly ["fill", "contain", "cover", "width", "height"];
export type TEXTURE_DATA_FIT_MODES = ValueOf<typeof TEXTURE_DATA_FIT_MODES>;

/**
 * The maximum depth to recurse to when embedding enriched text.
 * @defaultValue `5`
 */
export const TEXT_ENRICH_EMBED_MAX_DEPTH: number;

/**
 * The Region events that are supported by core.
 */
export declare const REGION_EVENTS: Readonly<{
  /**
   * Triggered when the shapes or bottom/top elevation of the Region are changed.
   *
   * @see {@linkcode foundry.documents.types.RegionRegionBoundaryEvent}
   */
  REGION_BOUNDARY: "regionBoundary";

  /**
   * Triggered when the Region Behavior becomes active, i.e. is enabled or created without being disabled.
   *
   * The event is triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionBehaviorActivatedEvent}
   */
  BEHAVIOR_ACTIVATED: "behaviorActivated";

  /**
   * Triggered when the Region Behavior becomes inactive, i.e. is disabled or deleted without being disabled.
   *
   * The event is triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionBehaviorDeactivatedEvent}
   */
  BEHAVIOR_DEACTIVATED: "behaviorDeactivated";

  /**
   * Triggered when the Region Behavior becomes viewed, i.e. active and the Scene of its Region is viewed.
   *
   * The event is triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionBehaviorViewedEvent}
   */
  BEHAVIOR_VIEWED: "behaviorViewed";

  /**
   * Triggered when the Region Behavior becomes unviewed, i.e. inactive or the Scene of its Region is unviewed.
   *
   * The event is triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionBehaviorUnviewedEvent}
   */
  BEHAVIOR_UNVIEWED: "behaviorUnviewed";

  /**
   * Triggered when a Token enters a Region.
   *
   * A Token enters a Region whenever ...
   *   - it is created within the Region,
   *   - the boundary of the Region has changed such that the Token is now inside the Region,
   *   - the Token moves into the Region (the Token's x, y, elevation, width, height, or shape
   *     has changed such that it is now inside the Region), or
   *   - a Region Behavior becomes active (i.e., is enabled or created while enabled), in which case
   *     the event it triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenEnterEvent}
   */
  TOKEN_ENTER: "tokenEnter";

  /**
   * Triggered when a Token exits a Region.
   *
   * A Token exits a Region whenever ...
   *   - it is deleted while inside the Region,
   *   - the boundary of the Region has changed such that the Token is no longer inside the Region,
   *   - the Token moves out of the Region (the Token's x, y, elevation, width, height, or shape
   *     has changed such that it is no longer inside the Region), or
   *   - a Region Behavior becomes inactive (i.e., is disabled or deleted while enabled), in which case
   *     the event it triggered only for this Region Behavior.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenExitEvent}
   */
  TOKEN_EXIT: "tokenExit";

  /**
   * Triggered when a Token moves into a Region.
   *
   * A Token moves whenever its x, y, elevation, width, height, or shape is changed.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenMoveInEvent}
   */
  TOKEN_MOVE_IN: "tokenMoveIn";

  /**
   * Triggered when a Token moves out of a Region.
   *
   * A Token moves whenever its x, y, elevation, width, height, or shape is changed.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenMoveOutEvent}
   */
  TOKEN_MOVE_OUT: "tokenMoveOut";

  /**
   * Triggered when a Token moves within a Region.
   *
   * A token moves whenever its x, y, elevation, width, height, or shape is changed.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenMoveWithinEvent}
   */
  TOKEN_MOVE_WITHIN: "tokenMoveWithin";

  /**
   * Triggered when a Token animates into a Region.
   *
   * This event is only triggered only if the Scene the Token is in is viewed.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenAnimateInEvent}
   */
  TOKEN_ANIMATE_IN: "tokenAnimateIn";

  /**
   * Triggered when a Token animates out of a Region.
   *
   * This event is triggered only if the Scene the Token is in is viewed.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenAnimateOutEvent}
   */
  TOKEN_ANIMATE_OUT: "tokenAnimateOut";

  /**
   * Triggered when a Token starts its Combat turn in a Region.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenTurnStartEvent}
   */
  TOKEN_TURN_START: "tokenTurnStart";

  /**
   * Triggered when a Token ends its Combat turn in a Region.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenTurnEndEvent}
   */
  TOKEN_TURN_END: "tokenTurnEnd";

  /**
   * Triggered when a Token starts the Combat round in a Region.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenRoundStartEvent}
   */
  TOKEN_ROUND_START: "tokenRoundStart";

  /**
   * Triggered when a Token ends the Combat round in a Region.
   *
   * @see {@linkcode foundry.documents.types.RegionTokenRoundEndEvent}
   */
  TOKEN_ROUND_END: "tokenRoundEnd";

  /**
   * @deprecated "`CONST.REGION_EVENTS.BEHAVIOR_STATUS` is deprecated in favor of `BEHAVIOR_ACTIVATED`,
   * `BEHAVIOR_DEACTIVATED`, `BEHAVIOR_VIEWED`, and `BEHAVIOR_UNVIEWED`." (since v13, until v15)
   */
  get BEHAVIOR_STATUS(): "behaviorStatus";

  /**
   * @deprecated "`CONST.REGION_EVENTS.TOKEN_PRE_MOVE` is deprecated without replacement. The `TOKEN_PRE_MOVE`
   * event is not longer triggered." (since v13, until v15)
   */
  get TOKEN_PRE_MOVE(): "tokenPreMove";

  /**
   * @deprecated "`CONST.REGION_EVENTS.TOKEN_PRE_MOVE` is deprecated without replacement. The `TOKEN_MOVE`
   * event is not longer triggered." (since v13, until v15)
   */
  get TOKEN_MOVE(): "tokenMove";
}>;
export type REGION_EVENTS = ValueOf<typeof REGION_EVENTS>;

/**
 * The possible visibility state of Region.
 */
export declare const REGION_VISIBILITY: Readonly<{
  /**
   * Only visible on the RegionLayer.
   */
  LAYER: 0 & REGION_VISIBILITY;

  /**
   * Only visible to Gamemasters.
   */
  GAMEMASTER: 1 & REGION_VISIBILITY;

  /**
   * Visible to anyone.
   */
  ALWAYS: 2 & REGION_VISIBILITY;
}>;
export type REGION_VISIBILITY = Brand<number, "constants.REGION_VISIBILITY">;

export declare const REGION_MOVEMENT_SEGMENTS: Readonly<{
  /**
   * The segment crosses the boundary of the Region and exits it.
   */
  EXIT: -1 & REGION_MOVEMENT_SEGMENTS;

  /**
   * The segment does not cross the boundary of the region and is contained within it.
   */
  MOVE: 0 & REGION_MOVEMENT_SEGMENTS;

  /**
   * The segment crosses the boundary of the region and enters it.
   */
  ENTER: 1 & REGION_MOVEMENT_SEGMENTS;
}>;
export type REGION_MOVEMENT_SEGMENTS = Brand<number, "constants.REGION_MOVEMENT_SEGMENTS">;

/**
 * Available setting scopes.
 */
export declare const SETTING_SCOPES: Readonly<{
  /**
   * Settings scoped to the client device. Stored in localStorage.
   */
  CLIENT: "client";

  /**
   * Settings scoped to the game World. Applies to all Users in the World. Stored in the Settings database.
   */
  WORLD: "world";

  /**
   * Settings scoped to an individual User in the World. Stored in the Settings database.
   */
  USER: "user";
}>;
export type SETTING_SCOPES = ValueOf<typeof SETTING_SCOPES>;

/**
 * The scaling factor that is used for Clipper polygons/paths consistently everywhere core performs Clipper operations.
 * @defaultValue `100`
 */
export declare const CLIPPER_SCALING_FACTOR: number;

/**
 * @deprecated (since v12, until v14)
 */
export declare const CHAT_MESSAGE_TYPES: Readonly<{
  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  OTHER: typeof CHAT_MESSAGE_STYLES.OTHER;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  OOC: typeof CHAT_MESSAGE_STYLES.OOC;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  IC: typeof CHAT_MESSAGE_STYLES.IC;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  EMOTE: typeof CHAT_MESSAGE_STYLES.EMOTE;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  ROLL: typeof CHAT_MESSAGE_STYLES.ROLL;

  /**
   * @deprecated "`CONST.CHAT_MESSAGE_TYPES` is deprecated in favor of {@linkcode CONST.CHAT_MESSAGE_STYLES} because the {@linkcode ChatMessage.type | ChatMessage#type}
   * field has been renamed to {@linkcode ChatMessage.style | ChatMessage#style}" (since v12, until v14)
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  WHISPER: typeof CHAT_MESSAGE_STYLES.WHISPER;
}>;
export type CHAT_MESSAGE_TYPES = CHAT_MESSAGE_STYLES;

/**
 * @deprecated "`CONST.DOCUMENT_TYPES` is deprecated in favor of either {@linkcode CONST.WORLD_DOCUMENT_TYPES} or {@linkcode CONST.COMPENDIUM_DOCUMENT_TYPES}." (since v12, until 14)
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export declare const DOCUMENT_TYPES: DOCUMENT_TYPES[];
export type DOCUMENT_TYPES = Exclude<WORLD_DOCUMENT_TYPES, "FogExploration" | "Setting">;

/**
 * @deprecated "`CONST.TOKEN_HEXAGONAL_SHAPES` is deprecated in favor of {@linkcode CONST.TOKEN_SHAPES}." (since v13, until v15)
 */
export declare const TOKEN_HEXAGONAL_SHAPES: typeof TOKEN_SHAPES;
export type TOKEN_HEXAGONAL_SHAPES = TOKEN_SHAPES;
