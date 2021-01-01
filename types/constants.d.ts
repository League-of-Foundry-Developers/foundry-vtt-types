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
    /* eslint-disable @typescript-eslint/member-ordering */
    CUSTOM: 0
    MULTIPLY: 1
    ADD: 2
    DOWNGRADE: 3
    UPGRADE: 4
    OVERRIDE: 5
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    OTHER: 0
    OOC: 1
    IC: 2
    EMOTE: 3
    WHISPER: 4
    ROLL: 5
    /* eslint-enable @typescript-eslint/member-ordering */
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
  * Define the set of languages which have built-in support in the core software
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
    /* eslint-disable @typescript-eslint/member-ordering */
    PUBLIC: 'roll'
    PRIVATE: 'gmroll'
    BLIND: 'blindroll'
    SELF: 'selfroll'
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    SOLID: 1
    PATTERN: 2
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * The allowed Drawing types which may be saved
  */
  DRAWING_TYPES: {
    /* eslint-disable @typescript-eslint/member-ordering */
    RECTANGLE: 'r'
    ELLIPSE: 'e'
    TEXT: 't'
    POLYGON: 'p'
    FREEHAND: 'f'
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    LIMITED: 1
    OBSERVER: 2
    OWNER: 3
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    GRIDLESS: 0
    SQUARE: 1
    HEXODDR: 2
    HEXEVENR: 3
    HEXODDQ: 4
    HEXEVENQ: 5
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    UNKNOWN: -1
    AVAILABLE: 0
    REQUIRES_UPDATE: 1
    REQUIRES_SYSTEM: 2
    REQUIRES_DEPENDENCY: 3
    REQUIRES_CORE: 4
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    DISABLED: -1
    SEQUENTIAL: 0
    SHUFFLE: 1
    SIMULTANEOUS: 2
    /* eslint-enable @typescript-eslint/member-ordering */
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
    alpha: 'SETUP.UpdateAlpha'
    beta: 'SETUP.UpdateBeta'
    release: 'SETUP.UpdateRelease'
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
    /* eslint-disable @typescript-eslint/member-ordering */
    LOCAL: 'l'
    GLOBAL: 'g'
    UNIVERSAL: 'u'
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * The allowed types of a TableResult document
  */
  TABLE_RESULT_TYPES: {
    /* eslint-disable @typescript-eslint/member-ordering */
    TEXT: 0
    ENTITY: 1
    COMPENDIUM: 2
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * Define the valid anchor locations for a Tooltip displayed on a Placeable
  * Object
  */
  TEXT_ANCHOR_POINTS: {
    /* eslint-disable @typescript-eslint/member-ordering */
    CENTER: 0
    BOTTOM: 1
    TOP: 2
    LEFT: 3
    RIGHT: 4
    /* eslint-enable @typescript-eslint/member-ordering */
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
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    CONTROL: 10
    OWNER_HOVER: 20
    HOVER: 30
    OWNER: 40
    ALWAYS: 50
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * The allowed Token disposition types
  * HOSTILE - Displayed as an enemy with a red border
  * NEUTRAL - Displayed as neutral with a yellow border
  * FRIENDLY - Displayed as an ally with a cyan border
  */
  TOKEN_DISPOSITIONS: {
    /* eslint-disable @typescript-eslint/member-ordering */
    HOSTILE: -1
    NEUTRAL: 0
    FRIENDLY: 1
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * Define the named actions which users or user roles can be permitted to do.
  * Each key of this Object denotes an action for which permission may be
  * granted (true) or withheld (false)
  */
  USER_PERMISSIONS: {
    ACTOR_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.ActorCreateHint'
      label: 'PERMISSION.ActorCreate'
    }
    BROADCAST_AUDIO: {
      defaultRole: number
      disableGM: true
      hint: 'PERMISSION.BroadcastAudioHint'
      label: 'PERMISSION.BroadcastAudio'
    }
    BROADCAST_VIDEO: {
      defaultRole: number
      disableGM: true
      hint: 'PERMISSION.BroadcastVideoHint'
      label: 'PERMISSION.BroadcastVideo'
    }
    DRAWING_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.DrawingCreateHint'
      label: 'PERMISSION.DrawingCreate'
    }
    FILES_BROWSE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.FilesBrowseHint'
      label: 'PERMISSION.FilesBrowse'
    }
    FILES_UPLOAD: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.FilesUploadHint'
      label: 'PERMISSION.FilesUpload'
    }
    ITEM_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.ItemCreateHint'
      label: 'PERMISSION.ItemCreate'
    }
    JOURNAL_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.JournalCreateHint'
      label: 'PERMISSION.JournalCreate'
    }
    MACRO_SCRIPT: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.MacroScriptHint'
      label: 'PERMISSION.MacroScript'
    }
    MESSAGE_WHISPER: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.MessageWhisperHint'
      label: 'PERMISSION.MessageWhisper'
    }
    SETTINGS_MODIFY: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.SettingsModifyHint'
      label: 'PERMISSION.SettingsModify'
    }
    SHOW_CURSOR: {
      defaultRole: number
      disableGM: true
      hint: 'PERMISSION.ShowCursorHint'
      label: 'PERMISSION.ShowCursor'
    }
    SHOW_RULER: {
      defaultRole: number
      disableGM: true
      hint: 'PERMISSION.ShowRulerHint'
      label: 'PERMISSION.ShowRuler'
    }
    TEMPLATE_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.TemplateCreateHint'
      label: 'PERMISSION.TemplateCreate'
    }
    TOKEN_CONFIGURE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.TokenConfigureHint'
      label: 'PERMISSION.TokenConfigure'
    }
    TOKEN_CREATE: {
      defaultRole: number
      disableGM: false
      hint: 'PERMISSION.TokenCreateHint'
      label: 'PERMISSION.TokenCreate'
    }
    WALL_DOORS: {
      defaultRole: number
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
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    PLAYER: 1
    TRUSTED: 2
    ASSISTANT: 3
    GAMEMASTER: 4
    /* eslint-enable @typescript-eslint/member-ordering */
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
    BOTH: 0
    LEFT: 1
    RIGHT: 2
  }

  /**
  * The allowed door states which may describe a Wall that contains a door
  * CLOSED: The door is closed
  * OPEN: The door is open
  * LOCKED: The door is closed and locked
  */
  WALL_DOOR_STATES: {
    /* eslint-disable @typescript-eslint/member-ordering */
    CLOSED: 0
    OPEN: 1
    LOCKED: 2
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * The allowed door types which a Wall may contain
  * NONE: The wall does not contain a door
  * DOOR: The wall contains a regular door
  * SECRET: The wall contains a secret door
  */
  WALL_DOOR_TYPES: {
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    DOOR: 1
    SECRET: 2
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  /**
  * The types of movement collision which a Wall may impose
  * NONE: Movement does not collide with this wall
  * NORMAL: Movement collides with this wall
  */
  WALL_MOVEMENT_TYPES: {
    NONE: 0
    NORMAL: 1
  }

  /**
  * The types of sensory collision which a Wall may impose
  * NONE: Senses do not collide with this wall
  * NORMAL: Senses collide with this wall
  * LIMITED: Senses collide with the second intersection, bypassing the first
  */
  WALL_SENSE_TYPES: {
    /* eslint-disable @typescript-eslint/member-ordering */
    NONE: 0
    NORMAL: 1
    LIMITED: 2
    /* eslint-enable @typescript-eslint/member-ordering */
  }

  WEBSITE_URL: 'https://foundryvtt.com'

  vtt: 'Foundry VTT'
}
