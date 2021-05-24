import { FieldReturnType } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as CONST from '../../constants';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';
import { AnimationData } from './animationData';
import { DarknessActivation } from './darknessActivation';

interface SourceTypeField extends DocumentField<CONST.SourceType> {
  type: String;
  required: true;
  default: 'l';
  validate: (t: unknown) => boolean;
  validationError: 'Invalid {name} {field} which must be a value in CONST.SOURCE_TYPES';
}

interface DarknessActivationField extends DocumentField<DarknessActivation> {
  type: typeof DarknessActivation;
  required: true;
  default: {};
}

interface LightAnimationField extends DocumentField<AnimationData> {
  type: typeof AnimationData;
  required: true;
  default: {};
}

interface AmbientLightDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  t: SourceTypeField;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  dim: typeof fields.REQUIRED_NUMBER;
  bright: typeof fields.REQUIRED_NUMBER;
  angle: typeof fields.ANGLE_FIELD;
  tintColor: typeof fields.COLOR_FIELD;
  tintAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.25 }>;
  lightAnimation: LightAnimationField;
  darknessThreshold: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  darkness: DarknessActivationField;
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
  t: CONST.SourceType;

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
  tintColor?: string;

  /**
   * The intensity of coloration applied to this light source, a number between 0 and 1
   * @defaultValue `0.25`
   */
  tintAlpha: number;

  /**
   * A data object which configures token light animation settings, if one is applied
   * @defaultValue `new AnimationData({})`
   */
  lightAnimation: AnimationData;

  /**
   * A value of the Scene darkness level, above which this light source will be active
   * @defaultValue `0`
   */
  darknessThreshold: number;

  /**
   * @defaultValue `new DarknessActivation({})`
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
  flags: Record<string, unknown>;
}

/**
 * The data schema for a AmbientLight embedded document.
 * @see BaseAmbientLight
 */
export declare class AmbientLightData extends DocumentData<
  AmbientLightDataSchema,
  AmbientLightDataProperties,
  BaseAmbientLight
> {
  static defineSchema(): AmbientLightDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientLightData extends AmbientLightDataProperties {}
