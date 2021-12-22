import type { FieldReturnType, PropertiesToSource } from '../../../../types/helperTypes.js';
import { DocumentData } from '../../abstract/module.mjs';
import * as documents from '../../documents.mjs';
import * as fields from '../fields.mjs';
import type { AnimationData, AnimationDataConstructorData } from './animationData.js';
import type { DarknessActivation, DarknessActivationConstructorData } from './darknessActivation.js';

interface LightDataSchema extends DocumentSchema {
  alpha: FieldReturnType<typeof fields.ALPHA_FIELD, { default: 0.5 }>;
  angle: typeof fields.ANGLE_FIELD;
  bright: typeof fields.NONNEGATIVE_NUMBER_FIELD;
  color: typeof fields.COLOR_FIELD;
  coloration: FieldReturnType<typeof fields.NONNEGATIVE_INTEGER_FIELD, { default: 1 }>;
  dim: typeof fields.NONNEGATIVE_NUMBER_FIELD;
  gradual: FieldReturnType<typeof fields.BOOLEAN_FIELD, { default: true }>;
  luminosity: FieldReturnType<typeof LightData.LIGHT_UNIFORM_FIELD, { default: 0.5 }>;
  saturation: typeof LightData.LIGHT_UNIFORM_FIELD;
  contrast: typeof LightData.LIGHT_UNIFORM_FIELD;
  shadows: typeof LightData.LIGHT_UNIFORM_FIELD;
  animation: DocumentField<AnimationData> & {
    type: typeof AnimationData;
    required: true;
    default: {};
  };
  darkness: DocumentField<DarknessActivation> & {
    type: typeof DarknessActivation;
    required: true;
    default: {};
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
  color: string | undefined | null;

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
  constrast: number;

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
  alpha?: number | undefined | null;

  /**
   * The angle of emission for this point source
   * @defaultValue `360`
   */
  angle?: number | undefined | null;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `0`
   */
  bright?: number | undefined | null;

  /** A tint color for the emitted light, if any */
  color?: string | undefined | null;

  /**
   * The coloration technique applied in the shader
   * @defaultValue `1`
   */
  coloration?: number | undefined | null;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `0`
   */
  dim?: number | undefined | null;

  /**
   * Fade the difference between bright, dim, and dark gradually?
   * @defaultValue `true`
   */
  gradual?: boolean | undefined | null;

  /**
   * The luminosity applied in the shader
   * @defaultValue `0.5`
   */
  luminosity?: number | undefined | null;

  /**
   * The amount of color saturation this light applies to the background texture
   * @defaultValue `0`
   */
  saturation?: number | undefined | null;

  /**
   * The amount of contrast this light applies to the background texture
   * @defaultValue `0`
   */
  constrast?: number | undefined | null;

  /**
   * The depth of shadows this light applies to the background texture
   * @defaultValue `0`
   */
  shadows?: number | undefined | null;

  /**
   * An animation configuration for the source
   * @defaultValue `new AnimationData({})`
   */
  animation?: AnimationDataConstructorData | undefined | null;

  /**
   * A darkness range (min and max) for which the source should be active
   * @defaultValue `new DarknessActivation({})`
   */
  darkness?: DarknessActivationConstructorData | undefined | null;
}

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
export declare class LightData extends DocumentData<
  LightDataSchema,
  LightDataProperties,
  PropertiesToSource<LightDataProperties>,
  LightDataConstructorData,
  documents.BaseAmbientLight | documents.BaseToken
> {
  static defineSchema(): LightDataSchema;

  /**
   * A reusable field definition for uniform fields used by LightData
   * @remarks
   * Property type: `number`
   * Constructor type: `number | undefined | null`
   * Default: `0`
   */
  static LIGHT_UNIFORM_FIELD: {
    type: typeof Number;
    required: true;
    default: 0;
    validate: (n: number) => boolean;
    validationError: '{name} {field} "{value}" is not a number between -1 and 1';
  };

  _initializeSource(data: LightDataConstructorData): PropertiesToSource<LightDataProperties>;

  _initialize(): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LightData extends LightDataProperties {}
