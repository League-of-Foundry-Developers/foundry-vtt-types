import type { Identity } from "#utils";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A component for playing positional sound effects synchronized with the VFX timeline.
 * Provides serializable data storage around the `Sound#playAtPosition` API.
 *
 * @example A thunderclap at a specific location
 * ```js
 * const vfxConfig = {
 *   name: "thunderclap",
 *   components: {
 *     thunder: {
 *       type: "positionalSound",
 *       src: "assets/sounds/thunder.ogg",
 *       x: 3200,
 *       y: 2400,
 *       radius: 120,
 *       volume: 0.8,
 *       channel: "environment"
 *     }
 *   },
 *   timeline: [{component: "thunder"}]
 * };
 * ```
 */
declare class VFXPositionalSoundComponent<
  Schema extends VFXComponent.Schema.Any = VFXPositionalSoundComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "positionalSound";

  static override defineSchema(): VFXPositionalSoundComponent.Schema;

  protected override _load(): Promise<void>;

  protected override _draw(): Promise<void>;

  protected override _stop(): Promise<void>;

  #VFXPositionalSoundComponent: true;
}

declare namespace VFXPositionalSoundComponent {
  interface Any extends AnyVFXPositionalSoundComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXPositionalSoundComponent> {}

  /**
   * Positional sound configuration shared between this component and other VFX components.
   */
  interface PositionalSoundData {
    /** Sound source path. */
    src: string;
    /** How sound playback aligns with animation, a value in SOUND_ALIGNMENT (default END). */
    align: number;
    /** Playback volume (default 1.0). */
    volume: number;
    /** Local sound radius in distance units (default 60). */
    radius: number;
    /** Whether to apply easing to local sound (default true). */
    easing: boolean;
    /** Whether sound should be constrained by walls (default true). */
    walls: boolean;
  }

  interface Schema extends VFXComponent._Schema<"positionalSound"> {
    /** Audio channel for playback (default "environment"). */
    channel: fields.StringField<{ required: true; blank: false; initial: "environment" }>;
    /** Component duration in ms; defaults to the sound's natural duration. */
    duration: fields.NumberField<{ nullable: false }>;
    /** Whether to apply easing to local sound (default true). */
    easing: fields.BooleanField<{ initial: true }>;
    /** The elevation of the sound origin (default 0). */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    /** Fade-in duration in ms (default 0). */
    fade: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    /** Whether the GM always hears the sound regardless of position (default true). */
    gmAlways: fields.BooleanField<{ required: false; initial: true }>;
    /** The angle of the sound cone in degrees. */
    angle: fields.AngleField;
    /** Audio effect applied when the sound is not muffled. */
    baseEffect: fields.SchemaField<
      {
        intensity: fields.NumberField<{ required: true; nullable: false; min: 1; max: 10 }>;
        type: fields.StringField<{ required: true; blank: false }>;
      },
      { required: false; nullable: true; initial: null }
    >;
    /** Audio effect applied when the sound is muffled. */
    muffledEffect: fields.SchemaField<
      {
        intensity: fields.NumberField<{ required: true; nullable: false; min: 1; max: 10 }>;
        type: fields.StringField<{ required: true; blank: false }>;
      },
      { required: false; nullable: true; initial: null }
    >;
    /** Local sound radius in distance units (default 60). */
    radius: fields.NumberField<{ required: true; nullable: false; initial: 60; positive: true }>;
    /** The direction of sound emission in degrees. */
    rotation: fields.AngleField;
    /** Sound source path. */
    src: fields.StringField<{ required: true; blank: false }>;
    /** Playback volume (default 1.0). */
    volume: fields.AlphaField;
    /** Whether sound should be constrained by walls (default true). */
    walls: fields.BooleanField<{ initial: true }>;
    x: fields.NumberField<{ required: true; nullable: false }>;
    y: fields.NumberField<{ required: true; nullable: false }>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXPositionalSoundComponent;

declare abstract class AnyVFXPositionalSoundComponent extends VFXPositionalSoundComponent {
  constructor(...args: never);
}
