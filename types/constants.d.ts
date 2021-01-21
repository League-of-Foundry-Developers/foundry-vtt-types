declare const vtt: 'Foundry VTT'
declare const VTT: 'Foundry Virtual Tabletop'
declare const WEBSITE_URL: 'https://foundryvtt.com'
declare const ASCII = `_______________________________________________________________
 _____ ___  _   _ _   _ ____  ______   __ __     _______ _____ 
|  ___/ _ \\| | | | \\ | |  _ \\|  _ \\ \\ / / \\ \\   / |_   _|_   _|
| |_ | | | | | | |  \\| | | | | |_) \\ V /   \\ \\ / /  | |   | |  
|  _|| |_| | |_| | |\\  | |_| |  _ < | |     \\ V /   | |   | |  
|_|   \\___/ \\___/|_| \\_|____/|_| \\_\\|_|      \\_/    |_|   |_|  
===============================================================`

/**
 * Define the allowed ActiveEffect application modes
 */
declare const ACTIVE_EFFECT_MODES: {
  CUSTOM: Const.ActiveEffectModes.Custom
  MULTIPLY: Const.ActiveEffectModes.Multiply
  ADD: Const.ActiveEffectModes.Add
  DOWNGRADE: Const.ActiveEffectModes.Downgrade
  UPGRADE: Const.ActiveEffectModes.Upgrade
  OVERRIDE: Const.ActiveEffectModes.Override
}

/**
 * Define the string name used for the base entity type when specific sub-types are not defined by the system
 */
declare const BASE_ENTITY_TYPE: 'base'

/**
 * Valid Chat Message types
 */
declare const CHAT_MESSAGE_TYPES: {
  OTHER: Const.ChatMessageTypes.Other
  OOC: Const.ChatMessageTypes.OOC
  IC: Const.ChatMessageTypes.IC
  EMOTE: Const.ChatMessageTypes.Emote
  WHISPER: Const.ChatMessageTypes.Whisper
  ROLL: Const.ChatMessageTypes.Roll
}

/**
 * The allowed Entity types which may exist within a Compendium pack
 * This is a subset of ENTITY_TYPES
 */
declare const COMPENDIUM_ENTITY_TYPES: [
  'Actor',
  'Item',
  'Scene',
  'JournalEntry',
  'Macro',
  'RollTable',
  'Playlist'
]

/**
 * Define the set of languages which have built-in support in the core software
 */
declare const CORE_SUPPORTED_LANGUAGES: [
  'en'
]

/**
 * The default artwork used for Token images if none is provided
 */
declare const DEFAULT_TOKEN: 'icons/svg/mystery-man.svg'

/**
 * The default artwork used for Note placeables if none is provided
 */
declare const DEFAULT_NOTE_ICON: 'icons/svg/book.svg'

/**
 * The supported dice roll visibility modes
 */
declare const DICE_ROLL_MODES: {
  PUBLIC: Const.DiceRollModes.Public
  PRIVATE: Const.DiceRollModes.Private
  BLIND: Const.DiceRollModes.Blind
  SELF: Const.DiceRollModes.Self
}

/**
 * The allowed Drawing types which may be saved
 */
declare const DRAWING_TYPES: {
  RECTANGLE: Const.DrawingTypes.Rectangle
  ELLIPSE: Const.DrawingTypes.Ellipse
  TEXT: Const.DrawingTypes.Text
  POLYGON: Const.DrawingTypes.Polygon
  FREEHAND: Const.DrawingTypes.Freehand
}

/**
 * The allowed fill types which a Drawing object may display
 * NONE: The drawing is not filled
 * SOLID: The drawing is filled with a solid color
 * PATTERN: The drawing is filled with a tiled image pattern
 */
declare const DRAWING_FILL_TYPES: {
  NONE: Const.DrawingFillTypes.None
  SOLID: Const.DrawingFillTypes.Solid
  PATTERN: Const.DrawingFillTypes.Pattern
}

/**
 * The default configuration values used for Drawing objects
 */
