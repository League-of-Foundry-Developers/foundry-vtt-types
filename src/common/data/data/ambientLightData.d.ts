import { FieldReturnType, PropertiesToSource } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import * as CONST from '../../constants';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';
import { AnimationData } from './animationData';
import { DarknessActivation } from './darknessActivation';

interface SourceTypeField extends DocumentField<CONST.SourceType> {
  default: 'l';
  required: true;
  type: String;
  validate: (t: unknown) => boolean;
  validationError: 'Invalid {name} {field} which must be a value in CONST.SOURCE_TYPES';
}

interface DarknessActivationField extends DocumentField<DarknessActivation> {
  default: {};
  required: true;
  type: typeof DarknessActivation;
}

interface LightAnimationField extends DocumentField<AnimationData> {
  default: {};
  required: true;
  type: typeof AnimationData;
}

interface AmbientLightDataSchema extends DocumentSchema {
  _id: typeof fields.DOCUMENT_ID;
  angle: typeof fields.ANGLE_FIELD;
  bright: typeof fields.REQUIRED_NUMBER;
  darkness: DarknessActivationField;
  darknessThreshold: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;
  dim: typeof fields.REQUIRED_NUMBER;
  flags: typeof fields.OBJECT_FIELD;
  hidden: typeof fields.BOOLEAN_FIELD;
  lightAnimation: LightAnimationField;
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;
  t: SourceTypeField;
  tintAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.25 }>;
  tintColor: typeof fields.COLOR_FIELD;
  x: typeof fields.REQUIRED_NUMBER;
  y: typeof fields.REQUIRED_NUMBER;
}

interface AmbientLightDataProperties {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id: string | null;

  /**
   * The angle of emission of the light source in degrees
   * @defaultValue `360`
   */
  angle: number;

  /**
   * The radius of bright light emitted in distance units, negative values produce blackness
   * @defaultValue `0`
   */
  bright: number;

  /**
   * @defaultValue `new DarknessActivation({})`
   */
  darkness: DarknessActivation;

  /**
   * A value of the Scene darkness level, above which this light source will be active
   * @defaultValue `0`
   */
  darknessThreshold: number;

  /**
   * The radius of dim light emitted in distance units, negative values produce darkness
   * @defaultValue `0`
   */
  dim: number;

  /**
   * An object of optional key/value flags
   * @defaultValue `{}`
   */
  flags: Record<string, unknown>;

  /**
   * Is the light source currently hidden?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * A data object which configures token light animation settings, if one is applied
   * @defaultValue `new AnimationData({})`
   */
  lightAnimation: AnimationData;

  /**
   * The angle of rotation for the tile between 0 and 360
   * @defaultValue `0`
   */
  rotation: number;

  /**
   * The source type in CONST.SOURCE_TYPES which defines the behavior of this light
   * @defaultValue `'l'`
   */
  t: CONST.SourceType;

  /**
   * The intensity of coloration applied to this light source, a number between 0 and 1
   * @defaultValue `0.25`
   */
  tintAlpha: number;

  /**
   * An optional color string which applies coloration to the resulting light source
   */
  tintColor?: string;

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
}

type AmbientLightDataSource = PropertiesToSource<AmbientLightDataProperties>;

/**
 * The data schema for a AmbientLight embedded document.
 * @see BaseAmbientLight
 */
export declare class AmbientLightData extends DocumentData<
  AmbientLightDataSchema,
  AmbientLightDataSource,
  BaseAmbientLight
> {
  static defineSchema(): AmbientLightDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientLightData extends AmbientLightDataProperties {}
