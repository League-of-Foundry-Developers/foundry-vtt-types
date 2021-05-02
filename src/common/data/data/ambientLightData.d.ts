import { DocumentSchemaToData, FieldReturnType } from '../../abstract/helperTypes';
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
  // default: {}; // TODO: This is actually `{}` which is not a valid `DarknessActivation`, bug?
}

interface LightAnimationField extends DocumentField<AnimationData> {
  type: typeof AnimationData;
  required: true;
  // default: {}; // TODO: This is actually `{}` which is not a valid `AnimationData`, bug?
}

interface AmbientLightDataSchema extends DocumentSchema {
  /**
   * The _id which uniquely identifies this BaseAmbientLight embedded document
   */
  _id: typeof fields.DOCUMENT_ID;

  /**
   * The source type in CONST.SOURCE_TYPES which defines the behavior of this light
   */
  t: SourceTypeField;

  /**
   * The x-coordinate position of the origin of the light
   */
  x: typeof fields.REQUIRED_NUMBER;

  /**
   * The y-coordinate position of the origin of the light
   */
  y: typeof fields.REQUIRED_NUMBER;

  /**
   * The angle of rotation for the tile between 0 and 360
   */
  rotation: FieldReturnType<typeof fields.ANGLE_FIELD, { default: 0 }>;

  /**
   * The radius of dim light emitted in distance units, negative values produce darkness
   */
  dim: typeof fields.REQUIRED_NUMBER;

  /**
   * The radius of bright light emitted in distance units, negative values produce blackness
   */
  bright: typeof fields.REQUIRED_NUMBER;

  /**
   * The angle of emission of the light source in degrees
   */
  angle: typeof fields.ANGLE_FIELD;

  /**
   * An optional color string which applies coloration to the resulting light source
   */
  tintColor: typeof fields.COLOR_FIELD;

  /**
   * The intensity of coloration applied to this light source, a number between 0 and 1
   */
  tintAlpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.25 }>;

  /**
   * A data object which configures token light animation settings, if one is applied
   */
  lightAnimation: LightAnimationField;

  /**
   * A value of the Scene darkness level, above which this light source will be active
   */
  darknessThreshold: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0 }>;

  darkness: DarknessActivationField;

  /**
   * Is the light source currently hidden?
   */
  hidden: typeof fields.BOOLEAN_FIELD;

  /**
   * An object of optional key/value flags
   */
  flags: typeof fields.OBJECT_FIELD;
}

/**
 * The data schema for a AmbientLight embedded document.
 * @see BaseAmbientLight
 */
export declare class AmbientLightData extends DocumentData<AmbientLightDataSchema, BaseAmbientLight> {
  static defineSchema(): AmbientLightDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AmbientLightData extends DocumentSchemaToData<AmbientLightDataSchema> {}
