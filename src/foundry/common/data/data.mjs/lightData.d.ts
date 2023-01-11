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
  /** An opacity for the emitted light, if any */
  alpha: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Alpha" }>;

  /** The angle of emission for this point source */
  angle: fields.AngleField<{ initial: 360; base: 360; label: "LIGHT.Angle" }>;

  /** The allowed radius of bright vision or illumination */
  bright: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Bright" }>;

  /** A tint color for the emitted light, if any */
  color: fields.ColorField<{ label: "LIGHT.Color" }>;

  /** The coloration technique applied in the shader */
  coloration: fields.NumberField<{
    required: true;
    integer: true;
    initial: 1;
    label: "LIGHT.ColorationTechnique";
    hint: "LIGHT.ColorationTechniqueHint";
  }>;

  /** The allowed radius of dim vision or illumination */
  dim: fields.NumberField<{ required: true; initial: 0; min: 0; step: 0.01; label: "LIGHT.Dim" }>;

  /** Fade the difference between bright, dim, and dark gradually? */
  attenuation: fields.AlphaField<{ initial: 0.5; label: "LIGHT.Attenuation"; hint: "LIGHT.AttenuationHint" }>;

  /** The luminosity applied in the shader */
  luminosity: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0.5;
    min: -1;
    max: 1;
    label: "LIGHT.Luminosity";
    hint: "LIGHT.LuminosityHint";
  }>;

  /** The amount of color saturation this light applies to the background texture */
  saturation: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: -1;
    max: 1;
    label: "LIGHT.Saturation";
    hint: "LIGHT.SaturationHint";
  }>;

  /** The amount of contrast this light applies to the background texture */
  contrast: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: -1;
    max: 1;
    label: "LIGHT.Contrast";
    hint: "LIGHT.ContrastHint";
  }>;

  /** The depth of shadows this light applies to the background texture */
  shadows: fields.NumberField<{
    required: true;
    nullable: false;
    initial: 0;
    min: 0;
    max: 1;
    label: "LIGHT.Shadows";
    hint: "LIGHT.ShadowsHint";
  }>;

  /** An animation configuration for the source */
  animation: fields.SchemaField<{
    /**
     * The animation type which is applied
     * @defaultValue `null`
     */
    type: fields.StringField<{ nullable: true; blank: false; initial: null; label: "LIGHT.AnimationType" }>;

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

type LightDataConstructorData = fields.SchemaField.AssignmentType<LightDataSchema>;
type LightDataProperties = fields.SchemaField.InitializedType<LightDataSchema>;
type LightDataSource = fields.SchemaField.PersistedType<LightDataSchema>;

type A = LightDataConstructorData["animation"];
type a = LightDataConstructorData["darkness"];
type B = LightDataProperties["animation"];
type b = LightDataProperties["darkness"];
type C = LightDataSource["animation"];
type c = LightDataSource["darkness"];

type I = LightDataSchema["animation"]["initial"];
type i = LightDataSchema["darkness"]["initial"];

const foo: LightData;
type one = typeof foo.alpha;
type two = typeof foo.coloration;
type three = typeof foo.animation;
type four = typeof foo.animation.reverse;
type five = typeof foo.darkness;

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