declare const DRAWING_DEFAULT_VALUES: {
  width: 0
  height: 0
  rotation: 0
  z: 0
  hidden: false
  locked: false
  fillType: 0
  fillAlpha: 0.5
  bezierFactor: 0.0
  strokeAlpha: 1.0
  strokeWidth: 8
  fontSize: 48
  textAlpha: 1.0
  textColor: '#FFFFFF'
}

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
]

/**
 * Define the allowed Entity types which may be dynamically linked in chat
 */
declare const ENTITY_LINK_TYPES: [
  'Actor',
  'Item',
  'Scene',
  'JournalEntry',
  'Macro',
  'RollTable'
]

/**
 * Define the allowed permission levels for a non-user Entity.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
declare const ENTITY_PERMISSIONS: {
  NONE: Const.EntityPermissions.None
  LIMITED: Const.EntityPermissions.Limited
  OBSERVER: Const.EntityPermissions.Observer
  OWNER: Const.EntityPermissions.Owner
}

/**
 * EULA version number
 */
declare const EULA_VERSION: '0.6.1'

/**
 * Define the allowed Entity types which Folders may contain
 */
declare const FOLDER_ENTITY_TYPES: [
  'Actor',
  'Item',
  'Scene',
  'JournalEntry',
  'RollTable'
]

/**
 * The maximum allowed level of depth for Folder nesting
 */
declare const FOLDER_MAX_DEPTH: 3

/**
 * The minimum allowed grid size which is supported by the software
 */
declare const GRID_MIN_SIZE: 50

/**
 * The allowed Grid types which are supported by the software
 */
declare const GRID_TYPES: {
  GRIDLESS: Const.GridTypes.Gridless
  SQUARE: Const.GridTypes.Square
  HEXODDR: Const.GridTypes.HexOddR
  HEXEVENR: Const.GridTypes.HexEvenR
  HEXODDQ: Const.GridTypes.HexOddQ
  HEXEVENQ: Const.GridTypes.HexEvenQ
}

/**
 * Enumerate the source types which can be used for an AmbientLight placeable object
 */
declare const SOURCE_TYPES: {
  LOCAL: Const.SourceTypes.Local
  GLOBAL: Const.SourceTypes.Global
  UNIVERSAL: Const.SourceTypes.Universal
}

/**
 * An Array of valid MacroAction scope values
 */
declare const MACRO_SCOPES: [
  'global',
  'actors',
  'actor'
]

/**
 * The allowed playback modes for an audio Playlist
 * DISABLED: The playlist does not play on its own, only individual Sound tracks played as a soundboard
 * SEQUENTIAL: The playlist plays sounds one at a time in sequence
 * SHUFFLE: The playlist plays sounds one at a time in randomized order
 * SIMULTANEOUS: The playlist plays all contained sounds at the same time
 */
declare const PLAYLIST_MODES: {
  DISABLED: Const.PlaylistModes.Disabled
  SEQUENTIAL: Const.PlaylistModes.Sequential
  SHUFFLE: Const.PlaylistModes.Shuffle
  SIMULTANEOUS: Const.PlaylistModes.Simultaneous
}

/**
 * Encode the reasons why a package may be available or unavailable for use
 */
declare const PACKAGE_AVAILABILITY_CODES: {
  UNKNOWN: Const.PackageAvailabilityCodes.Unknown
  REQUIRES_UPDATE: Const.PackageAvailabilityCodes.RequiresUpdate
  AVAILABLE: Const.PackageAvailabilityCodes.Available
  REQUIRES_SYSTEM: Const.PackageAvailabilityCodes.RequiresSystem
  REQUIRES_DEPENDENCY: Const.PackageAvailabilityCodes.RequiresDependency
  REQUIRES_CORE: Const.PackageAvailabilityCodes.RequiresCore
}

/**
 * A safe password string which can be displayed
 */
declare const PASSWORD_SAFE_STRING: '••••••••••••••••'

/**
 * The allowed software update channels
 */
