import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  ConstructorDataType,
  FieldReturnType,
  PropertiesToSource
} from '../../../../types/helperTypes';
import EmbeddedCollection from '../../abstract/embedded-collection.mjs';
import { DocumentData } from '../../abstract/module.mjs';
import * as fields from '../fields.mjs';
import * as documents from '../../documents.mjs';
import * as CONST from '../../constants.mjs';
import { AmbientLightData } from './ambientLightData';
import { AmbientSoundData } from './ambientSoundData';
import { DrawingData } from './drawingData';
import { MeasuredTemplateData } from './measuredTemplateData';
import { TileData } from './tileData';
import { TokenData } from './tokenData';
import { WallData } from './wallData';

interface SceneDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  name: typeof fields.REQUIRED_STRING;
  active: typeof fields.BOOLEAN_FIELD;
  navigation: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  navOrder: typeof fields.INTEGER_SORT_FIELD;
  navName: typeof fields.BLANK_STRING;
  img: typeof fields.VIDEO_FIELD;
  foreground: typeof fields.VIDEO_FIELD;
  thumb: typeof fields.IMAGE_FIELD;
  width: FieldReturnType<typeof fields.POSITIVE_INTEGER_FIELD, { required: true; default: 4000 }>;
  height: FieldReturnType<typeof fields.POSITIVE_INTEGER_FIELD, { required: true; default: 3000 }>;
  padding: {
    type: typeof Number;
    required: true;
    default: 0.25;
    validate: (p: unknown) => boolean;
    validation: 'Invalid {name} {field} which must be a number between 0 and 0.5';
  };
  initial: {
    type: typeof Object;
    required: false;
    nullable: true;
    default: null;
    validate: typeof _validateInitialViewPosition;
    validationError: 'Invalid initial view position object provided for Scene';
  };
  backgroundColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#999999' }>;
  gridType: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.GRID_TYPES.SQUARE;
      validate: (t: unknown) => t is CONST.GridType;
      validationError: 'Invalid {name } {field} which must be a value in CONST.GRID_TYPES';
    }
  >;
  grid: {
    type: typeof Number;
    required: true;
    default: 100;
    validate: (n: unknown) => boolean;
    validationError: `Invalid {name} {field} which must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
  };
  shiftX: FieldReturnType<typeof fields.INTEGER_FIELD, { required: true; default: 0 }>;
  shiftY: FieldReturnType<typeof fields.INTEGER_FIELD, { required: true; default: 0 }>;
  gridColor: FieldReturnType<typeof fields.COLOR_FIELD, { required: true; default: '#000000' }>;
  gridAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { required: true; default: 0.2 }>;
  gridDistance: FieldReturnType<typeof fields.REQUIRED_POSITIVE_NUMBER, { default: () => number }>;
  gridUnits: FieldReturnType<typeof fields.BLANK_STRING, { default: () => string }>;
  tokenVision: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  fogExploration: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  fogReset: typeof fields.TIMESTAMP_FIELD;
  globalLight: typeof fields.BOOLEAN_FIELD;
  globalLightThreshold: {
    type: typeof Number;
    required: true;
    nullable: true;
    default: null;
    validate: (n: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be null, or a number between 0 and 1';
  };
  darkness: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing>;
  tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken>;
  lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight>;
  notes: fields.EmbeddedCollectionField<typeof documents.BaseNote>;
  sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound>;
  templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate>;
  tiles: fields.EmbeddedCollectionField<typeof documents.BaseToken>;
  walls: fields.EmbeddedCollectionField<typeof documents.BaseWall>;
  playlist: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylist; required: false }>;
  playlistSound: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylistSound; required: false }>;
  journal: fields.ForeignDocumentField<{ type: typeof documents.BaseJournalEntry; required: false }>;
  weather: typeof fields.BLANK_STRING;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: typeof fields.INTEGER_SORT_FIELD;
  permission: typeof fields.DOCUMENT_PERMISSIONS;
  flags: typeof fields.BLANK_STRING;
}

interface SceneDataProperties {
  /**
   * The _id which uniquely identifies this Scene document
   */
  _id: string | null;

  /**
   * The name of this scene
   */
  name: string;

  /**
   * Is this scene currently active? Only one scene may be active at a given time.
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * Is this scene displayed in the top navigation bar?
   * @defaultValue `true`
   */
  navigation: boolean;

  /**
   * The integer sorting order of this Scene in the navigation bar relative to others
   */
  navOrder: number;

  /**
   * A string which overrides the canonical Scene name which is displayed in the navigation bar
   * @defaultValue `''`
   */
  navName: string;

  /**
   * An image or video file path which provides the background media for the scene
   * @defaultValue `undefined`
   */
  img: string | undefined | null;

  /**
   * @defaultValue `undefined`
   */
  foreground: string | undefined | null;

  /**
   * A thumbnail image (base64) or file path which visually summarizes the scene
   * @defaultValue `undefined`
   */
  thumb: string | undefined | null;

  /**
   * The width of the scene canvas, this should normally be the width of the background media
   * @defaultValue `4000`
   */
  width: number;

  /**
   * The height of the scene canvas, this should normally be the height of the background media
   * @defaultValue `3000`
   */
  height: number;

  /**
   * The proportion of canvas padding applied around the outside of the scene
   * dimensions to provide additional buffer space
   * @defaultValue `0.25`
   */
  padding: number;

  /**
   * The initial view coordinates for the scene, or null
   * @defaultValue `null`
   */
  initial: { x: number; y: number; scale: number } | null;

  /**
   * The color of the canvas which is displayed behind the scene background
   * @defaultValue `#999999`
   */
  backgroundColor: string | null;

  /**
   * The type of grid used in this scene, a number from CONST.GRID_TYPES
   * @defaultValue `CONST.GRID_TYPES.SQUARE`
   */
  gridType: CONST.GridType;

  /**
   * The grid size which represents the width (or height) of a single grid space
   * @defaultValue `100`
   */
  grid: number;

  /**
   * A number of offset pixels that the background image is shifted horizontally relative to the grid
   * @defaultValue `0`
   */
  shiftX: number;

  /**
   * A number of offset pixels that the background image is shifted vertically relative to the grid
   * @defaultValue `0`
   */
  shiftY: number;

  /**
   * A string representing the color used to render the grid lines
   * @defaultValue `#000000`
   */
  gridColor: string | null;

  /**
   * A number between 0 and 1 for the opacity of the grid lines
   * @defaultValue `0.2`
   */
  gridAlpha: number;

  /**
   * The number of distance units which are represented by a single grid space.
   */
  gridDistance: number;

  /**
   * A label for the units of measure which are used for grid distance.
   */
  gridUnits: string;

  /**
   * Do Tokens require vision in order to see the Scene environment?
   * @defaultValue `true`
   */
  tokenVision: boolean;

  /**
   * Should fog exploration progress be tracked for this Scene?
   * @defaultValue `true`
   */
  fogExploration: boolean;

  /**
   * The timestamp at which fog of war was last reset for this Scene.
   */
  fogReset: number;

  /**
   * Does this Scene benefit from global illumination which provides bright light everywhere?
   * @defaultValue `false`
   */
  globalLight: boolean;

  /**
   * A darkness level between 0 and 1, beyond which point global illumination is
   * temporarily disabled if globalLight is true.
   * @defaultValue `null`
   */
  globalLightThreshold: number | null;

  /**
   * The ambient darkness level in this Scene, where 0 represents mid-day
   * (maximum illumination) and 1 represents mid-night (maximum darkness)
   * @defaultValue `0`
   */
  darkness: number;

  /**
   * A collection of embedded Drawing objects.
   */
  drawings: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseDrawing>, SceneData>;

  /**
   * A collection of embedded Token objects.
   */
  tokens: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseToken>, SceneData>;

  /**
   *
   * A collection of embedded AmbientLight objects.
   */
  lights: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseAmbientLight>, SceneData>;

  /**
   * A collection of embedded Note objects.
   */
  notes: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseNote>, SceneData>;

  /**
   * A collection of embedded AmbientSound objects.
   */
  sounds: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseAmbientSound>, SceneData>;

  /**
   * A collection of embedded MeasuredTemplate objects.
   */
  templates: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseMeasuredTemplate>, SceneData>;

  /**
   * A collection of embedded Tile objects.
   */
  tiles: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseTile>, SceneData>;

  /**
   * A collection of embedded Wall objects
   */
  walls: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseWall>, SceneData>;

  /**
   * A linked Playlist document which should begin automatically playing when this
   * Scene becomes active.
   * @defaultValue `null`
   */
  playlist: string | null;

  /**
   * @defaultValue `null`
   */
  playlistSound: string | null;

  /**
   * A linked JournalEntry document which provides narrative details about this Scene.
   * @defaultValue `null`
   */
  journal: string | null;

  /**
   * A named weather effect which should be rendered in this Scene.
   * @defaultValue `''`
   */
  weather: string;

  /**
   * The _id of a Folder which contains this Actor
   * @defaultValue `null`
   */
  folder: string | null;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   * @defaultValue `0`
   */
  sort: number;

  /**
   * An object which configures user permissions to this Actor
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.EntityPermission>>;

  /**
   * An object of optional key/value flags
   */
  flags: ConfiguredFlags<'Scene'>;
}

