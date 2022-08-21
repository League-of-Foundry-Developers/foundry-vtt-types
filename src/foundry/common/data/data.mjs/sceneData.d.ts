import {
  ConfiguredDocumentClass,
  ConfiguredFlags,
  FieldReturnType,
  PropertiesToSource
} from "../../../../types/helperTypes";
import EmbeddedCollection from "../../abstract/embedded-collection.mjs";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import { AmbientLightDataConstructorData } from "./ambientLightData";
import { AmbientSoundDataConstructorData } from "./ambientSoundData";
import { DrawingDataConstructorData } from "./drawingData";
import { MeasuredTemplateDataConstructorData } from "./measuredTemplateData";
import { NoteDataConstructorData } from "./noteData";
import { TileDataConstructorData } from "./tileData";
import { TokenDataConstructorData } from "./tokenData";
import { WallDataConstructorData } from "./wallData";

interface SceneDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  name: fields.RequiredString;
  active: fields.BooleanField;
  navigation: FieldReturnType<fields.BooleanField, { default: true }>;
  navOrder: fields.IntegerSortField;
  navName: fields.BlankString;
  img: fields.VideoField;
  foreground: fields.VideoField;
  thumb: fields.ImageField;
  width: FieldReturnType<fields.PositiveIntegerField, { required: true; default: 4000 }>;
  height: FieldReturnType<fields.PositiveIntegerField, { required: true; default: 3000 }>;
  padding: DocumentField<Number> & {
    type: typeof Number;
    required: true;
    default: 0.25;
    validate: (p: unknown) => boolean;
    validation: "Invalid {name} {field} which must be a number between 0 and 0.5";
  };
  initial: DocumentField<Object> & {
    type: typeof Object;
    required: false;
    nullable: true;
    default: null;
    validate: typeof _validateInitialViewPosition;
    validationError: "Invalid initial view position object provided for Scene";
  };
  backgroundColor: FieldReturnType<fields.ColorField, { required: true; default: "#999999" }>;
  gridType: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.GRID_TYPES.SQUARE;
      validate: (t: unknown) => t is foundry.CONST.GRID_TYPES;
      validationError: "Invalid {name } {field} which must be a value in CONST.GRID_TYPES";
    }
  >;
  grid: DocumentField<Number> & {
    type: typeof Number;
    required: true;
    default: 100;
    validate: (n: unknown) => boolean;
    validationError: `Invalid {name} {field} which must be an integer number of pixels, ${typeof foundry.CONST.GRID_MIN_SIZE} or greater`;
  };
  shiftX: FieldReturnType<fields.IntegerField, { required: true; default: 0 }>;
  shiftY: FieldReturnType<fields.IntegerField, { required: true; default: 0 }>;
  gridColor: FieldReturnType<fields.ColorField, { required: true; default: "#000000" }>;
  gridAlpha: FieldReturnType<fields.AlphaField, { required: true; default: 0.2 }>;
  gridDistance: FieldReturnType<fields.RequiredPositiveNumber, { default: () => number }>;
  gridUnits: FieldReturnType<fields.BlankString, { default: () => string }>;
  tokenVision: FieldReturnType<fields.BooleanField, { default: true }>;
  fogExploration: FieldReturnType<fields.BooleanField, { default: true }>;
  fogReset: fields.TimestampField;
  globalLight: fields.BooleanField;
  globalLightThreshold: DocumentField<Number> & {
    type: typeof Number;
    required: true;
    nullable: true;
    default: null;
    validate: (n: unknown) => boolean;
    validationError: "Invalid {name} {field} which must be null, or a number between 0 and 1";
  };
  darkness: FieldReturnType<fields.AlphaField, { default: 0 }>;
  drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing>;
  tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken>;
  lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight>;
  notes: fields.EmbeddedCollectionField<typeof documents.BaseNote>;
  sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound>;
  templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate>;
  tiles: fields.EmbeddedCollectionField<typeof documents.BaseTile>;
  walls: fields.EmbeddedCollectionField<typeof documents.BaseWall>;
  playlist: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylist; required: false }>;
  playlistSound: fields.ForeignDocumentField<{ type: typeof documents.BasePlaylistSound; required: false }>;
  journal: fields.ForeignDocumentField<{ type: typeof documents.BaseJournalEntry; required: false }>;
  weather: fields.BlankString;
  folder: fields.ForeignDocumentField<{ type: typeof documents.BaseFolder }>;
  sort: fields.IntegerSortField;
  permission: fields.DocumentPermissions;
  flags: fields.ObjectField;
}