declare const SOFTWARE_UPDATE_CHANNELS: {
  alpha: Const.SoftwareUpdateChannels.Alpha
  beta: Const.SoftwareUpdateChannels.Beta
  release: Const.SoftwareUpdateChannels.Release
}

/**
 * The default sorting density for manually ordering child objects within a
 * parent
 */
declare const SORT_INTEGER_DENSITY: 100000

/**
 * The allowed types of a TableResult document
 */
declare const TABLE_RESULT_TYPES: {
  TEXT: Const.TableResultTypes.Text
  ENTITY: Const.TableResultTypes.Entity
  COMPENDIUM: Const.TableResultTypes.Compendium
}

/**
 * Define the valid anchor locations for a Tooltip displayed on a Placeable Object
 */
declare const TEXT_ANCHOR_POINTS: {
  BOTTOM: Const.TextAnchorPoints.Bottom
  CENTER: Const.TextAnchorPoints.Center
  LEFT: Const.TextAnchorPoints.Left
  RIGHT: Const.TextAnchorPoints.Right
  TOP: Const.TextAnchorPoints.Top
}

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
  NONE: Const.TokenDisplayModes.None
  CONTROL: Const.TokenDisplayModes.Control
  OWNER_HOVER: Const.TokenDisplayModes.OwnerHover
  HOVER: Const.TokenDisplayModes.Hover
  OWNER: Const.TokenDisplayModes.Owner
  ALWAYS: Const.TokenDisplayModes.Always
}

/**
 * The allowed Token disposition types
 * HOSTILE - Displayed as an enemy with a red border
 * NEUTRAL - Displayed as neutral with a yellow border
 * FRIENDLY - Displayed as an ally with a cyan border
 */
declare const TOKEN_DISPOSITIONS: {
  HOSTILE: Const.TokenDispositions.Hostile
  NEUTRAL: Const.TokenDispositions.Neutral
  FRIENDLY: Const.TokenDispositions.Friendly
}

/**
 * Define the allowed User permission levels.
 * Each level is assigned a value in ascending order. Higher levels grant more permissions.
 */
declare const USER_ROLES: {
  NONE: Const.UserRoles.None
  PLAYER: Const.UserRoles.Player
  TRUSTED: Const.UserRoles.Trusted
  ASSISTANT: Const.UserRoles.Assistant
  GAMEMASTER: Const.UserRoles.GameMaster
}

/**
 * Invert the User Role mapping to recover role names from a role integer
 */
declare const USER_ROLE_NAMES: {
  0: 'NONE'
  1: 'PLAYER'
  2: 'TRUSTED'
  3: 'ASSISTANT'
  4: 'GAMEMASTER'
}

/**
 * A list of MIME types which are treated as uploaded "media", which are allowed to overwrite existing files.
 * Any non-media MIME type is not allowed to replace an existing file.
 */
declare const MEDIA_MIME_TYPES: [
  'image/apng',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'audio/wave',
  'audio/wav',
  'audio/webm',
  'audio/ogg',
  'audio/midi',
  'audio/mpeg',
  'audio/opus',
  'audio/aac',
  'video/mpeg',
  'video/mp4',
  'video/ogg',
  'application/json',
  'application/ogg',
  'application/pdf',
]

/**
 * Define the named actions which users or user roles can be permitted to do.
 * Each key of this Object denotes an action for which permission may be granted (true) or withheld (false)
 */
