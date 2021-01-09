declare const VTT: string

declare const WEBSITE_URL: string

declare const vtt: string

/**
 * The global CONSTANTS object
 */
declare const CONST: {
  /**
   * Define the allowed ActiveEffect application modes
   */
  ACTIVE_EFFECT_MODES: {
    ADD: ConstTypes.ActiveEffectModes.Add
    CUSTOM: ConstTypes.ActiveEffectModes.Custom
    DOWNGRADE: ConstTypes.ActiveEffectModes.Downgrade
    MULTIPLY: ConstTypes.ActiveEffectModes.Multiply
    OVERRIDE: ConstTypes.ActiveEffectModes.Override
    UPGRADE: ConstTypes.ActiveEffectModes.Upgrade
  }

  ASCII: `_______________________________________________________________
  _____ ___  _   _ _   _ ____  ______   __ __     _______ _____ 
  |  ___/ _ \\| | | | \\ | |  _ \\|  _ \\ \\ / / \\ \\   / |_   _|_   _|
  | |_ | | | | | | |  \\| | | | | |_) \\ V /   \\ \\ / /  | |   | |  
    |  _|| |_| | |_| | |\\  | |_| |  _ < | |     \\ V /   | |   | |  
    |_|   \\___/ \\___/|_| \\_|____/|_| \\_\\|_|      \\_/    |_|   |_|  
  ===============================================================`

  /**
   * The supported file extensions for audio-type files
   */
  AUDIO_FILE_EXTENSIONS: [
    'flac',
    'mp3',
    'ogg',
    'wav',
    'webm'
  ]

  /**
   * Define the string name used for the base entity type when specific
   * sub-types are not defined by the system
   */
  BASE_ENTITY_TYPE: 'base'

  /**
   * Valid Chat Message types
   */
  CHAT_MESSAGE_TYPES: {
    EMOTE: ConstTypes.ChatMessageTypes.Emote
    IC: ConstTypes.ChatMessageTypes.IC
    OOC: ConstTypes.ChatMessageTypes.OOC
    OTHER: ConstTypes.ChatMessageTypes.Other
    ROLL: ConstTypes.ChatMessageTypes.Roll
    WHISPER: ConstTypes.ChatMessageTypes.Whisper
  }

  /**
   * The allowed Entity types which may exist within a Compendium pack
   * This is a subset of ENTITY_TYPES
   */
  COMPENDIUM_ENTITY_TYPES: [
    'Actor',
    'Item',
    'Scene',
    'JournalEntry',
    'Macro',
    'RollTable',
    'Playlist'
  ]

  /**
   * Define the set of languages which have built-in support in the core
   * software
   */
  CORE_SUPPORTED_LANGUAGES: [
    'en'
  ]

  /**
   * The default artwork used for Note placeables if none is provided
   */
  DEFAULT_NOTE_ICON: 'icons/svg/book.svg'

  /**
   * The default artwork used for Token images if none is provided
   */
  DEFAULT_TOKEN: 'icons/svg/mystery-man.svg'

  /**
   * The supported dice roll visibility modes
   */
  DICE_ROLL_MODES: {
    BLIND: ConstTypes.DiceRollModes.Blind
    PRIVATE: ConstTypes.DiceRollModes.Private
    PUBLIC: ConstTypes.DiceRollModes.Public
    SELF: ConstTypes.DiceRollModes.Self
  }

  /**
   * The default configuration values used for Drawing objects
   */
  DRAWING_DEFAULT_VALUES: {
    bezierFactor: 0.0
    fillAlpha: 0.5
    fillType: 0
    fontSize: 48
    height: 0
    hidden: false
    locked: false
    rotation: 0
    strokeAlpha: 1.0
    strokeWidth: 8
    textAlpha: 1.0
    textColor: '#FFFFFF'
    width: 0
    z: 0
  }

  /**
   * The allowed fill types which a Drawing object may display
   * NONE: The drawing is not filled
   * SOLID: The drawing is filled with a solid color
   * PATTERN: The drawing is filled with a tiled image pattern
   */
  DRAWING_FILL_TYPES: {
    NONE: ConstTypes.DrawingFillTypes.None
    PATTERN: ConstTypes.DrawingFillTypes.Pattern
    SOLID: ConstTypes.DrawingFillTypes.Solid
  }

  /**
   * The allowed Drawing types which may be saved
   */
  DRAWING_TYPES: {
    ELLIPSE: ConstTypes.DrawingTypes.Ellipse
    FREEHAND: ConstTypes.DrawingTypes.Freehand
    POLYGON: ConstTypes.DrawingTypes.Polygon
    RECTANGLE: ConstTypes.DrawingTypes.Rectangle
    TEXT: ConstTypes.DrawingTypes.Text
  }

  /**
   * Define the allowed Entity types which may be dynamically linked in chat
   */
  ENTITY_LINK_TYPES: [
    'Actor',
    'Item',
    'Scene',
    'JournalEntry',
    'Macro',
    'RollTable'
  ]

  /**
   * Define the allowed permission levels for a non-user Entity.
   * Each level is assigned a value in ascending order. Higher levels grant more
   * permissions.
   */
  ENTITY_PERMISSIONS: {
    LIMITED: ConstTypes.EntityPermissions.Limited
    NONE: ConstTypes.EntityPermissions.None
    OBSERVER: ConstTypes.EntityPermissions.Observer
    OWNER: ConstTypes.EntityPermissions.Owner
  }

  /**
   * Define the allowed Entity class types
   */
  ENTITY_TYPES: [
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
   * EULA version number
   */
  EULA_VERSION: string

  /**
   * Define the allowed Entity types which Folders may contain
   */
  FOLDER_ENTITY_TYPES: [
    'Actor',
    'Item',
    'Scene',
    'JournalEntry',
    'RollTable'
  ]

  /**
   * The maximum allowed level of depth for Folder nesting
   */
  FOLDER_MAX_DEPTH: 3

  /**
   * The minimum allowed grid size which is supported by the software
   */
  GRID_MIN_SIZE: 50

  /**
   * The allowed Grid types which are supported by the software
   */
  GRID_TYPES: {
    GRIDLESS: ConstTypes.GridTypes.Gridless
    HEXEVENQ: ConstTypes.GridTypes.HexEvenQ
    HEXEVENR: ConstTypes.GridTypes.HexEvenR
    HEXODDQ: ConstTypes.GridTypes.HexOddQ
    HEXODDR: ConstTypes.GridTypes.HexOddR
    SQUARE: ConstTypes.GridTypes.Square
  }

  /**
   * The allowed set of HTML template extensions
   */
  HTML_FILE_EXTENSIONS: [
    'html',
    'hbs'
  ]

  /**
   * The supported file extensions for image-type files
   */
  IMAGE_FILE_EXTENSIONS: [
    'jpg',
    'jpeg',
    'png',
    'svg',
    'webp'
  ]

  /**
   * An Array of valid MacroAction scope values
   */
  MACRO_SCOPES: [
    'global',
    'actors',
    'actor'
  ]

  /**
   * A list of MIME types which are treated as uploaded "media", which are
   * allowed to overwrite existing files.
   * Any non-media MIME type is not allowed to replace an existing file.
   */
  MEDIA_MIME_TYPES: [
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
   * Encode the reasons why a package may be available or unavailable for use
   */
  PACKAGE_AVAILABILITY_CODES: {
    AVAILABLE: ConstTypes.PackageAvailabilityCodes.Available
    REQUIRES_CORE: ConstTypes.PackageAvailabilityCodes.RequiresCore
    REQUIRES_DEPENDENCY: ConstTypes.PackageAvailabilityCodes.RequiresDependency
    REQUIRES_SYSTEM: ConstTypes.PackageAvailabilityCodes.RequiresSystem
    REQUIRES_UPDATE: ConstTypes.PackageAvailabilityCodes.RequiresUpdate
    UNKNOWN: ConstTypes.PackageAvailabilityCodes.Unknown
  }

  /**
   * A safe password string which can be displayed
   */
  PASSWORD_SAFE_STRING: string

  /**
   * The allowed playback modes for an audio Playlist
   * DISABLED: The playlist does not play on its own, only individual Sound
   *          tracks played as a soundboard
   * SEQUENTIAL: The playlist plays sounds one at a time in sequence
   * SHUFFLE: The playlist plays sounds one at a time in randomized order
   * SIMULTANEOUS: The playlist plays all contained sounds at the same time
   */
  PLAYLIST_MODES: {
    DISABLED: ConstTypes.PlaylistModes.Disabled
    SEQUENTIAL: ConstTypes.PlaylistModes.Sequential
    SHUFFLE: ConstTypes.PlaylistModes.Shuffle
    SIMULTANEOUS: ConstTypes.PlaylistModes.Simultaneous
  }

  /**
   * Define the threshold version which packages must support as their
   * minimumCoreVersion in order to be usable
   */
  REQUIRED_PACKAGE_CORE_VERSION: string

  /**
   * The allowed software update channels
   */
  SOFTWARE_UPDATE_CHANNELS: {
    alpha: ConstTypes.SoftwareUpdateChannels.Alpha
    beta: ConstTypes.SoftwareUpdateChannels.Beta
    release: ConstTypes.SoftwareUpdateChannels.Release
  }

  /**
   * The default sorting density for manually ordering child objects within a
   * parent
   */
  SORT_INTEGER_DENSITY: 100000

  /**
   * Enumerate the source types which can be used for an AmbientLight placeable
   * object
   */
  SOURCE_TYPES: {
    GLOBAL: ConstTypes.SourceTypes.Global
    LOCAL: ConstTypes.SourceTypes.Local
    UNIVERSAL: ConstTypes.SourceTypes.Universal
  }

  /**
   * The allowed types of a TableResult document
   */
  TABLE_RESULT_TYPES: {
    COMPENDIUM: ConstTypes.TableResultTypes.Compendium
    ENTITY: ConstTypes.TableResultTypes.Entity
    TEXT: ConstTypes.TableResultTypes.Text
  }

  /**
   * Define the valid anchor locations for a Tooltip displayed on a Placeable
   * Object
   */
  TEXT_ANCHOR_POINTS: {
    BOTTOM: ConstTypes.TextAnchorPoints.Bottom
    CENTER: ConstTypes.TextAnchorPoints.Center
    LEFT: ConstTypes.TextAnchorPoints.Left
    RIGHT: ConstTypes.TextAnchorPoints.Right
    TOP: ConstTypes.TextAnchorPoints.Top
  }

  /**
   * Describe the various thresholds of token control upon which to show certain
   * pieces of information
   * NONE - no information is displayed
   * CONTROL - displayed when the token is controlled
   * OWNER HOVER - displayed when hovered by a GM or a user who owns the actor
   * HOVER - displayed when hovered by any user
   * OWNER - always displayed for a GM or for a user who owns the actor
   * ALWAYS - always displayed for everyone
   */
  TOKEN_DISPLAY_MODES: {
    ALWAYS: ConstTypes.TokenDisplayModes.Always
    CONTROL: ConstTypes.TokenDisplayModes.Control
    HOVER: ConstTypes.TokenDisplayModes.Hover
    NONE: ConstTypes.TokenDisplayModes.None
    OWNER: ConstTypes.TokenDisplayModes.Owner
    OWNER_HOVER: ConstTypes.TokenDisplayModes.OwnerHover
  }

  /**
   * The allowed Token disposition types
   * HOSTILE - Displayed as an enemy with a red border
   * NEUTRAL - Displayed as neutral with a yellow border
   * FRIENDLY - Displayed as an ally with a cyan border
   */
  TOKEN_DISPOSITIONS: {
    FRIENDLY: ConstTypes.TokenDispositions.Friendly
    HOSTILE: ConstTypes.TokenDispositions.Hostile
    NEUTRAL: ConstTypes.TokenDispositions.Neutral
  }

  /**
   * Define the named actions which users or user roles can be permitted to do.
   * Each key of this Object denotes an action for which permission may be
   * granted (true) or withheld (false)
   */
  USER_PERMISSIONS: {
    ACTOR_CREATE: {
      defaultRole: ConstTypes.UserRoles.Assistant
      disableGM: false
      hint: 'PERMISSION.ActorCreateHint'
      label: 'PERMISSION.ActorCreate'
    }
    BROADCAST_AUDIO: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: true
      hint: 'PERMISSION.BroadcastAudioHint'
      label: 'PERMISSION.BroadcastAudio'
    }
    BROADCAST_VIDEO: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: true
      hint: 'PERMISSION.BroadcastVideoHint'
      label: 'PERMISSION.BroadcastVideo'
    }
    DRAWING_CREATE: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: false
      hint: 'PERMISSION.DrawingCreateHint'
      label: 'PERMISSION.DrawingCreate'
    }
    FILES_BROWSE: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: false
      hint: 'PERMISSION.FilesBrowseHint'
      label: 'PERMISSION.FilesBrowse'
    }
    FILES_UPLOAD: {
      defaultRole: ConstTypes.UserRoles.Assistant
      disableGM: false
      hint: 'PERMISSION.FilesUploadHint'
      label: 'PERMISSION.FilesUpload'
    }
    ITEM_CREATE: {
      defaultRole: ConstTypes.UserRoles.Assistant
      disableGM: false
      hint: 'PERMISSION.ItemCreateHint'
      label: 'PERMISSION.ItemCreate'
    }
    JOURNAL_CREATE: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: false
      hint: 'PERMISSION.JournalCreateHint'
      label: 'PERMISSION.JournalCreate'
    }
    MACRO_SCRIPT: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: false
      hint: 'PERMISSION.MacroScriptHint'
      label: 'PERMISSION.MacroScript'
    }
    MESSAGE_WHISPER: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: false
      hint: 'PERMISSION.MessageWhisperHint'
      label: 'PERMISSION.MessageWhisper'
    }
    SETTINGS_MODIFY: {
      defaultRole: ConstTypes.UserRoles.Assistant
      disableGM: false
      hint: 'PERMISSION.SettingsModifyHint'
      label: 'PERMISSION.SettingsModify'
    }
    SHOW_CURSOR: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: true
      hint: 'PERMISSION.ShowCursorHint'
      label: 'PERMISSION.ShowCursor'
    }
    SHOW_RULER: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: true
      hint: 'PERMISSION.ShowRulerHint'
      label: 'PERMISSION.ShowRuler'
    }
    TEMPLATE_CREATE: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: false
      hint: 'PERMISSION.TemplateCreateHint'
      label: 'PERMISSION.TemplateCreate'
    }
    TOKEN_CONFIGURE: {
      defaultRole: ConstTypes.UserRoles.Trusted
      disableGM: false
      hint: 'PERMISSION.TokenConfigureHint'
      label: 'PERMISSION.TokenConfigure'
    }
    TOKEN_CREATE: {
      defaultRole: ConstTypes.UserRoles.Assistant
      disableGM: false
      hint: 'PERMISSION.TokenCreateHint'
      label: 'PERMISSION.TokenCreate'
    }
    WALL_DOORS: {
      defaultRole: ConstTypes.UserRoles.Player
      disableGM: false
      hint: 'PERMISSION.WallDoorsHint'
      label: 'PERMISSION.WallDoors'
    }
  }

  /**
   * Define the allowed User permission levels.
   * Each level is assigned a value in ascending order. Higher levels grant more
   * permissions.
   */
  USER_ROLES: {
    ASSISTANT: ConstTypes.UserRoles.Assistant
    GAMEMASTER: ConstTypes.UserRoles.GameMaster
    NONE: ConstTypes.UserRoles.None
    PLAYER: ConstTypes.UserRoles.Player
    TRUSTED: ConstTypes.UserRoles.Trusted
  }

  /**
   * Invert the User Role mapping to recover role names from a role integer
   */
  USER_ROLE_NAMES: {
    0: 'NONE'
    1: 'PLAYER'
    2: 'TRUSTED'
    3: 'ASSISTANT'
    4: 'GAMEMASTER'
  }

  /**
   * The supported file extensions for video-type files
   */
  VIDEO_FILE_EXTENSIONS: ['mp4', 'ogg', 'webm', 'm4v']

  VTT: 'Foundry Virtual Tabletop'

  /**
   * The allowed directions of effect that a Wall can have
   * BOTH: The wall collides from both directions
   * LEFT: The wall collides only when a ray strikes its left side
   * RIGHT: The wall collides only when a ray strikes its right side
   */
  WALL_DIRECTIONS: {
    BOTH: ConstTypes.WallDirections.Both
    LEFT: ConstTypes.WallDirections.Left
    RIGHT: ConstTypes.WallDirections.Right
  }

  /**
   * The allowed door states which may describe a Wall that contains a door
   * CLOSED: The door is closed
   * OPEN: The door is open
   * LOCKED: The door is closed and locked
   */
  WALL_DOOR_STATES: {
    CLOSED: ConstTypes.WallDoorStates.Closed
    LOCKED: ConstTypes.WallDoorStates.Locked
    OPEN: ConstTypes.WallDoorStates.Open
  }

  /**
   * The allowed door types which a Wall may contain
   * NONE: The wall does not contain a door
   * DOOR: The wall contains a regular door
   * SECRET: The wall contains a secret door
   */
  WALL_DOOR_TYPES: {
    DOOR: ConstTypes.WallDoorTypes.Door
    NONE: ConstTypes.WallDoorTypes.None
    SECRET: ConstTypes.WallDoorTypes.Secret
  }

  /**
   * The types of movement collision which a Wall may impose
   * NONE: Movement does not collide with this wall
   * NORMAL: Movement collides with this wall
   */
  WALL_MOVEMENT_TYPES: {
    NONE: ConstTypes.WallMovementTypes.None
    NORMAL: ConstTypes.WallMovementTypes.Normal
  }

  /**
   * The types of sensory collision which a Wall may impose
   * NONE: Senses do not collide with this wall
   * NORMAL: Senses collide with this wall
   * LIMITED: Senses collide with the second intersection, bypassing the first
   */
  WALL_SENSE_TYPES: {
    LIMITED: ConstTypes.WallSenseTypes.Limited
    NONE: ConstTypes.WallSenseTypes.None
    NORMAL: ConstTypes.WallSenseTypes.Normal
  }

  WEBSITE_URL: 'https://foundryvtt.com'

  vtt: 'Foundry VTT'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace ConstTypes {
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
