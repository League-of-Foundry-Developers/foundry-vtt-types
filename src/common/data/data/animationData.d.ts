import { DocumentData } from '../../abstract/module';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';

interface SpeedField extends DocumentField<number> {
  default: 5;
  required: false;
  type: typeof Number;
  validate: (a: number) => boolean;
  validationError: 'Light animation speed must be an integer between 1 and 10';
}

interface IntensityField extends DocumentField<number> {
  default: 5;
  required: false;
  type: typeof Number;
  validate: (a: number) => boolean;
  validationError: 'Light animation intensity must be an integer between 1 and 10';
}

interface AnimationDataSchema extends DocumentSchema {
  intensity: IntensityField;
  speed: SpeedField;
  type: typeof fields.STRING_FIELD;
}

interface AnimationDataProperties {
  /**
   * The intensity of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  intensity: number;

  /**
   * The speed of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  speed: number;

  /**
   * The animation type which is applied
   */
  type?: string;
}

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class AnimationData extends DocumentData<
  AnimationDataSchema,
  AnimationDataProperties,
  BaseAmbientLight
> {
  static defineSchema(): AnimationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AnimationData extends AnimationDataProperties {}
