import { expectTypeOf } from "vitest";

expectTypeOf<CONST.ACTIVE_EFFECT_MODES>().toExtend<number>();
expectTypeOf<CONST.BASE_DOCUMENT_TYPE>().toBeString();
expectTypeOf<CONST.CARD_DRAW_MODES>().toExtend<number>();
expectTypeOf<CONST.CANVAS_PERFORMANCE_MODES>().toExtend<number>();
expectTypeOf<CONST.CHAT_MESSAGE_STYLES>().toExtend<number>();
expectTypeOf<CONST.CORE_SUPPORTED_LANGUAGES>().toExtend<string>();
expectTypeOf<CONST.COMPATIBILITY_MODES>().toExtend<number>();
expectTypeOf<CONST.CURSOR_STYLES>().toExtend<string>();
expectTypeOf<CONST.LIGHTING_LEVELS>().toExtend<number>();
expectTypeOf<CONST.CSS_THEMES>().toExtend<string>();
expectTypeOf<CONST.DEFAULT_TOKEN>().toBeString();
expectTypeOf<CONST.PRIMARY_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.EMBEDDED_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.ALL_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.WORLD_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.COMPENDIUM_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>().toExtend<number>();
expectTypeOf<CONST.DOCUMENT_META_OWNERSHIP_LEVELS>().toExtend<number>();
expectTypeOf<CONST.DOCUMENT_LINK_TYPES>().toExtend<string>();
expectTypeOf<CONST.DICE_ROLL_MODES>().toExtend<string>();
expectTypeOf<CONST.DRAWING_FILL_TYPES>().toExtend<number>();
expectTypeOf<CONST.FOLDER_DOCUMENT_TYPES>().toExtend<string>();
expectTypeOf<CONST.GAME_VIEWS>().toExtend<string>();
expectTypeOf<CONST.MOVEMENT_DIRECTIONS>().toExtend<number>();
expectTypeOf<CONST.GRID_TYPES>().toExtend<number>();
expectTypeOf<CONST.GRID_DIAGONALS>().toExtend<number>();
expectTypeOf<CONST.GRID_SNAPPING_MODES>().toExtend<number>();
expectTypeOf<CONST.SETUP_VIEWS>().toExtend<string>();
expectTypeOf<CONST.MACRO_SCOPES>().toExtend<string>();
expectTypeOf<CONST.MACRO_TYPES>().toExtend<string>();
expectTypeOf<CONST.AUDIO_CHANNELS>().toExtend<string>();
expectTypeOf<CONST.PLAYLIST_MODES>().toExtend<number>();
expectTypeOf<CONST.PLAYLIST_SORT_MODES>().toExtend<string>();
expectTypeOf<CONST.DIRECTORY_SEARCH_MODES>().toExtend<string>();
expectTypeOf<CONST.PACKAGE_TYPES>().toExtend<string>();
expectTypeOf<CONST.PACKAGE_AVAILABILITY_CODES>().toExtend<number>();
expectTypeOf<CONST.SOFTWARE_UPDATE_CHANNELS>().toExtend<string>();
expectTypeOf<CONST.TABLE_RESULT_TYPES>().toExtend<string>();
expectTypeOf<CONST.JOURNAL_ENTRY_PAGE_FORMATS>().toExtend<number>();
expectTypeOf<CONST.TEXT_ANCHOR_POINTS>().toExtend<number>();
expectTypeOf<CONST.OCCLUSION_MODES>().toExtend<number>();
expectTypeOf<CONST.TILE_OCCLUSION_MODES>().toExtend<number>();
expectTypeOf<CONST.TOKEN_OCCLUSION_MODES>().toExtend<number>();
expectTypeOf<CONST.TOKEN_DISPLAY_MODES>().toExtend<number>();
expectTypeOf<CONST.TOKEN_DISPOSITIONS>().toExtend<number>();
expectTypeOf<CONST.TOKEN_TURN_MARKER_MODES>().toExtend<number>();
expectTypeOf<CONST.TOKEN_SHAPES>().toExtend<number>();
expectTypeOf<CONST.USER_ROLES>().toExtend<number>();
expectTypeOf<CONST.USER_ROLE_NAMES>().toExtend<string>();
expectTypeOf<CONST.MEASURED_TEMPLATE_TYPES>().toExtend<string>();
expectTypeOf<CONST.USER_PERMISSIONS>().toExtend<string>();
expectTypeOf<CONST.WALL_DIRECTIONS>().toExtend<number>();
expectTypeOf<CONST.WALL_DOOR_TYPES>().toExtend<number>();
expectTypeOf<CONST.WALL_DOOR_STATES>().toExtend<number>();
expectTypeOf<CONST.WALL_DOOR_INTERACTIONS>().toExtend<string>();
expectTypeOf<CONST.WALL_RESTRICTION_TYPES>().toExtend<string>();
expectTypeOf<CONST.WALL_SENSE_TYPES>().toExtend<number>();
expectTypeOf<CONST.WALL_MOVEMENT_TYPES>().toExtend<number>();
expectTypeOf<CONST.KEYBINDING_PRECEDENCE>().toExtend<number>();
expectTypeOf<CONST.HTML_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.IMAGE_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.VIDEO_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.AUDIO_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.TEXT_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.FONT_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.GRAPHICS_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.UPLOADABLE_FILE_EXTENSIONS>().toExtend<string>();
expectTypeOf<CONST.FILE_CATEGORIES>().toExtend<string>();
expectTypeOf<CONST.MEDIA_FILE_CATEGORIES>().toExtend<string>();
expectTypeOf<CONST.MEDIA_MIME_TYPES>().toExtend<string>();
expectTypeOf<CONST.FONT_WEIGHTS>().toExtend<number>();
expectTypeOf<CONST.SYSTEM_SPECIFIC_COMPENDIUM_TYPES>().toExtend<string>();
expectTypeOf<CONST.ALLOWED_HTML_TAGS>().toExtend<string>();
expectTypeOf<CONST.ALLOWED_HTML_ATTRIBUTES>().toExtend<
  Record<keyof typeof CONST.ALLOWED_HTML_ATTRIBUTES, readonly string[]>