interface SceneDataConstructorData {
  /**
   * The _id which uniquely identifies this Scene document
   */
  _id?: string | null;

  /**
   * The name of this scene
   */
  name: string;

  /**
   * Is this scene currently active? Only one scene may be active at a given time.
   * @defaultValue `false`
   */
  active?: boolean | null;

  /**
   * Is this scene displayed in the top navigation bar?
   * @defaultValue `true`
   */
  navigation?: boolean | null;

  /**
   * The integer sorting order of this Scene in the navigation bar relative to others
   */
  navOrder?: number | null;

  /**
   * A string which overrides the canonical Scene name which is displayed in the navigation bar
   * @defaultValue `''`
   */
  navName?: string | null;

  /**
   * An image or video file path which provides the background media for the scene
   * @defaultValue `undefined`
   */
  img?: string | undefined | null;

  /**
   * @defaultValue `undefined`
   */
  foreground?: string | undefined | null;

  /**
   * A thumbnail image (base64) or file path which visually summarizes the scene
   * @defaultValue `undefined`
   */
  thumb?: string | undefined | null;

  /**
   * The width of the scene canvas, this should normally be the width of the background media
   * @defaultValue `4000`
   */
  width?: number | null;

  /**
   * The height of the scene canvas, this should normally be the height of the background media
   * @defaultValue `3000`
   */
  height?: number | null;

