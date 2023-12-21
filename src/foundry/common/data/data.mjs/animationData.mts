import type { PropertiesToSource } from "../../../../types/helperTypes.d.ts";
import type { DocumentData } from "../../abstract/module.mts";
import type { BaseAmbientLight } from "../../documents.mjs/index.mts";
import type * as fields from "../fields.mts";

export interface AnimationDataSchema extends DocumentSchema {
  type: fields.StringField;
  speed: DocumentField<number> & {
    type: typeof Number;
    required: false;
    default: 5;
    validate: (a: number) => boolean;
    validationError: "Light animation speed must be an integer between 0 and 10";
  };
  intensity: DocumentField<number> & {
    type: typeof Number;
    required: false;
    default: 5;
    validate: (a: number) => boolean;
    validationError: "Light animation intensity must be an integer between 1 and 10";
  };
  reverse: fields.BooleanField;
}

export interface AnimationDataProperties {
  /**
   * The animation type which is applied
   */
  type: string | undefined;

  /**
   * The speed of the animation, a number between 0 and 10
   * @defaultValue `5`
   */
  speed: number;

  /**
   * The intensity of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  intensity: number;

  /**
   * Reverse the direction of animation.
   * @defaultValue `false`
   */
  reverse: boolean;
}

export interface AnimationDataConstructorData {
  /**
   * The animation type which is applied
   */
  type?: string | null | undefined;

  /**
   * The speed of the animation, a number between 0 and 10
   * @defaultValue `5`
   */
  speed?: number | null | undefined;

  /**
   * The intensity of the animation, a number between 1 and 10
   * @defaultValue `5`
   */
  intensity?: number | null | undefined;

  /**
   * Reverse the direction of animation.
   * @defaultValue `false`
   */
  reverse?: boolean | null | undefined;
}

export type AnimationDataSource = PropertiesToSource<AnimationDataProperties>;

/**
 * An embedded data object which defines the properties of a light source animation
 */
export declare class AnimationData extends DocumentData<
  AnimationDataSchema,
  AnimationDataProperties,
  AnimationDataSource,
  AnimationDataConstructorData,
  BaseAmbientLight
> {
  static override defineSchema(): AnimationDataSchema;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AnimationData extends AnimationDataProperties {}
