// FOUNDRY_VERSION: 10.291

import Document from "../abstract/document.mjs";
import type { DocumentMetadata } from "../abstract/document.mjs";
import * as CONST from "../constants.mjs";
import * as fields from "../data/fields.mjs";

declare global {
  type WallData = BaseWall.Properties;
}

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseWall extends BaseWall.Properties {}
declare class BaseWall extends Document<BaseWall.SchemaField, BaseWall.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Wall
   * @param context - Construction context options
   */
  constructor(data: BaseWall.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseWall.Metadata>;

  static override defineSchema(): BaseWall.Schema;

  static override migrateData(source: object): object;
}
export default BaseWall;

declare namespace BaseWall {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Wall";
      collection: "walls";
      label: "DOCUMENT.Wall";
      labelPlural: "DOCUMENT.Walls";
      permissions: {
        update: (user: foundry.documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this BaseWall embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * A length-4 array of integer coordinates which determine where the wall endpoints are located on the canvas.
     *
     * The coordinates are:
     * - 0: x1
     * - 1: y1
     * - 2: x2
     * - 3: y2
     */
    c: fields.ArrayField<
      fields.NumberField<{
        required: true;
        integer: true;
        nullable: false;
        validate: (c: number[]) => boolean;
        validationError: "must be a length-4 array of integer coordinates";
      }>
    >;

    /**
     * The type of sensory collision which this Wall may impose on light.
     * @defaultValue `20`
     */
    light: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The types of movement collision which this Wall may impose
     * @defaultValue `20`
     */
    move: fields.NumberField<{
      required: true;
      choices: CONST.WALL_MOVEMENT_TYPES[];
      initial: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_MOVEMENT_TYPES";
    }>;

    /**
     * The type of sensory collision which this Wall may impose on sight.
     * @defaultValue `20`
     */
    sight: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The type of sensory collision which this Wall may impose on sound.
     * @defaultValue `20`
     */
    sound: fields.NumberField<{
      required: true;
      choices: CONST.WALL_SENSE_TYPES[];
      initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validationError: "must be a value in CONST.WALL_SENSE_TYPES";
    }>;

    /**
     * The direction(s) of effect that this Wall can have.
     * @defaultValue `0`
     */
    dir: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DIRECTIONS[];
      initial: typeof CONST.WALL_DIRECTIONS.BOTH;
      validationError: "must be a value in CONST.WALL_DIRECTIONS";
    }>;

    /**
     * The door type of this Wall.
     * @defaultValue `0`
     */
    door: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DOOR_TYPES[];
      initial: typeof CONST.WALL_DOOR_TYPES.NONE;
      validationError: "must be a value in CONST.WALL_DOOR_TYPES";
    }>;

    /**
     * The door state of this Wall.
     * @defaultValue `0`
     */
    ds: fields.NumberField<{
      required: true;
      choices: CONST.WALL_DOOR_STATES[];
      initial: typeof CONST.WALL_DOOR_STATES.CLOSED;
      validationError: "must be a value in CONST.WALL_DOOR_STATES";
    }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Wall">;
  }
}
