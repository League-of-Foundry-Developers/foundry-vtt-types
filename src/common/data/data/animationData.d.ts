import { DocumentData } from '../../abstract/module';
import { BaseAmbientLight } from '../../documents';
import * as fields from '../fields';

interface AnimationDataSchema extends DocumentSchema {
  type: typeof fields.STRING_FIELD;
  speed: DocumentField<number> & {
    type: typeof Number;
    required: false;
    default: 5;
    validate: (a: number) => boolean;
    validationError: 'Light animation speed must be an integer between 1 and 10';
  };
  intensity: DocumentField<number> & {
    type: typeof Number;
    required: false;
    default: 5;
    validate: (a: number) => boolean;
    validationError: 'Light animation intensity must be an integer between 1 and 10';
  };
}

interface AnimationDataProperties {
  /**
   * The animation type which is applied
   */
  type?: string;

  /**
   * The speed of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  speed: number;

  /**
   * The intensity of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  intensity: number;
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