interface SceneDataProperties {
  /**
   * The _id which uniquely identifies this Scene document
   * @defaultValue `null`
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
   * @defaultValue `0`
   */
  navOrder: number;

  /**
   * A string which overrides the canonical Scene name which is displayed in the navigation bar
   * @defaultValue `""`
   */
  navName: string;

  /**
   * An image or video file path which provides the background media for the scene
   */
  img: string | null | undefined;

  /**
   * An image or video file path which is drawn on top of all other elements in the scene
   */
  foreground: string | null | undefined;

  /**
   * A thumbnail image (base64) or file path which visually summarizes the scene
   */
  thumb: string | null | undefined;

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
   * @defaultValue `"#999999"`
   */
  backgroundColor: string | null;

  /**
   * The type of grid used in this scene, a number from CONST.GRID_TYPES
   * @defaultValue `CONST.GRID_TYPES.SQUARE`
   */
  gridType: foundry.CONST.GRID_TYPES;

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
   * @defaultValue `"#000000"`
   */
  gridColor: string | null;

  /**
   * A number between 0 and 1 for the opacity of the grid lines
   * @defaultValue `0.2`
   */
  gridAlpha: number;

  /**
   * The number of distance units which are represented by a single grid space.
   * @defaultValue `game.system.data.gridDistance || 1`
   */
  gridDistance: number;

  /**
   * A label for the units of measure which are used for grid distance.
   * @defaultValue `game.system.data.gridUnits ?? ""`
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
   * @defaultValue `Date.now()`
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
   * @defaultValue `new EmbeddedCollection(DrawingData, [], BaseDrawing.implementation)`
   */
  drawings: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseDrawing>, SceneData>;

  /**
   * A collection of embedded Token objects.
   * @defaultValue `new EmbeddedCollection(TokenData, [], BaseToken.implementation)`
   */
  tokens: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseToken>, SceneData>;

  /**
   * A collection of embedded AmbientLight objects.
   * @defaultValue `new EmbeddedCollection(AmbientLightData, [], BaseAmbientLight.implementation)`
   */
  lights: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseAmbientLight>, SceneData>;

  /**
   * A collection of embedded Note objects.
   * @defaultValue `new EmbeddedCollection(NoteData, [], BaseNote.implementation)`
   */
  notes: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseNote>, SceneData>;

  /**
   * A collection of embedded AmbientSound objects.
   * @defaultValue `new EmbeddedCollection(AmbientSoundData, [], BaseAmbientSound.implementation)`
   */
  sounds: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseAmbientSound>, SceneData>;

  /**
   * A collection of embedded MeasuredTemplate objects.
   * @defaultValue `new EmbeddedCollection(MeasuredTemplateData, [], BaseMeasuredTemplate.implementation)`
   */
  templates: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseMeasuredTemplate>, SceneData>;

  /**
   * A collection of embedded Tile objects.
   * @defaultValue `new EmbeddedCollection(TileData, [], BaseTile.implementation)`
   */
  tiles: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseTile>, SceneData>;

  /**
   * A collection of embedded Wall objects
   * @defaultValue `new EmbeddedCollection(WallData, [], BaseWall.implementation)`
   */
  walls: EmbeddedCollection<ConfiguredDocumentClass<typeof documents.BaseWall>, SceneData>;

  /**
   * A linked Playlist document which should begin automatically playing when this
   * Scene becomes active.
   * @defaultValue `null`
   */
  playlist: string | null;

  /**
   * A linked PlaylistSound document from the selected playlist that will
   * begin automatically playing when this Scene becomes active.
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
   * @defaultValue `""`
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
   * An object which configures user permissions to this Scene
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>>;

  /**
   * An object of optional key/value flags
   */
  flags: ConfiguredFlags<"Scene">;
}

