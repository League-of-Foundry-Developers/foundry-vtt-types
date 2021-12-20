import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import DocumentData from '../../abstract/data.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';

interface WallDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  c: DocumentField<[x0: number, y0: number, x1: number, y1: number]> & {
    type: typeof Number[];
    required: true;
    validate: (c: unknown) => c is [x0: number, y0: number, x1: number, y1: number];
    validationError: 'Invalid {name} coordinates provided which must be a length-4 array of finite numbers';
  };
  move: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_MOVEMENT_TYPES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_MOVEMENT_TYPES';
    }
  >;
  sense: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_SENSE_TYPES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES';
    }
  >;
  sound: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_SENSE_TYPES.NORMAL;
      validate: (v: unknown) => v is foundry.CONST.WALL_SENSE_TYPES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_SENSE_TYPES';
    }
  >;
  dir: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_DIRECTIONS.BOTH;
      validate: (v: unknown) => v is foundry.CONST.WALL_DIRECTIONS;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_DIRECTIONS';
    }
  >;
  door: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_DOOR_TYPES.NONE;
      validate: (v: unknown) => v is foundry.CONST.WALL_DOOR_TYPES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_DOOR_TYPES';
    }
  >;
  ds: FieldReturnType<
    typeof fields.REQUIRED_NUMBER,
    {
      default: typeof CONST.WALL_DOOR_STATES.CLOSED;
      validate: (v: unknown) => v is foundry.CONST.WALL_DOOR_STATES;
      validationError: 'Invalid {name} {field} which must be a value in CONST.WALL_DOOR_STATES';
    }
  >;
  flags: typeof fields.OBJECT_FIELD;
}

interface WallDataProperties {
  /**
   * The _id which uniquely identifies the embedded Wall document
   */
  _id: string | null;

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: [x0: number, y0: number, x1: number, y1: number];

  /**
   * The movement restriction type of this wall
   * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL`
   */
  move: foundry.CONST.WALL_MOVEMENT_TYPES;

  /**
   * The sensory restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sense: foundry.CONST.WALL_SENSE_TYPES;

  /**
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
  flags: ConfiguredFlags<'Wall'>;
}

interface WallDataConstructorData {
  /**
   * The _id which uniquely identifies the embedded Wall document
   */
  _id?: string | null | undefined;

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: [x0: number, y0: number, x1: number, y1: number];

  /**
   * The movement restriction type of this wall
   * @defaultValue `CONST.WALL_MOVEMENT_TYPES.NORMAL`
   */
  move?: foundry.CONST.WALL_MOVEMENT_TYPES | null | undefined;

  /**
   * The sensory restriction type of this wall
   * @defaultValue `CONST.WALL_SENSE_TYPES.NORMAL`
   */
  sense?: foundry.CONST.WALL_SENSE_TYPES | null | undefined;

  /**
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
  flags?: ConfiguredFlags<'Wall'> | null | undefined;
}

/**
 * The data schema for a Wall document.
 * @see BaseWall
 */
export declare class WallData extends DocumentData<
  WallDataSchema,
  WallDataProperties,
  PropertiesToSource<WallDataProperties>,
  WallDataConstructorData,
  documents.BaseWall
> {
  /**
   * The data schema for a WallData object
   */
  static defineSchema(): WallDataSchema;

  /**
   * @remarks This override does not exist in foundry but is added here to prepend runtime errors.
   */
  constructor(data: WallDataConstructorData, document?: documents.BaseWall | null);
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface WallData extends WallDataProperties {}