  /**
   * The proportion of canvas padding applied around the outside of the scene
   * dimensions to provide additional buffer space
   * @defaultValue `0.25`
   */
  padding?: number | null;

  /**
   * The initial view coordinates for the scene, or null
   * @defaultValue `null`
   */
  initial?: { x: number; y: number; scale: number } | null;

  /**
   * The color of the canvas which is displayed behind the scene background
   * @defaultValue `#999999`
   */
  backgroundColor?: string | null;

  /**
   * The type of grid used in this scene, a number from CONST.GRID_TYPES
   * @defaultValue `CONST.GRID_TYPES.SQUARE`
   */
  gridType?: CONST.GridType | null;

  /**
   * The grid size which represents the width (or height) of a single grid space
   * @defaultValue `100`
   */
  grid?: number | null;

  /**
   * A number of offset pixels that the background image is shifted horizontally relative to the grid
   * @defaultValue `0`
   */
  shiftX?: number | null;

  /**
   * A number of offset pixels that the background image is shifted vertically relative to the grid
   * @defaultValue `0`
   */
  shiftY?: number | null;

  /**
   * A string representing the color used to render the grid lines
   * @defaultValue `#000000`
   */
  gridColor?: string | null;

  /**
   * A number between 0 and 1 for the opacity of the grid lines
   * @defaultValue `0.2`
   */
  gridAlpha?: number | null;