interface SceneDataConstructorData {
  /**
   * The _id which uniquely identifies this Scene document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The name of this scene
   */
  name: string;

  /**
   * Is this scene currently active? Only one scene may be active at a given time.
   * @defaultValue `false`
   */
  active?: boolean | null | undefined;

  /**
   * Is this scene displayed in the top navigation bar?
   * @defaultValue `true`
   */
  navigation?: boolean | null | undefined;

  /**
   * The integer sorting order of this Scene in the navigation bar relative to others
   * @defaultValue `0`
   */
  navOrder?: number | null | undefined;

  /**
   * A string which overrides the canonical Scene name which is displayed in the navigation bar
   * @defaultValue `""`
   */
  navName?: string | null | undefined;

  /**
   * An image or video file path which provides the background media for the scene
   */
  img?: string | null | undefined;

  /**
   * An image or video file path which is drawn on top of all other elements in the scene
   */
  foreground?: string | null | undefined;

  /**
   * A thumbnail image (base64) or file path which visually summarizes the scene
   */
  thumb?: string | null | undefined;

  /**
   * The width of the scene canvas, this should normally be the width of the background media
   * @defaultValue `4000`
   */
  width?: number | null | undefined;

  /**
   * The height of the scene canvas, this should normally be the height of the background media
   * @defaultValue `3000`
   */
  height?: number | null | undefined;

  /**
   * The proportion of canvas padding applied around the outside of the scene
   * dimensions to provide additional buffer space
   * @defaultValue `0.25`
   */
  padding?: number | null | undefined;

  /**
   * The initial view coordinates for the scene, or null
   * @defaultValue `null`
   */
  initial?: { x: number; y: number; scale: number } | null | undefined;

  /**
   * The color of the canvas which is displayed behind the scene background
   * @defaultValue `#999999`
   */
  backgroundColor?: string | null | undefined;

  /**
   * The type of grid used in this scene, a number from CONST.GRID_TYPES
   * @defaultValue `CONST.GRID_TYPES.SQUARE`
   */
  gridType?: foundry.CONST.GRID_TYPES | null | undefined;

  /**
   * The grid size which represents the width (or height) of a single grid space
   * @defaultValue `100`
   */
  grid?: number | null | undefined;

  /**
   * A number of offset pixels that the background image is shifted horizontally relative to the grid
   * @defaultValue `0`
   */
  shiftX?: number | null | undefined;

  /**
   * A number of offset pixels that the background image is shifted vertically relative to the grid
   * @defaultValue `0`
   */
  shiftY?: number | null | undefined;

  /**
   * A string representing the color used to render the grid lines
   * @defaultValue `#000000`
   */
  gridColor?: string | null | undefined;

  /**
   * A number between 0 and 1 for the opacity of the grid lines
   * @defaultValue `0.2`
   */
  gridAlpha?: number | null | undefined;

  /**
   * The number of distance units which are represented by a single grid space.
   * @defaultValue `game.system.data.gridDistance || 1`
   */
  gridDistance?: number | null | undefined;

  /**
   * A label for the units of measure which are used for grid distance.
   * @defaultValue `game.system.data.gridUnits ?? ""`
   */
  gridUnits?: string | null | undefined;

  /**
   * Do Tokens require vision in order to see the Scene environment?
   * @defaultValue `true`
   */
  tokenVision?: boolean | null | undefined;

  /**
   * Should fog exploration progress be tracked for this Scene?
   * @defaultValue `true`
   */
  fogExploration?: boolean | null | undefined;

  /**
   * The timestamp at which fog of war was last reset for this Scene.
   * @defaultValue `Date.now()`
   */
  fogReset?: number | null | undefined;

  /**
   * Does this Scene benefit from global illumination which provides bright light everywhere?
   * @defaultValue `false`
   */
  globalLight?: boolean | null | undefined;

  /**
   * A darkness level between 0 and 1, beyond which point global illumination is
   * temporarily disabled if globalLight is true.
   * @defaultValue `null`
   */
  globalLightThreshold?: number | null | undefined;

  /**
   * The ambient darkness level in this Scene, where 0 represents mid-day
   * (maximum illumination) and 1 represents mid-night (maximum darkness)
   * @defaultValue `0`
   */
  darkness?: number | null | undefined;