declare const USER_PERMISSIONS: {
  BROADCAST_AUDIO: {
    label: 'PERMISSION.BroadcastAudio'
    hint: 'PERMISSION.BroadcastAudioHint'
    disableGM: true
    defaultRole: Const.UserRoles.Trusted
  }
  BROADCAST_VIDEO: {
    label: 'PERMISSION.BroadcastVideo'
    hint: 'PERMISSION.BroadcastVideoHint'
    disableGM: true
    defaultRole: Const.UserRoles.Trusted
  }
  ACTOR_CREATE: {
    label: 'PERMISSION.ActorCreate'
    hint: 'PERMISSION.ActorCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Assistant
  }
  DRAWING_CREATE: {
    label: 'PERMISSION.DrawingCreate'
    hint: 'PERMISSION.DrawingCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Trusted
  }
  ITEM_CREATE: {
    label: 'PERMISSION.ItemCreate'
    hint: 'PERMISSION.ItemCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Assistant
  }
  FILES_BROWSE: {
    label: 'PERMISSION.FilesBrowse'
    hint: 'PERMISSION.FilesBrowseHint'
    disableGM: false
    defaultRole: Const.UserRoles.Trusted
  }
  FILES_UPLOAD: {
    label: 'PERMISSION.FilesUpload'
    hint: 'PERMISSION.FilesUploadHint'
    disableGM: false
    defaultRole: Const.UserRoles.Assistant
  }
  JOURNAL_CREATE: {
    label: 'PERMISSION.JournalCreate'
    hint: 'PERMISSION.JournalCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Trusted
  }
  MACRO_SCRIPT: {
    label: 'PERMISSION.MacroScript'
    hint: 'PERMISSION.MacroScriptHint'
    disableGM: false
    defaultRole: Const.UserRoles.Player
  }
  MESSAGE_WHISPER: {
    label: 'PERMISSION.MessageWhisper'
    hint: 'PERMISSION.MessageWhisperHint'
    disableGM: false
    defaultRole: Const.UserRoles.Player
  }
  SETTINGS_MODIFY: {
    label: 'PERMISSION.SettingsModify'
    hint: 'PERMISSION.SettingsModifyHint'
    disableGM: false
    defaultRole: Const.UserRoles.Assistant
  }
  SHOW_CURSOR: {
    label: 'PERMISSION.ShowCursor'
    hint: 'PERMISSION.ShowCursorHint'
    disableGM: true
    defaultRole: Const.UserRoles.Player
  }
  SHOW_RULER: {
    label: 'PERMISSION.ShowRuler'
    hint: 'PERMISSION.ShowRulerHint'
    disableGM: true
    defaultRole: Const.UserRoles.Player
  }
  TEMPLATE_CREATE: {
    label: 'PERMISSION.TemplateCreate'
    hint: 'PERMISSION.TemplateCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Player
  }
  TOKEN_CREATE: {
    label: 'PERMISSION.TokenCreate'
    hint: 'PERMISSION.TokenCreateHint'
    disableGM: false
    defaultRole: Const.UserRoles.Assistant
  }
  TOKEN_CONFIGURE: {
    label: 'PERMISSION.TokenConfigure'
    hint: 'PERMISSION.TokenConfigureHint'
    disableGM: false
    defaultRole: Const.UserRoles.Trusted
  }
  WALL_DOORS: {
    label: 'PERMISSION.WallDoors'
    hint: 'PERMISSION.WallDoorsHint'
    disableGM: false
    defaultRole: Const.UserRoles.Player
  }
}

/**
 * The allowed directions of effect that a Wall can have
 * BOTH: The wall collides from both directions
 * LEFT: The wall collides only when a ray strikes its left side
 * RIGHT: The wall collides only when a ray strikes its right side
 */
declare const WALL_DIRECTIONS: {
  BOTH: Const.WallDirections.Both
  LEFT: Const.WallDirections.Left
  RIGHT: Const.WallDirections.Right
}

/**
 * The allowed door types which a Wall may contain
 * NONE: The wall does not contain a door
 * DOOR: The wall contains a regular door
 * SECRET: The wall contains a secret door
 */
declare const WALL_DOOR_TYPES: {
  NONE: Const.WallDoorTypes.None
  DOOR: Const.WallDoorTypes.Door
  SECRET: Const.WallDoorTypes.Secret
}

/**
 * The allowed door states which may describe a Wall that contains a door
 * CLOSED: The door is closed
 * OPEN: The door is open
 * LOCKED: The door is closed and locked
 */
declare const WALL_DOOR_STATES: {
  CLOSED: Const.WallDoorStates.Closed
  OPEN: Const.WallDoorStates.Open
  LOCKED: Const.WallDoorStates.Locked
}