  /**
   * The number of distance units which are represented by a single grid space.
   */
  gridDistance?: number | null;

  /**
   * A label for the units of measure which are used for grid distance.
   */
  gridUnits?: string | null;

  /**
   * Do Tokens require vision in order to see the Scene environment?
   * @defaultValue `true`
   */
  tokenVision?: boolean | null;

  /**
   * Should fog exploration progress be tracked for this Scene?
   * @defaultValue `true`
   */
  fogExploration?: boolean | null;

  /**
   * The timestamp at which fog of war was last reset for this Scene.
   */
  fogReset?: number | null;

  /**
   * Does this Scene benefit from global illumination which provides bright light everywhere?
   * @defaultValue `false`
   */
  globalLight?: boolean | null;

  /**
   * A darkness level between 0 and 1, beyond which point global illumination is
   * temporarily disabled if globalLight is true.
   * @defaultValue `null`
   */
  globalLightThreshold?: number | null;

  /**
   * The ambient darkness level in this Scene, where 0 represents mid-day
   * (maximum illumination) and 1 represents mid-night (maximum darkness)
   * @defaultValue `0`
   */
  darkness?: number | null;

  /**
   * A collection of embedded Drawing objects.
   */
  drawings?: ConstructorDataType<DrawingData>[] | null;

  /**
   * A collection of embedded Token objects.
   */
  tokens?: ConstructorDataType<TokenData>[] | null;

  /**
   *
   * A collection of embedded AmbientLight objects.
   */
  lights?: ConstructorDataType<AmbientLightData>[] | null;

  /**
   * A collection of embedded Note objects.
   */
  notes?: ConstructorDataType<NoteData>[] | null;

  /**
   * A collection of embedded AmbientSound objects.
   */
  sounds?: ConstructorDataType<AmbientSoundData>[] | null;

  /**
   * A collection of embedded MeasuredTemplate objects.
   */
  templates?: ConstructorDataType<MeasuredTemplateData>[] | null;

  /**
   * A collection of embedded Tile objects.
   */
  tiles?: ConstructorDataType<TileData>[] | null;

  /**
   * A collection of embedded Wall objects
   */
  walls?: ConstructorDataType<WallData>[] | null;

  /**
   * A linked Playlist document which should begin automatically playing when this
   * Scene becomes active.
   * @defaultValue `null`
   */
  playlist?: string | null;

  /**
   * @defaultValue `null`
   */
  playlistSound?: string | null;

  /**
   * A linked JournalEntry document which provides narrative details about this Scene.
   * @defaultValue `null`
   */
  journal?: string | null;

  /**
   * A named weather effect which should be rendered in this Scene.
   * @defaultValue `''`
   */
  weather?: string | null;

  /**
   * The _id of a Folder which contains this Actor
   * @defaultValue `null`
   */
  folder?: string | null;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null;

  /**
   * An object which configures user permissions to this Actor
   * @defaultValue `{ default: CONST.ENTITY_PERMISSIONS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.EntityPermission>> | null;

  /**
   * An object of optional key/value flags
   */
  flags?: ConfiguredFlags<'Scene'> | null;
}

/**
 * The data schema for a Scene document.
 * @see BaseScene
 */
export declare class SceneData extends DocumentData<
  SceneDataSchema,
  SceneDataProperties,
  PropertiesToSource<SceneDataProperties>,
  SceneDataConstructorData,
  documents.BaseScene
> {
  static defineSchema(): SceneDataSchema;

  /** @override */
  protected _initialize(): void;

  size: number;

  /**
   * @remarks This override does not exist in foundry but is added here to prepend runtime errors.
   */
  constructor(data: SceneDataConstructorData, document?: documents.BaseScene | null);
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface SceneData extends SceneDataProperties {}

/**
 * Verify that the initial view position for a Scene is valid
 * @param pos - The scene position object, or null
 * @returns Is the position valid?
 */
declare function _validateInitialViewPosition(pos: unknown): pos is { x: number; y: number; scale: number } | null;
