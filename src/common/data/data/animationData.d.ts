import { DocumentSchemaToData } from '../../abstract/helperTypes';
import { DocumentData } from '../../abstract/module';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';

interface SpeedField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  default: 5;
  validate: (a: number) => boolean;
  validationError: 'Light animation speed must be an integer between 1 and 10';
}

interface IntensityField extends DocumentField<number> {
  type: typeof Number;
  required: false;
  default: 5;
  validate: (a: number) => boolean;
  validationError: 'Light animation intensity must be an integer between 1 and 10';
}

interface AnimationDataSchema extends DocumentSchema {
  /**
   * The animation type which is applied
   */
  type: typeof fields.STRING_FIELD;

  /**
   * The speed of the animation, a number between 1 and 10
   */
  speed: SpeedField;

  /**
   * The intensity of the animation, a number between 1 and 10
   */
  intensity: IntensityField;
}

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class AnimationData extends DocumentData<AnimationDataSchema, BaseAmbientLight> {
  static defineSchema(): AnimationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AnimationData extends DocumentSchemaToData<AnimationDataSchema> {}
