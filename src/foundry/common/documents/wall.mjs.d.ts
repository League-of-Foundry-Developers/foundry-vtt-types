import Document, { DocumentMetadata } from '../abstract/document.mjs';
import * as CONST from '../constants.mjs';
import * as fields from '../data/fields.mjs';
import { DataModel, DataSchema } from '../abstract/module.mjs';
import BaseUser from './user.mjs.js';
import { ConfiguredDocumentClass } from '../../../types/helperTypes.js';
import type BaseScene from './scene.mjs.js';
import type { FlagsField } from '../data/flagsField.js';

interface BaseWallSchema extends DataSchema {
  /**
   * The _id which uniquely identifies the embedded Wall document
   */
  _id: fields.DocumentIdField<{}>;

  /**
   * The wall coordinates, a length-4 array of finite numbers [x0,y0,x1,y1]
   */
  c: fields.ArrayField<
    fields.NumberField<{ required: true; integer: true; nullable: false }>,
    {
      validate: (c: [number, number, number, number]) => boolean;
      validationError: 'must be a length-4 array of integer coordinates';
    },
    // Specialize the type to be a tuple of four elements.
    SimpleMerge<
      fields.ArrayField.ExtendsOptions<fields.DataField.Any>,
      {
        SourceType: [number, number, number, number];
        InitializedType: [number, number, number, number];
      }
    >
  >;

  /**
   * The illumination restriction type of this wall
   * (default: `0`)
   */
  light: fields.NumberField<{
    required: true;
    choices: CONST.WALL_SENSE_TYPES[];
    initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
    validationError: 'must be a value in CONST.WALL_SENSE_TYPES';
  }>;

  /**
   * The movement restriction type of this wall
   * (default: `0`)
   */
  move: fields.NumberField<{
    required: true;
    choices: CONST.WALL_MOVEMENT_TYPES[];
    initial: typeof CONST.WALL_MOVEMENT_TYPES.NORMAL;
    validationError: 'must be a value in CONST.WALL_MOVEMENT_TYPES';
  }>;

  /**
   * The visual restriction type of this wall
   * (default: `0`)
   */
  sight: fields.NumberField<{
    required: true;
    choices: CONST.WALL_SENSE_TYPES[];
    initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
    validationError: 'must be a value in CONST.WALL_SENSE_TYPES';
  }>;

  /**
   * The auditory restriction type of this wall
   * (default: `0`)
   */
  sound: fields.NumberField<{
    required: true;
    choices: CONST.WALL_SENSE_TYPES[];
    initial: typeof CONST.WALL_SENSE_TYPES.NORMAL;
    validationError: 'must be a value in CONST.WALL_SENSE_TYPES';
  }>;

  /**
   * The direction of effect imposed by this wall
   * (default: `0`)
   */
  dir: fields.NumberField<{
    required: true;
    choices: CONST.WALL_DIRECTIONS[];
    initial: typeof CONST.WALL_DIRECTIONS.BOTH;
    validationError: 'must be a value in CONST.WALL_DIRECTIONS';
  }>;

  /**
   * The type of door which this wall contains, if any
   * (default: `0`)
   */
  door: fields.NumberField<{
    required: true;
    choices: CONST.WALL_DOOR_TYPES[];
    initial: typeof CONST.WALL_DOOR_TYPES.NONE;
    validationError: 'must be a value in CONST.WALL_DOOR_TYPES';
  }>;

  /**
   * The state of the door this wall contains, if any
   * (default: `0`)
   */
  ds: fields.NumberField<{
    required: true;
    choices: CONST.WALL_DOOR_STATES[];
    initial: typeof CONST.WALL_DOOR_STATES.CLOSED;
    validationError: 'must be a value in CONST.WALL_DOOR_STATES';
  }>;

  /**
   * An object of optional key/value flags
   */
  flags: FlagsField<'Wall', {}>;
}

type CanUpdate = (
  user: BaseUser,
  doc: BaseWall,
  data: DeepPartial<DataModel.SchemaToSource<BaseWall['schema']>>
) => boolean;

type BaseWallMetadata = Merge<
  DocumentMetadata,
  {
    name: 'Wall';
    collection: 'walls';
    label: 'DOCUMENT.Wall';
    labelPlural: 'DOCUMENT.Walls';
    permissions: {
      update: CanUpdate;
    };
  }
>;

/**
 * The Document definition for a Wall.
 * Defines the DataSchema and common behaviors for a Wall which are shared between both client and server.
 */
declare class BaseWall extends Document<
  BaseWallSchema,
  InstanceType<ConfiguredDocumentClass<typeof Scene>>,
  BaseWallMetadata
> {
  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static override readonly metadata: BaseWallMetadata;

  /** {@inheritdoc} */
  static override defineSchema(): BaseWallSchema;

  /**
   * Is a user able to update an existing Wall?
   */
  static #canUpdate: CanUpdate;

  /* -------------------------------------------- */
  /*  Deprecations and Compatibility              */
  /* -------------------------------------------- */

  /** {@inheritdoc} */
  static migrateData(data: Record<string, unknown>): Record<string, unknown>;
}

export default BaseWall;