  /**
   * A collection of embedded Drawing objects.
   * @defaultValue `new EmbeddedCollection(DrawingData, [], BaseDrawing.implementation)`
   */
  drawings?: DrawingDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded Token objects.
   * @defaultValue `new EmbeddedCollection(TokenData, [], BaseToken.implementation)`
   */
  tokens?: TokenDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded AmbientLight objects.
   * @defaultValue `new EmbeddedCollection(AmbientLightData, [], BaseAmbientLight.implementation)`
   */
  lights?: AmbientLightDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded Note objects.
   * @defaultValue `new EmbeddedCollection(NoteData, [], BaseNote.implementation)`
   */
  notes?: NoteDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded AmbientSound objects.
   * @defaultValue `new EmbeddedCollection(AmbientSoundData, [], BaseAmbientSound.implementation)`
   */
  sounds?: AmbientSoundDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded MeasuredTemplate objects.
   * @defaultValue `new EmbeddedCollection(MeasuredTemplateData, [], BaseMeasuredTemplate.implementation)`
   */
  templates?: MeasuredTemplateDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded Tile objects.
   * @defaultValue `new EmbeddedCollection(TileData, [], BaseTile.implementation)`
   */
  tiles?: TileDataConstructorData[] | null | undefined;

  /**
   * A collection of embedded Wall objects
   * @defaultValue `new EmbeddedCollection(WallData, [], BaseWall.implementation)`
   */
  walls?: WallDataConstructorData[] | null | undefined;

  /**
   * A linked Playlist document which should begin automatically playing when this
   * Scene becomes active.
   * @defaultValue `null`
   */
  playlist?: InstanceType<ConfiguredDocumentClass<typeof documents.BasePlaylist>> | string | null | undefined;

  /**
   * A linked PlaylistSound document from the selected playlist that will
   * begin automatically playing when this Scene becomes active.
   * @defaultValue `null`
   */
  playlistSound?: InstanceType<ConfiguredDocumentClass<typeof documents.BasePlaylistSound>> | string | null | undefined;

  /**
   * A linked JournalEntry document which provides narrative details about this Scene.
   * @defaultValue `null`
   */
  journal?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseJournalEntry>> | string | null | undefined;

  /**
   * A named weather effect which should be rendered in this Scene.
   * @defaultValue `""`
   */
  weather?: string | null | undefined;

  /**
   * The _id of a Folder which contains this Actor
   * @defaultValue `null`
   */
  folder?: InstanceType<ConfiguredDocumentClass<typeof documents.BaseFolder>> | string | null | undefined;

  /**
   * The numeric sort value which orders this Actor relative to its siblings
   * @defaultValue `0`
   */
  sort?: number | null | undefined;

  /**
   * An object which configures user permissions to this Scene
   * @defaultValue `{ default: CONST.DOCUMENT_OWNERSHIP_LEVELS.NONE }`
   */
  permission?: Partial<Record<string, foundry.CONST.DOCUMENT_OWNERSHIP_LEVELS>> | null | undefined;

  /**
   * An object of optional key/value flags
   */
  flags?: ConfiguredFlags<"Scene"> | null | undefined;
}

type SceneDataSource = PropertiesToSource<SceneDataProperties>;

/**
 * The data schema for a Scene document.
 * @see BaseScene
 */
export class SceneData extends DocumentData<
  SceneDataSchema,
  SceneDataProperties,
  SceneDataSource,
  SceneDataConstructorData,
  documents.BaseScene
> {
  /**
   * @remarks This override does not exist in foundry but is added here to prevent runtime errors.
   */
  constructor(data: SceneDataConstructorData, document?: documents.BaseScene | null);

  static override defineSchema(): SceneDataSchema;

  protected override _initialize(): void;

  size: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SceneData extends SceneDataProperties {}

/**
 * Verify that the initial view position for a Scene is valid
 * @param pos - The scene position object, or null
 * @returns Is the position valid?
 */
declare function _validateInitialViewPosition(pos: unknown): pos is { x: number; y: number; scale: number } | null;