/**
 * The types of movement collision which a Wall may impose
 * NONE: Movement does not collide with this wall
 * NORMAL: Movement collides with this wall
 */
declare const WALL_MOVEMENT_TYPES: {
  NONE: Const.WallMovementTypes.None
  NORMAL: Const.WallMovementTypes.Normal
}

/**
 * The types of sensory collision which a Wall may impose
 * NONE: Senses do not collide with this wall
 * NORMAL: Senses collide with this wall
 * LIMITED: Senses collide with the second intersection, bypassing the first
 */
declare const WALL_SENSE_TYPES: {
  NONE: Const.WallSenseTypes.None
  NORMAL: Const.WallSenseTypes.Normal
  LIMITED: Const.WallSenseTypes.Limited
}

/**
 * The allowed set of HTML template extensions
 */
declare const HTML_FILE_EXTENSIONS: [
  'html',
  'hbs'
]

/**
 * The supported file extensions for image-type files
 */
declare const IMAGE_FILE_EXTENSIONS: [
  'jpg',
  'jpeg',
  'png',
  'svg',
  'webp'
]

/**
 * The supported file extensions for video-type files
 */
declare const VIDEO_FILE_EXTENSIONS: ['mp4', 'ogg', 'webm', 'm4v']

/**
 * The supported file extensions for audio-type files
 */
declare const AUDIO_FILE_EXTENSIONS: [
  'flac',
  'mp3',
  'ogg',
  'wav',
  'webm'
]

/**
 * The global CONSTANTS object
 */
