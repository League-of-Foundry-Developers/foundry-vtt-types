import type { Identity, AnyMutableObject } from "#utils";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A VFX component that creates and manages a ParticleGenerator.
 * Handles the full lifecycle: loading textures, constructing the generator config, starting and
 * stopping the generator in sync with the VFX timeline.
 *
 * @example A burst of sparks at an impact point
 * ```js
 * const vfxConfig = {
 *   name: "sparkBurst",
 *   components: {
 *     sparks: {
 *       type: "particleGenerator",
 *       textures: ["assets/particles/spark.png"],
 *       area: {reference: "target"},
 *       count: 40,
 *       spawnRate: 90,
 *       duration: 1200,
 *       lifetime: {min: 300, max: 700},
 *       fade: {in: 50, out: 200},
 *       scale: {min: 0.2, max: 0.6},
 *       velocity: {speed: 4, angle: 0}
 *     }
 *   },
 *   timeline: [{component: "sparks"}]
 * };
 * ```
 */
declare class VFXParticleGeneratorComponent<
  Schema extends VFXComponent.Schema.Any = VFXParticleGeneratorComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "particleGenerator";

  static override defineSchema(): VFXParticleGeneratorComponent.Schema;

  static override migrateData(source: AnyMutableObject): AnyMutableObject;

  protected override _load(): Promise<void>;

  protected override _draw(): Promise<void>;

  override stop(): Promise<void>;

  protected override _stop(): Promise<void>;

  #VFXParticleGeneratorComponent: true;
}

declare namespace VFXParticleGeneratorComponent {
  interface Any extends AnyVFXParticleGeneratorComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXParticleGeneratorComponent> {}

  interface Schema extends VFXComponent._Schema<"particleGenerator"> {
    alpha: fields.SchemaField<{
      max: fields.AlphaField;
      min: fields.AlphaField;
    }>;
    /** Spawn area (point, rect, circle, ring, or line). May be a reference. */
    area: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.ObjectField<{ required: false; nullable: true; initial: null }>
    >;
    blend: fields.NumberField<{ nullable: false; initial: 0 }>;
    /** Target particle count. May be a reference. */
    count: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>
    >;
    /** How long the generator runs in ms before soft-stopping. */
    duration: fields.NumberField<{ nullable: false }>;
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    fade: fields.SchemaField<
      {
        in: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
        out: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
      },
      { required: false; nullable: true; initial: null }
    >;
    /** Proportion of count to spawn immediately on start [0, 1] (default 0.25). */
    initial: fields.NumberField<{ required: true; nullable: false; initial: 0.25; min: 0; max: 1 }>;
    lifetime: fields.SchemaField<{
      max: fields.NumberField<{ initial: null; positive: true }>;
      min: fields.NumberField<{ required: true; nullable: false; initial: 1000; positive: true }>;
    }>;
    /** Generator mode: "ambient" or "effect" (default "effect"). */
    mode: fields.StringField<{ required: true; blank: false; initial: "effect"; choices: ["ambient", "effect"] }>;
    /** Additional ParticleGenerator configuration. */
    config: fields.ObjectField<{ required: false }>;
    /** Maximum particles spawned per second (default 300). */
    spawnRate: fields.NumberField<{ required: true; nullable: false; initial: 300; positive: true }>;
    rotation: fields.SchemaField<
      {
        alignVelocity: fields.BooleanField;
        initial: fields.NumberField<{ nullable: false; initial: 0 }>;
        spread: fields.NumberField<{ nullable: false; initial: typeof Math.PI }>;
        speed: fields.NumberField<{ nullable: false; initial: 0 }>;
      },
      { required: false }
    >;
    scale: fields.SchemaField<{
      max: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;
      min: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;
    }>;
    sort: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    textures: fields.ArrayField<fields.StringField<{ required: true; blank: false }>>;
    velocity: fields.SchemaField<
      {
        angle: fields.NumberField<{ nullable: false }>;
        speed: fields.NumberField<{ nullable: false }>;
        x: fields.NumberField<{ nullable: false }>;
        y: fields.NumberField<{ nullable: false }>;
      },
      { required: false; nullable: true; initial: null }
    >;
    /** Optional PointSourcePolygon mask for clipping particles. */
    pointSourceMask: foundry.canvas.vfx.fields.VFXPointSourcePolygonField;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXParticleGeneratorComponent;

declare abstract class AnyVFXParticleGeneratorComponent extends VFXParticleGeneratorComponent {
  constructor(...args: never);
}
