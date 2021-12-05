import { ConfiguredFlags, FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import * as CONST from '../../constants.mjs';
import { BaseAmbientLight } from '../../documents.mjs';
import * as fields from '../fields.mjs';
import { AnimationData, AnimationDataConstructorData } from './animationData';
import { DarknessActivation, DarknessActivationConstructorData } from './darknessActivation';

interface AmbientLightDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  t: DocumentField<CONST.SOURCE_TYPES> & {
    type: String;
    required: true;
    default: 'l';
    validate: (t: unknown) => boolean;
    validationError: 'Invalid {name} {field} which must be a value in CONST.SOURCE_TYPES';
  };
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  dim: typeof fields.REQUIRED_NUMBER;
  bright: typeof fields.REQUIRED_NUMBER;
  angle: typeof fields.ANGLE_FIELD;
  tintColor: typeof fields.COLOR_FIELD;
  tintAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.25 }>;
  lightAnimation: DocumentField<AnimationData> & {
    type: typeof AnimationData;
    required: true;
    default: {};
  };
  darknessThreshold: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  darkness: DocumentField<DarknessActivation> & {
    type: typeof DarknessActivation;
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
   * The source type in CONST.SOURCE_TYPES which defines the behavior of this light
   * @defaultValue `'l'`
   */
  t: CONST.SOURCE_TYPES;

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
   * The radius of dim light emitted in distance units, negative values produce darkness
   * @defaultValue `0`
   */
  dim: number;

  /**
   * The radius of bright light emitted in distance units, negative values produce blackness
   * @defaultValue `0`
   */
  bright: number;

  /**
   * The angle of emission of the light source in degrees
   * @defaultValue `360`
   */
  angle: number;

  /**
   * An optional color string which applies coloration to the resulting light source
   */
  tintColor: string | null | undefined;

  /**
   * The intensity of coloration applied to this light source, a number between 0 and 1
   * @defaultValue `0.25`
   */
  tintAlpha: number;

  /**
   * A data object which configures token light animation settings, if one is applied
   * @defaultValue `{}`
   */
  lightAnimation: AnimationData;

  /**
   * A value of the Scene darkness level, above which this light source will be active
   * @defaultValue `0`
   */
  darknessThreshold: number;

  /**
   * @defaultValue `{}`
   */
  darkness: DarknessActivation;

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
   * The source type in CONST.SOURCE_TYPES which defines the behavior of this light
   * @defaultValue `'l'`
   */
  t?: CONST.SOURCE_TYPES | null | undefined;

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
   * The radius of dim light emitted in distance units, negative values produce darkness
   * @defaultValue `0`
   */
  dim?: number | null | undefined;

  /**
   * The radius of bright light emitted in distance units, negative values produce blackness
   * @defaultValue `0`
   */
  bright?: number | null | undefined;

  /**
   * The angle of emission of the light source in degrees
   * @defaultValue `360`
   */
  angle?: number | null | undefined;

  /**
   * An optional color string which applies coloration to the resulting light source
   */
  tintColor?: string | null | undefined;

  /**
   * The intensity of coloration applied to this light source, a number between 0 and 1
   * @defaultValue `0.25`
   */
  tintAlpha?: number | null | undefined;

  /**
   * A data object which configures token light animation settings, if one is applied
   * @defaultValue `{}`
   */
  lightAnimation?: AnimationDataConstructorData | null | undefined;

  /**
   * A value of the Scene darkness level, above which this light source will be active
   * @defaultValue `0`
   */
  darknessThreshold?: number | null | undefined;

  /**
   * @defaultValue `{}`
   */
  darkness?: DarknessActivationConstructorData | null | undefined;

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
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientLightData extends AmbientLightDataProperties {}