declare const CONST: {
  ASCII: typeof ASCII
  vtt: typeof vtt
  VTT: typeof VTT
  WEBSITE_URL: typeof WEBSITE_URL
  ACTIVE_EFFECT_MODES: typeof ACTIVE_EFFECT_MODES
  BASE_ENTITY_TYPE: typeof BASE_ENTITY_TYPE
  CHAT_MESSAGE_TYPES: typeof CHAT_MESSAGE_TYPES
  COMPENDIUM_ENTITY_TYPES: typeof COMPENDIUM_ENTITY_TYPES
  CORE_SUPPORTED_LANGUAGES: typeof CORE_SUPPORTED_LANGUAGES
  DEFAULT_TOKEN: typeof DEFAULT_TOKEN
  DEFAULT_NOTE_ICON: typeof DEFAULT_NOTE_ICON
  DICE_ROLL_MODES: typeof DICE_ROLL_MODES
  DRAWING_DEFAULT_VALUES: typeof DRAWING_DEFAULT_VALUES
  DRAWING_TYPES: typeof DRAWING_TYPES
  DRAWING_FILL_TYPES: typeof DRAWING_FILL_TYPES
  ENTITY_PERMISSIONS: typeof ENTITY_PERMISSIONS
  ENTITY_TYPES: typeof ENTITY_TYPES
  ENTITY_LINK_TYPES: typeof ENTITY_LINK_TYPES
  EULA_VERSION: typeof EULA_VERSION
  FOLDER_ENTITY_TYPES: typeof FOLDER_ENTITY_TYPES
  FOLDER_MAX_DEPTH: typeof FOLDER_MAX_DEPTH
  GRID_MIN_SIZE: typeof GRID_MIN_SIZE
  GRID_TYPES: typeof GRID_TYPES
  MACRO_SCOPES: typeof MACRO_SCOPES
  PLAYLIST_MODES: typeof PLAYLIST_MODES
  PACKAGE_AVAILABILITY_CODES: typeof PACKAGE_AVAILABILITY_CODES
  PASSWORD_SAFE_STRING: typeof PASSWORD_SAFE_STRING
  SOURCE_TYPES: typeof SOURCE_TYPES
  MEDIA_MIME_TYPES: typeof MEDIA_MIME_TYPES
  SOFTWARE_UPDATE_CHANNELS: typeof SOFTWARE_UPDATE_CHANNELS
  SORT_INTEGER_DENSITY: typeof SORT_INTEGER_DENSITY
  TABLE_RESULT_TYPES: typeof TABLE_RESULT_TYPES
  TEXT_ANCHOR_POINTS: typeof TEXT_ANCHOR_POINTS
  TOKEN_DISPLAY_MODES: typeof TOKEN_DISPLAY_MODES
  TOKEN_DISPOSITIONS: typeof TOKEN_DISPOSITIONS
  USER_PERMISSIONS: typeof USER_PERMISSIONS
  USER_ROLES: typeof USER_ROLES
  USER_ROLE_NAMES: typeof USER_ROLE_NAMES
  WALL_SENSE_TYPES: typeof WALL_SENSE_TYPES
  WALL_MOVEMENT_TYPES: typeof WALL_MOVEMENT_TYPES
  WALL_DOOR_STATES: typeof WALL_DOOR_STATES
  WALL_DIRECTIONS: typeof WALL_DIRECTIONS
  WALL_DOOR_TYPES: typeof WALL_DOOR_TYPES
  HTML_FILE_EXTENSIONS: typeof HTML_FILE_EXTENSIONS
  IMAGE_FILE_EXTENSIONS: typeof IMAGE_FILE_EXTENSIONS
  VIDEO_FILE_EXTENSIONS: typeof VIDEO_FILE_EXTENSIONS
  AUDIO_FILE_EXTENSIONS: typeof AUDIO_FILE_EXTENSIONS
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace Const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum ActiveEffectModes {
    Custom = 0,
    Multiply = 1,
    Add = 2,
    Downgrade = 3,
    Upgrade = 4,
    Override = 5
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum ChatMessageTypes {
    Other = 0,
    OOC = 1,
    IC = 2,
    Emote = 3,
    Whisper = 4,
    Roll = 5
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum DiceRollModes {
    Public = 'roll',
    Private = 'gmroll',
    Blind = 'blindroll',
    Self = 'selfroll'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum DrawingFillTypes {
    None = 0,
    Solid = 1,
    Pattern = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum DrawingTypes {
    Rectangle = 'r',
    Ellipse = 'e',
    Text = 't',
    Polygon = 'p',
    Freehand = 'f'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum EntityPermissions {
    None = 0,
    Limited = 1,
    Observer = 2,
    Owner = 3
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum GridTypes {
    Gridless = 0,
    Square = 1,
    HexOddR = 2,
    HexEvenR = 3,
    HexOddQ = 4,
    HexEvenQ = 5
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum PackageAvailabilityCodes {
    Unknown = -1,
    Available = 0,
    RequiresUpdate = 1,
    RequiresSystem = 2,
    RequiresDependency = 3,
    RequiresCore = 4
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum PlaylistModes {
    Disabled = -1,
    Sequential = 0,
    Shuffle = 1,
    Simultaneous = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum SoftwareUpdateChannels {
    Alpha = 'SETUP.UpdateAlpha',
    Beta = 'SETUP.UpdateBeta',
    Release = 'SETUP.UpdateRelease'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum SourceTypes {
    Local = 'l',
    Global = 'g',
    Universal = 'u'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum TableResultTypes {
    Text = 0,
    Entity = 1,
    Compendium = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum TextAnchorPoints {
    Center = 0,
    Bottom = 1,
    Top = 2,
    Left = 3,
    Right = 4
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum TokenDisplayModes {
    None = 0,
    Control = 10,
    OwnerHover = 20,
    Hover = 30,
    Owner = 40,
    Always = 50
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum TokenDispositions {
    Hostile = -1,
    Neutral = 0,
    Friendly = 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum UserRoles {
    None = 0,
    Player = 1,
    Trusted = 2,
    Assistant = 3,
    GameMaster = 4
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum WallDirections {
    Both = 0,
    Left = 1,
    Right = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum WallDoorStates {
    Closed = 0,
    Open = 1,
    Locked = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum WallDoorTypes {
    None = 0,
    Door = 1,
    Secret = 2
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum WallMovementTypes {
    None = 0,
    Normal = 1
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enum WallSenseTypes {
    None = 0,
    Normal = 1,
    Limited = 2
  }
}
