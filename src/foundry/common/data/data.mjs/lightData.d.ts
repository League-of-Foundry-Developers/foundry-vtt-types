import type { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DataModel, DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import type { AnimationData, AnimationDataConstructorData } from "./animationData";
import type { DarknessActivation, DarknessActivationConstructorData } from "./darknessActivation";

declare global {
  interface LightAnimationData {
    /**
     * The animation type which is applied
     * @defaultValue `null`
     */
    type: string | null;

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
}

interface LightDataSchema extends DataSchema {
  alpha: fields.AlphaField;
  angle: fields.AngleField;
  bright: fields.NumberField<number | null, number>;
  color: fields.ColorField;
  coloration: fields.NumberField<number | null, number>;
  dim: fields.NumberField<number | null, number>;
  attenuation: fields.AlphaField;
  luminosity: fields.NumberField<number>;
  saturation: fields.NumberField<number>;
  contrast: fields.NumberField<number>;
  shadows: fields.NumberField<number>;
  animation: fields.SchemaField<
    {
      type: fields.StringField<string | null | undefined, string | null>;
      speed: fields.NumberField<number | null, number>;
      intensity: fields.NumberField<number | null, number>;
      reverse: fields.BooleanField;
    },
    LightAnimationData
  >;
  darkness: fields.SchemaField<
    {
      min: fields.AlphaField;
      max: fields.AlphaField;
    },
    { min: number; max: number }
  >;
}

interface LightDataProperties {
  /**
   * An opacity for the emitted light, if any
   * @defaultValue `0.5`
   */
  alpha: number;

  /**
   * The angle of emission for this point source
   * @defaultValue `360`
   */
  angle: number;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `0`
   */
  bright: number;

  /** A tint color for the emitted light, if any */
  color: string | null | undefined;

  /**
   * The coloration technique applied in the shader
   * @defaultValue `1`
   */
  coloration: number;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `0`
   */
  dim: number;

  /**
   * Fade the difference between bright, dim, and dark gradually?
   * @defaultValue `0.5`
   */
  attenuation: number;

  /**
   * The luminosity applied in the shader
   * @defaultValue `0.5`
   */
  luminosity: number;

  /**
   * The amount of color saturation this light applies to the background texture
   * @defaultValue `0`
   */
  saturation: number;

  /**
   * The amount of contrast this light applies to the background texture
   * @defaultValue `0`
   */
  contrast: number;

  /**
   * The depth of shadows this light applies to the background texture
   * @defaultValue `0`
   */
  shadows: number;

  /**
   * An animation configuration for the source
   */
  animation: LightAnimationData;

  /**
   * A darkness range (min and max) for which the source should be active
   * @defaultValue `{ min: 0; max: 1 }`
   */
  darkness: { min: number; max: number };
}

interface LightDataConstructorData {
  /**
   * An opacity for the emitted light, if any
   * @defaultValue `0.5`
   */
  alpha?: number | null | undefined;

  /**
   * The angle of emission for this point source
   * @defaultValue `360`
   */
  angle?: number | null | undefined;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `0`
   */
  bright?: number | null | undefined;

  /** A tint color for the emitted light, if any */
  color?: string | null | undefined;

  /**
   * The coloration technique applied in the shader
   * @defaultValue `1`
   */
  coloration?: number | null | undefined;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `0`
   */
  dim?: number | null | undefined;

  /**
   * Fade the difference between bright, dim, and dark gradually?
   * @defaultValue `true`
   */
  gradual?: boolean | null | undefined;

  /**
   * The luminosity applied in the shader
   * @defaultValue `0.5`
   */
  luminosity?: number | null | undefined;

  /**
   * The amount of color saturation this light applies to the background texture
   * @defaultValue `0`
   */
  saturation?: number | null | undefined;

  /**
   * The amount of contrast this light applies to the background texture
   * @defaultValue `0`
   */
  contrast?: number | null | undefined;

  /**
   * The depth of shadows this light applies to the background texture
   * @defaultValue `0`
   */
  shadows?: number | null | undefined;

  /**
   * An animation configuration for the source
   * @defaultValue `new AnimationData({})`
   */
  animation?: AnimationDataConstructorData | null | undefined;

  /**
   * A darkness range (min and max) for which the source should be active
   * @defaultValue `new DarknessActivation({})`
   */
  darkness?: DarknessActivationConstructorData | null | undefined;
}

type LightDataSource = PropertiesToSource<LightDataProperties>;

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
export class LightData extends DataModel<
  fields.SchemaField<LightDataSchema>,
  LightDataSource,
  LightDataConstructorData,
  documents.BaseAmbientLight | documents.BaseToken
> {
  static override defineSchema(): LightDataSchema;

  static override migrateData(source: object): object;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LightData extends LightDataProperties {}
