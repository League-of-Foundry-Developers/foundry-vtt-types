import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { TextureData } from "../data/data.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Document definition for a Scene.
 * Defines the DataSchema and common behaviors for a Scene which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseScene extends Document<"Scene", BaseScene.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Scene
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseScene.ConstructorData, context?: Document.ConstructionContext<BaseScene.Parent>);

  override parent: BaseScene.Parent;

  static override metadata: BaseScene.Metadata;

  static override defineSchema(): BaseScene.Schema;

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BaseScene;

declare namespace BaseScene {
  type Parent = null;

  type Metadata = Document.MetadataFor<BaseScene>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Scene document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of this scene
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; blank: false; textSearch: true }>;

    /**
     * Is this scene currently active? Only one scene may be active at a given time
     * @defaultValue `false`
     */
    active: fields.BooleanField;

    /**
     * Is this scene displayed in the top navigation bar?
     * @defaultValue `true`
     */
    navigation: fields.BooleanField<{ initial: true }>;

    /**
     * The sorting order of this Scene in the navigation bar relative to siblings
     * @defaultValue `0`
     */
    navOrder: fields.NumberField<{ required: true; nullable: false; integer: true; initial: 0 }>;

    /**
     * A string which overrides Scene name for display in the navigation bar
     * @defaultValue `""`
     */
    navName: fields.HTMLField<{ textSearch: true }>;

    /**
     * An image or video file that provides the background texture for the scene.
     * @defaultValue see {@link TextureData}
     */
    background: TextureData<{ categories: ["IMAGE", "VIDEO"]; initial: null; wildcard: false }>;

    /**
     * An image or video file path providing foreground media for the scene
     * @defaultValue `null`
     */
    foreground: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"] }>;

    /**
     * The elevation of the foreground layer where overhead tiles reside
     * @defaultValue `null`
     */
    foregroundElevation: fields.NumberField<{ required: false; positive: true; integer: true }>;

    /**
     * A thumbnail image which depicts the scene at lower resolution
     * @defaultValue `null`
     */
    thumb: fields.FilePathField<{ categories: ["IMAGE"] }>;

    /**
     * The width of the scene canvas, normally the width of the background media
     * @defaultValue `4000`
     */
    width: fields.NumberField<{ integer: true; positive: true; initial: 4000 }>;

    /**
     * The height of the scene canvas, normally the height of the background media
     * @defaultValue `3000`
     */
    height: fields.NumberField<{ integer: true; positive: true; initial: 3000 }>;

    /**
     * The proportion of canvas padding applied around the outside of the scene
     * dimensions to provide additional buffer space
     * @defaultValue `0.25`
     */
    padding: fields.NumberField<{ required: true; nullable: false; min: 0; max: 0.5; step: 0.05; initial: 0.25 }>;

    /**
     * The initial view coordinates for the scene
     * @defaultValue `undefined`
     */
    initial: fields.SchemaField<{
      x: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
      y: fields.NumberField<{ integer: true; nullable: true; initial: undefined }>;
      scale: fields.NumberField<{ nullable: true; min: 0.25; max: 3; initial: undefined }>;
    }>;

    /**
     * The color of the canvas displayed behind the scene background
     * @defaultValue `"#999999"`
     */
    backgroundColor: fields.ColorField<{ initial: "#999999" }>;

    /**
     * Grid configuration for the scene
     * @defaultValue see properties
     */
    grid: fields.SchemaField<{
      /**
       * The type of grid, a number from CONST.GRID_TYPES.
       * @defaultValue `CONST.GRID_TYPES.SQUARE`
       */
      type: fields.NumberField<{
        required: true;
        choices: CONST.GRID_TYPES[];
        initial: typeof CONST.GRID_TYPES.SQUARE;
        validationError: "must be a value in CONST.GRID_TYPES";
      }>;

      /**
       * The grid size which represents the width (or height) of a single grid space.
       * @defaultValue `100`
       */
      size: fields.NumberField<{
        required: true;
        nullable: false;
        integer: true;
        min: typeof CONST.GRID_MIN_SIZE;
        initial: 100;
        validationError: `must be an integer number of pixels, ${typeof CONST.GRID_MIN_SIZE} or greater`;
      }>;

      /**
       * A string representing the color used to render the grid lines.
       * @defaultValue `"#000000"`
       */
      color: fields.ColorField<{ required: true; nullable: false; initial: "#000000" }>;

      /**
       * A number between 0 and 1 for the opacity of the grid lines.
       * @defaultValue `0.2`
       */
      alpha: fields.AlphaField<{ initial: 0.2 }>;

      /**
       * The number of distance units which are represented by a single grid space.
       * @defaultValue `game.system.gridDistance || 1`
       */
      distance: fields.NumberField<{ required: true; nullable: false; positive: true; initial: () => number }>;

      /**
       * A label for the units of measure which are used for grid distance.
       * @defaultValue `game.system.gridUnits ?? ""`
       */
      units: fields.StringField<{ initial: () => string }>;
    }>;

    /**
     * Do Tokens require vision in order to see the Scene environment?
     * @defaultValue `true`
     */
    tokenVision: fields.BooleanField<{ initial: true }>;

    /**
     * Is a global source of illumination present which provides dim light to all
     * areas of the Scene?
     * @defaultValue `true`
     */
    fogExploration: fields.BooleanField<{ initial: true }>;

    /**
     * The ambient darkness level in this Scene, where 0 represents midday
     * (maximum illumination) and 1 represents midnight (maximum darkness)
     * @defaultValue `Date.now`
     */
    fogReset: fields.NumberField<{ nullable: false; initial: number }>;

    /**
     * A darkness threshold between 0 and 1. When the Scene darkness level
     * exceeds this threshold Global Illumination is automatically disabled
     * @defaultValue `false`
     */
    globalLight: fields.BooleanField;

    /**
     * Should fog exploration progress be tracked for this Scene?
     * @defaultValue `null`
     */
    globalLightThreshold: fields.AlphaField<{ nullable: true; initial: null }>;

    /**
     * The timestamp at which fog of war was last reset for this Scene.
     * @defaultValue `0`
     */
    darkness: fields.AlphaField<{ initial: 0 }>;

    /**
     * A special overlay image or video texture which is used for fog of war
     * @defaultValue `null`
     */
    fogOverlay: fields.FilePathField<{ categories: ("IMAGE" | "VIDEO")[] }>;

    /**
     * A color tint applied to explored regions of fog of war
     * @defaultValue `null`
     */
    fogExploredColor: fields.ColorField<{ label: "SCENES.FogExploredColor" }>;

    /**
     * A color tint applied to unexplored regions of fog of war
     * @defaultValue `null`
     */
    fogUnexploredColor: fields.ColorField<{ label: "SCENES.FogUnexploredColor" }>;

    /**
     * A collection of embedded Drawing objects.
     * @defaultValue `[]`
     */
    drawings: fields.EmbeddedCollectionField<typeof documents.BaseDrawing, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded Tile objects.
     * @defaultValue `[]`
     */
    tokens: fields.EmbeddedCollectionField<typeof documents.BaseToken, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded Token objects.
     * @defaultValue `[]`
     */
    lights: fields.EmbeddedCollectionField<typeof documents.BaseAmbientLight, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded AmbientLight objects.
     * @defaultValue `[]`
     */
    notes: fields.EmbeddedCollectionField<typeof documents.BaseNote, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded Note objects.
     * @defaultValue `[]`
     */
    sounds: fields.EmbeddedCollectionField<typeof documents.BaseAmbientSound, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded AmbientSound objects.
     * @defaultValue `[]`
     */
    templates: fields.EmbeddedCollectionField<typeof documents.BaseMeasuredTemplate, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded MeasuredTemplate objects.
     * @defaultValue `[]`
     */
    tiles: fields.EmbeddedCollectionField<typeof documents.BaseTile, Scene.ConfiguredInstance>;

    /**
     * A collection of embedded Wall objects
     * @defaultValue `[]`
     */
    walls: fields.EmbeddedCollectionField<typeof documents.BaseWall, Scene.ConfiguredInstance>;

    /**
     * A linked Playlist document which should begin automatically playing when this
     * Scene becomes active.
     * @defaultValue `null`
     */
    playlist: fields.ForeignDocumentField<typeof documents.BasePlaylist>;

    /**
     * A linked PlaylistSound document from the selected playlist that will
     * begin automatically playing when this Scene becomes active
     * @defaultValue `null`
     */
    playlistSound: fields.ForeignDocumentField<typeof documents.BasePlaylistSound, { idOnly: true }>;

    /**
     * A JournalEntry document which provides narrative details about this Scene
     * @defaultValue `null`
     */
    journal: fields.ForeignDocumentField<typeof documents.BaseJournalEntry>;

    /**
     * A document ID for a JournalEntryPage which provides narrative details about this Scene
     * @defaultValue `null`
     */
    journalEntryPage: fields.ForeignDocumentField<typeof documents.BaseJournalEntryPage, { idOnly: true }>;

    /**
     * A named weather effect which should be rendered in this Scene.
     * @defaultValue `""`
     */
    weather: fields.StringField;

    /**
     * The _id of a Folder which contains this Actor
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

    /**
     * The numeric sort value which orders this Actor relative to its siblings
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Scene
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Scene">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
