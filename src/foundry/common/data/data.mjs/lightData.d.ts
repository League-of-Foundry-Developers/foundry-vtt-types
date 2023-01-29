import { DataModel } from "../../abstract/module.mjs";
import * as documents from "../../documents.mjs";
import * as fields from "../fields.mjs";

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
  /**
   * An opacity for the emitted light, if any
   * @defaultValue `0.5`
   */
  alpha: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Alpha" }>;

  /**
   * The angle of emission for this point source
   * @defaultValue `360`
   */
  angle: fields.AngleField<{ initial: 360; base: 360; label: "LIGHT.Angle" }>;

  /**
   * The allowed radius of bright vision or illumination
   * @defaultValue `0`
   */
  bright: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Bright" }>;

  /** A tint color for the emitted light, if any */
  color: fields.ColorField<{ label: "LIGHT.Color" }>;

  /**
   * The coloration technique applied in the shader
   * @defaultValue `1`
   */
  coloration: fields.NumberField<{
    required: true;
    integer: true;
    initial: 1;
    label: "LIGHT.ColorationTechnique";
    hint: "LIGHT.ColorationTechniqueHint";
  }>;

  /**
   * The allowed radius of dim vision or illumination
   * @defaultValue `0`
   */
  dim: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Dim" }>;

  /**
   * Fade the difference between bright, dim, and dark gradually?
   * @defaultValue `0.5`
   */
  attenuation: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Attenuation"; hint: "LIGHT.AttenuationHint" }>;

  /**
   * The luminosity applied in the shader
   * @defaultValue `0.5`
   */
  luminosity: fields.NumberField<
    {
      required: true;
      nullable: false;
      initial: 0.5;
      min: -1;
      max: 1;
      label: "LIGHT.Luminosity";
      hint: "LIGHT.LuminosityHint";
    },
    fields.NumberField.DefaultAssignmentType,
    Exclude<fields.NumberField.DefaultInitializedType, null>,
    Exclude<fields.NumberField.DefaultPersistedType, null>
  >;

  /**
   * The amount of color saturation this light applies to the background texture
   * @defaultValue `0`
   */
  saturation: fields.NumberField<
    {
      required: true;
      nullable: false;
      initial: 0;
      min: -1;
      max: 1;
      label: "LIGHT.Saturation";
      hint: "LIGHT.SaturationHint";
    },
    fields.NumberField.DefaultAssignmentType,
    Exclude<fields.NumberField.DefaultInitializedType, null>,
    Exclude<fields.NumberField.DefaultPersistedType, null>
  >;

  /**
   * The amount of contrast this light applies to the background texture
   * @defaultValue `0`
   */
  contrast: fields.NumberField<
    {
      required: true;
      nullable: false;
      initial: 0;
      min: -1;
      max: 1;
      label: "LIGHT.Contrast";
      hint: "LIGHT.ContrastHint";
    },
    fields.NumberField.DefaultAssignmentType,
    Exclude<fields.NumberField.DefaultInitializedType, null>,
    Exclude<fields.NumberField.DefaultPersistedType, null>
  >;

  /**
   * The depth of shadows this light applies to the background texture
   * @defaultValue `0`
   */
  shadows: fields.NumberField<
    {
      required: true;
      nullable: false;
      initial: 0;
      min: 0;
      max: 1;
      label: "LIGHT.Shadows";
      hint: "LIGHT.ShadowsHint";
    },
    fields.NumberField.DefaultAssignmentType,
    Exclude<fields.NumberField.DefaultInitializedType, null>,
    Exclude<fields.NumberField.DefaultPersistedType, null>
  >;

  /** An animation configuration for the source */
  animation: fields.SchemaField<{
    /**
     * The animation type which is applied
     * @defaultValue `null`
     */
    type: fields.StringField<
      { nullable: true; blank: false; initial: null; label: "LIGHT.AnimationType" },
      fields.StringField.DefaultAssignmentType,
      fields.StringField.DefaultInitializedType | null,
      fields.StringField.DefaultPersistedType | null
    >;

    /**
     * The speed of the animation, a number between 0 and 10
     * @defaultValue `5`
     */
    speed: fields.NumberField<{
      required: true;
      integer: true;
      initial: 5;
      min: 0;
      max: 10;
      label: "LIGHT.AnimationSpeed";
      validationError: "Light animation speed must be an integer between 0 and 10";
    }>;

    /**
     * The intensity of the animation, a number between 1 and 10
     * @defaultValue `5`
     */
    intensity: fields.NumberField<{
      required: true;
      integer: true;
      initial: 5;
      min: 0;
      max: 10;
      label: "LIGHT.AnimationIntensity";
      validationError: "Light animation intensity must be an integer between 1 and 10";
    }>;

    /**
     * Reverse the direction of animation.
     * @defaultValue `false`
     */
    reverse: fields.BooleanField<{ label: "LIGHT.AnimationReverse" }>;
  }>;

  /** A darkness range (min and max) for which the source should be active */
  darkness: fields.SchemaField<
    {
      min: fields.AlphaField<{ initial: 0 }>;
      max: fields.AlphaField<{ initial: 1 }>;
    },
    {
      label: "LIGHT.DarknessRange";
      hint: "LIGHT.DarknessRangeHint";
      validate: (d: { min?: number | null | undefined; max?: number | null | undefined }) => boolean;
      validationError: "darkness.max may not be less than darkness.min";
    }
  >;
}

/**
 * A reusable document structure for the internal data used to render the appearance of a light source.
 * This is re-used by both the AmbientLightData and TokenData classes.
 */
export class LightData extends DataModel<
  fields.SchemaField<LightDataSchema>,
  fields.SchemaField.PersistedType<LightDataSchema>,
  fields.SchemaField.AssignmentType<LightDataSchema>,
  documents.BaseAmbientLight | documents.BaseToken
> {
  static override defineSchema(): LightDataSchema;

  static override migrateData(source: object): object;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LightData extends fields.SchemaField.InitializedType<LightDataSchema> {}
