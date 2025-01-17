import type { AnyObject } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type { TextureData } from "../data/data.mts";
import type * as fields from "../data/fields.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Document definition for a Tile.
 * Defines the DataSchema and common behaviors for a Tile which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseTile extends Document<"Tile", BaseTile.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Tile
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseTile.ConstructorData, context?: Document.ConstructionContext<BaseTile.Parent>);

  override parent: BaseTile.Parent;

  static override metadata: BaseTile.Metadata;

  static override defineSchema(): BaseTile.Schema;

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

  static " __fvtt_types_internal_document_name": "Tile";
}

export default BaseTile;

declare namespace BaseTile {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Document.MetadataFor<"Tile">;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.CreateData<Schema>;
  type UpdateData = fields.SchemaField.AssignmentData<Schema>;
  type Properties = fields.SchemaField.InitializedData<Schema>;
  type Source = fields.SchemaField.PersistedData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Tile embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * An image or video texture which this tile displays.
     * @defaultValue `null`
     */
    texture: TextureData<{ categories: ("IMAGE" | "VIDEO")[]; initial: null; wildcard: false }>;

    /**
     * The pixel width of the tile
     */
    width: fields.NumberField<{
      required: true;
      min: 0;
      nullable: false;
      step: 0.1;
    }>;

    /**
     * The pixel height of the tile
     */
    height: fields.NumberField<{ required: true; min: 0; nullable: false; step: 0.1 }>;

    /**
     * The x-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    x: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "XCoord" }>;

    /**
     * The y-coordinate position of the top-left corner of the tile
     * @defaultValue `0`
     */
    y: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 0; label: "YCoord" }>;

    /**
     * The z-index ordering of this tile relative to its siblings
     * @defaultValue `100`
     */
    z: fields.NumberField<{ required: true; integer: true; nullable: false; initial: 100 }>;

    /**
     * The angle of rotation for the tile between 0 and 360
     * @defaultValue `0`
     */
    rotation: fields.AngleField;

    /**
     * The tile opacity
     * @defaultValue `1`
     */
    alpha: fields.AlphaField;

    /**
     * Is the tile currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField;

    /**
     * Is the tile currently locked?
     * @defaultValue `false`
     */
    locked: fields.BooleanField;

    /**
     * Is the tile an overhead tile?
     * @defaultValue `false`
     */
    overhead: fields.BooleanField;

    /**
     * Is the tile a roof?
     * @defaultValue `false`
     */
    roof: fields.BooleanField;

    /**
     * The tile's occlusion settings
     * @defaultValue see properties
     */
    occlusion: fields.SchemaField<{
      /**
       * The occlusion mode from CONST.TILE_OCCLUSION_MODES
       * @defaultValue `1`
       */
      mode: fields.NumberField<{
        choices: CONST.OCCLUSION_MODES[];
        initial: typeof CONST.OCCLUSION_MODES.FADE;
        validationError: "must be a value in CONST.TILE_OCCLUSION_MODES";
      }>;

      /**
       * The occlusion alpha between 0 and 1
       * @defaultValue `0`
       */
      alpha: fields.AlphaField<{ initial: 0 }>;

      /**
       * An optional radius of occlusion used for RADIAL mode
       * @defaultValue `null`
       */
      radius: fields.NumberField<{ positive: true }>;
    }>;

    /**
     * The tile's video settings
     * @defaultValue see properties
     */
    video: fields.SchemaField<{
      /**
       * Automatically loop the video?
       * @defaultValue `true`
       */
      loop: fields.BooleanField<{ initial: true }>;

      /**
       * Should the video play automatically?
       * @defaultValue `true`
       */
      autoplay: fields.BooleanField<{ initial: true }>;

      /**
       * The volume level of any audio that the video file contains
       * @defaultValue `0`
       */
      volume: fields.AlphaField<{ initial: 0; step: 0.01 }>;
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Tile">;
  }
}
