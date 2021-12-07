import { PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseAmbientLight } from '../../documents.mjs';
import * as fields from '../fields.mjs';

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
  type: string | undefined;

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

export interface AnimationDataConstructorData {
  /**
   * The animation type which is applied
   */
  type?: string | null | undefined;

  /**
   * The speed of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  speed?: number | null | undefined;

  /**
   * The intensity of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  intensity?: number | null | undefined;
}

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class AnimationData extends DocumentData<
  AnimationDataSchema,
  AnimationDataProperties,
  PropertiesToSource<AnimationDataProperties>,
  AnimationDataConstructorData,
  BaseAmbientLight
> {
  static defineSchema(): AnimationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface AnimationData extends AnimationDataProperties {}
