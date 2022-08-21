import type { FieldReturnType, PropertiesToSource } from "../../../../types/helperTypes";
import { DocumentData } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";
import type { AnimationData, AnimationDataConstructorData } from "./animationData";
import type { DarknessActivation, DarknessActivationConstructorData } from "./darknessActivation";

interface LightDataSchema extends DocumentSchema {
  alpha: FieldReturnType<fields.AlphaField, { default: 0.5 }>;
  angle: fields.AngleField;
  bright: fields.NonnegativeNumberField;
  color: fields.ColorField;
  coloration: FieldReturnType<fields.NonnegativeIntegerField, { default: 1 }>;
  dim: fields.NonnegativeNumberField;
  gradual: FieldReturnType<fields.BooleanField, { default: true }>;
  luminosity: FieldReturnType<LightData.LightUniformField, { default: 0.5 }>;
  saturation: LightData.LightUniformField;
  contrast: LightData.LightUniformField;
  shadows: LightData.LightUniformField;
  animation: DocumentField<AnimationData> & {
    type: typeof AnimationData;
    required: true;
    default: Record<string, never>;
  };
  darkness: DocumentField<DarknessActivation> & {
    type: typeof DarknessActivation;
    required: true;
    default: Record<string, never>;
  };
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
   * @defaultValue `true`
   */
  gradual: boolean;

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
   * @defaultValue `new AnimationData({})`
   */
  animation: AnimationData;

  /**
   * A darkness range (min and max) for which the source should be active
   * @defaultValue `new DarknessActivation({})`
   */
  darkness: DarknessActivation;
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
export class LightData extends DocumentData<
  LightDataSchema,
  LightDataProperties,
  LightDataSource,
  LightDataConstructorData,
  documents.BaseAmbientLight | documents.BaseToken
> {
  static override defineSchema(): LightDataSchema;

  /**
   * A reusable field definition for uniform fields used by LightData
   */
  static LIGHT_UNIFORM_FIELD: LightData.LightUniformField;

  override _initializeSource(data: LightDataConstructorData): LightDataSource;

  protected override _initialize(): void;
}

declare namespace LightData {
  /**
   * Property type: `number`
   * Constructor type: `number | null | undefined`
   * Default: `0`
   */
  interface LightUniformField {
    type: typeof Number;
    required: true;
    default: 0;
    validate: (n: number) => boolean;
    validationError: '{name} {field} "{value}" is not a number between -1 and 1';
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LightData extends LightDataProperties {}
