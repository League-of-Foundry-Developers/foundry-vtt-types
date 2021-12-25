import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseAmbientLight } from '../../documents.mjs';
import * as fields from '../fields.mjs';
import type { LightData, LightDataConstructorData } from './lightData.js';

interface AmbientLightDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  walls: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  vision: typeof fields.BOOLEAN_FIELD;
  config: DocumentField<LightData> & {
    type: typeof LightData;
    required: true;
    default: {};
  };
  hidden: typeof fields.BOOLEAN_FIELD;
  flags: typeof fields.OBJECT_FIELD;
}

interface AmbientLightDataProperties {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id: string | null;

  /**
   * The x-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  x: number;

  /**
   * The y-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  y: number;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * Whether or not this light source is constrained by Walls
   * @defaultValue `true`
   */
  walls: boolean;

  /**
   * Whether or not this light source provides a source of vision
   * @defaultValue `false`
   */
  vision: boolean;

  /**
   * Light configuration data
   * @defaultValue `new LightData({})`
   */
  config: LightData;

  /**
   * Is the light source currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: ConfiguredFlags<'AmbientLight'>;
}

interface AmbientLightDataConstructorData {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id?: string | null | undefined;

  /**
   * The x-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  x?: number | null | undefined;

  /**
   * The y-coordinate position of the origin of the light
   * @defaultValue `0`
   */
  y?: number | null | undefined;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation?: number | null | undefined;

  /**
   * Whether or not this light source is constrained by Walls
   * @defaultValue `true`
   */
  walls?: boolean | undefined | null;

  /**
   * Whether or not this light source provides a source of vision
   * @defaultValue `false`
   */
  vision?: boolean | undefined | null;

  /**
   * Light configuration data
   * @defaultValue `new LightData({})`
   */
  config?: LightDataConstructorData | undefined | null;

  /**
   * Is the light source currently hidden?
   * @defaultValue `false`
   */
  hidden?: boolean | null | undefined;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags?: ConfiguredFlags<'AmbientLight'> | null | undefined;
}

/**
 * The data schema for a AmbientLight embedded document.
 * @see BaseAmbientLight
 */
export declare class AmbientLightData extends DocumentData<
  AmbientLightDataSchema,
  AmbientLightDataProperties,
  PropertiesToSource<AmbientLightDataProperties>,
  AmbientLightDataConstructorData,
  BaseAmbientLight
> {
  static defineSchema(): AmbientLightDataSchema;

  _initializeSource(data: AmbientLightDataConstructorData): PropertiesToSource<AmbientLightDataProperties>;

  _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientLightData extends AmbientLightDataProperties {}
