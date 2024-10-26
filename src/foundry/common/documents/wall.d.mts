import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseWall extends Document<BaseWall.Schema, BaseWall.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Wall
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseWall.ConstructorData, context?: Document.ConstructionContext<BaseWall.Parent>);

  override parent: BaseWall.Parent;

  static override metadata: Readonly<BaseWall.Metadata>;

  static override defineSchema(): BaseWall.Schema;

  static override migrateData(source: AnyObject): AnyObject;
}

export default BaseWall;

declare namespace BaseWall {
  type Parent = Scene.ConfiguredInstance | null;

  type Metadata = Merge<
    Document.Metadata.Default,
    {
      name: "Wall";
      collection: "walls";
      label: string;
      labelPlural: string;
      permissions: {
        update: (user: foundry.documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  export interface ThresholdSchema extends DataSchema {
    /**
     * Minimum distance from a light source for which this wall blocks light
     */
    light: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Minimum distance from a vision source for which this wall blocks vision
     */
    sight: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Minimum distance from a sound source for which this wall blocks sound
     */
    sound: fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>;

    /**
     * Whether to attenuate the source radius when passing through the wall
     */
    attenuation: fields.BooleanField;
  }

  interface CoordinateOptions {
    required: true;
    integer: true;
    nullable: false;
    validate: (c: [x0: number, y0: number, x1: number, y1: number]) => boolean;
    validationError: "must be a length-4 array of integer coordinates";
  }

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseWall embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
     */
    c: fields.ArrayField<
      fields.NumberField<CoordinateOptions>,
      fields.ArrayField.AssignmentElementType<fields.NumberField<CoordinateOptions>>,
      fields.ArrayField.InitializedElementType<fields.NumberField<CoordinateOptions>>,
      fields.ArrayField.DefaultOptions<fields.ArrayField.AssignmentElementType<fields.NumberField<CoordinateOptions>>>,
      [x0: number, y0: number, x1: number, y1: number],
      [x0: number, y0: number, x1: number, y1: number],
      fields.ArrayField.PersistedElementType<fields.NumberField<CoordinateOptions>>,
      [x0: number, y0: number, x1: number, y1: number]
    >;

    /**
     * The illumination restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
     */
    light: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The movement restriction type of this wall
     * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL`
     */
    move: fields.NumberField<{
      required: true;
      choices: CONST.WALL_MOVEMENT_TYPES[];
      initial: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_MOVEMENT_TYPES";
    }>;

    /**
     * The visual restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
     */
    sight: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The auditory restriction type of this wall
     * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
     */
    sound: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The direction of effect imposed by this wall
     * @defaultValue `CONST.WALL_DIRECTIONS.BOTH`
     */
    dir: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DIRECTIONS[];
      initial: typeof CONST.WALL_DIRECTIONS.BOTH;
      validationError: "must be a value in CONST.WALL_DIRECTIONS";
    }>;

    /**
     * The type of door which this wall contains, if any
     * @defaultValue `CONST.WALL_DOOR_TYPES.NONE`
     */
    door: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DOOR_TYPES[];
      initial: typeof CONST.WALL_DOOR_TYPES.NONE;
      validationError: "must be a value in CONST.WALL_DOOR_TYPES";
    }>;

    /**
     * The state of the door this wall contains, if any
     * @defaultValue `CONST.WALL_DOOR_STATES.CLOSED`
     */
    ds: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DOOR_STATES[];
      initial: typeof CONST.WALL_DOOR_STATES.CLOSED;
      validationError: "must be a value in CONST.WALL_DOOR_STATES";
    }>;

    doorSound: fields.StringField<{ required: false; blank: true; initial: undefined }>;

    /**
     * Configuration of threshold data for this wall
     */
    threshold: fields.SchemaField<ThresholdSchema>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Wall">;
  }
}