>();
expectTypeOf<CONST.ALLOWED_URL_SCHEMES>().toExtend<string>();
expectTypeOf<CONST.ALLOWED_URL_SCHEMES_APPLIED_TO_ATTRIBUTES>().toExtend<string>();
expectTypeOf<CONST.TRUSTED_IFRAME_DOMAINS>().toExtend<string>();
expectTypeOf<CONST.WORLD_JOIN_THEMES>().toExtend<string>();

expectTypeOf<CONST.SETUP_PACKAGE_PROGRESS.ACTIONS>().toExtend<string>();
expectTypeOf<CONST.SETUP_PACKAGE_PROGRESS.STEPS>().toExtend<string>();

expectTypeOf<CONST.COMBAT_ANNOUNCEMENTS>().toExtend<string>();
expectTypeOf<CONST.TEXTURE_DATA_FIT_MODES>().toExtend<string>();
expectTypeOf<CONST.REGION_EVENTS>().toExtend<string>();
expectTypeOf<CONST.REGION_VISIBILITY>().toExtend<number>();
expectTypeOf<CONST.REGION_MOVEMENT_SEGMENTS>().toExtend<number>();
expectTypeOf<CONST.SETTING_SCOPES>().toExtend<string>();

// deprecated since v12, until v14

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf<CONST.CHAT_MESSAGE_TYPES>().toExtend<number>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf<CONST.DOCUMENT_TYPES>().toExtend<string>();

// deprecated since v13, until v15

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf<CONST.TOKEN_HEXAGONAL_SHAPES>().toExtend<number>();
