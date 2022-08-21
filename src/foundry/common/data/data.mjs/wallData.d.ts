import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import DocumentData from "../../abstract/data.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

interface WallDataSchema extends DocumentSchema {
  _id: fields.DocumentId;
  c: DocumentField<[x0: number, y0: number, x1: number, y1: number]> & {
    type: [typeof Number];
    required: true;
    validate: (c: unknown) => c is [x0: number, y0: number, x1: number, y1: number];
    validationError: "Invalid {name} coordinates provided which must be a length-4 array of finite numbers";
  };
  light: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_SENSE_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_SENSE_TYPES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES";
    }
  >;
  move: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_MOVEMENT_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_MOVEMENT_TYPES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_MOVEMENT_TYPES";
    }
  >;
  sight: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_SENSE_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_SENSE_TYPES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES";
    }
  >;
  sound: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_SENSE_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_SENSE_TYPES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES";
    }
  >;
  dir: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_DIRECTIONS.BOTH;
      validate: (v: unknown) => v is foundry.CONST.WALL_DIRECTIONS;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DIRECTIONS";
    }
  >;
  door: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_DOOR_TYPES.NONE;
      validate: (v: unknown) => v is foundry.CONST.WALL_DOOR_TYPES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DOOR_TYPES";
    }
  >;
  ds: FieldReturnType<
    fields.RequiredNumber,
    {
      default: typeof foundry.CONST.WALL_DOOR_STATES.CLOSED;
      validate: (v: unknown) => v is foundry.CONST.WALL_DOOR_STATES;
      validationError: "Invalid {name} {field} which must be a value in CONST.WALL_DOOR_STATES";
    }
  >;
  flags: fields.ObjectField;
}

interface WallDataProperties {
  /**
   * The _id which uniquely identifies the embedded Wall document
   * @defaultValue `null`
   */
  _id: string | null;

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: [x0: number, y0: number, x1: number, y1: number];

  /**
   * The illumination restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  light: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * The movement restriction type of this wall
   * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL`
   */
  move: foundry.CONST.WALL_MOVEMENT_TYPES;

  /**
   * The visual restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sight: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * The auditory restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sound: foundry.CONST.WALL_SENSE_TYPES;

  /**
   * The direction of effect imposed by this wall
   * @defaultValue `CONST.WALL_DIRECTIONS.BOTH`
   */
  dir: foundry.CONST.WALL_DIRECTIONS;

  /**
   * The type of door which this wall contains, if any
   * @defaultValue `CONST.WALL_DOOR_TYPES.NONE`
   */
  door: foundry.CONST.WALL_DOOR_TYPES;

  /**
   * The state of the door this wall contains, if any
   * @defaultValue `CONST.WALL_DOOR_STATES.CLOSED`
   */
  ds: foundry.CONST.WALL_DOOR_STATES;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<"Wall">;
}

interface WallDataConstructorData {
  /**
   * The _id which uniquely identifies the embedded Wall document
   * @defaultValue `null`
   */
  _id?: string | null | undefined;

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: [x0: number, y0: number, x1: number, y1: number];

  /**
   * The illumination restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  light?: foundry.CONST.WALL_SENSE_TYPES | null | undefined;

  /**
   * The movement restriction type of this wall
   * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL`
   */
  move?: foundry.CONST.WALL_MOVEMENT_TYPES | null | undefined;

  /**
   * The visual restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sight?: foundry.CONST.WALL_SENSE_TYPES | null | undefined;

  /**
   * The auditory restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sound?: foundry.CONST.WALL_SENSE_TYPES | null | undefined;

  /**
   * The direction of effect imposed by this wall
   * @defaultValue `CONST.WALL_DIRECTIONS.BOTH`
   */
  dir?: foundry.CONST.WALL_DIRECTIONS | null | undefined;

  /**
   * The type of door which this wall contains, if any
   * @defaultValue `CONST.WALL_DOOR_TYPES.NONE`
   */
  door?: foundry.CONST.WALL_DOOR_TYPES | null | undefined;

  /**
   * The state of the door this wall contains, if any
   * @defaultValue `CONST.WALL_DOOR_STATES.CLOSED`
   */
  ds?: foundry.CONST.WALL_DOOR_STATES | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<"Wall"> | null | undefined;
}

type WallDataSource = PropertiesToSource<WallDataProperties>;

/**
 * The data schema for a Wall document.
 * @see BaseWall
 */
export class WallData extends DocumentData<
  WallDataSchema,
  WallDataProperties,
  WallDataSource,
  WallDataConstructorData,
  documents.BaseWall
> {
  /**
   * The data schema for a WallData object
   */
  static override defineSchema(): WallDataSchema;

  /**
   * @remarks This override does not exist in foundry but is added here to prepend runtime errors.
   */
  constructor(data: WallDataConstructorData, document?: documents.BaseWall | null);

  override _initializeSource(data?: WallDataConstructorData): WallDataSource;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WallData extends WallDataProperties {}
