import type { Identity, AnyMutableObject } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A VFX component that creates and manages a {@linkcode foundry.canvas.animation.ParticleGenerator}.
 * Handles the full lifecycle: loading textures, constructing the generator config, starting and
 * stopping the generator in sync with the VFX timeline.
 *
 * The generator always runs with `manual: false` so particles are spawned automatically. Provide
 * a `duration` to limit how long the generator emits; after that time it soft-stops and lets any
 * in-flight particles expire naturally. If no `duration` is given the generator runs indefinitely
 * until the component is stopped externally.
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
 *       velocity: {speed: 4, angle: 0},
 *       config: {
 *         constraints: {mode: "none"},
 *         drift: {enabled: true, intensity: 0.4}
 *       }
 *     }
 *   },
 *   timeline: [{component: "sparks"}]
 * };
 * const effect = new foundry.canvas.vfx.VFXEffect(vfxConfig);
 * const target = game.user.targets.first();
 * effect.play({target: target.center});
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

  /* DataModel overrides */

  static override _schema: fields.DataModelSchemaField<typeof VFXParticleGeneratorComponent>;

  static override get schema(): fields.DataModelSchemaField<typeof VFXParticleGeneratorComponent>;

  static override validateJoint(data: VFXParticleGeneratorComponent.SourceData): void;

  static override fromSource(
    source: VFXParticleGeneratorComponent.CreateData,
    context?: DataModel.FromSourceOptions,
  ): VFXParticleGeneratorComponent;

  static override fromJSON(json: string): VFXParticleGeneratorComponent;

  #VFXParticleGeneratorComponent: true;
}

declare namespace VFXParticleGeneratorComponent {
  interface Any extends AnyVFXParticleGeneratorComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXParticleGeneratorComponent> {}

  interface AlphaSchema extends DataSchema {
    max: fields.AlphaField;

    min: fields.AlphaField;
  }

  interface FadeSchema extends DataSchema {
    in: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    out: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
  }

  interface LifetimeSchema extends DataSchema {
    max: fields.NumberField<{ initial: null; positive: true }>;

    min: fields.NumberField<{ required: true; nullable: false; initial: 1000; positive: true }>;
  }

  interface RotationSchema extends DataSchema {
    alignVelocity: fields.BooleanField;

    initial: fields.NumberField<{ nullable: false; initial: 0 }>;

    spread: fields.NumberField<{ nullable: false; initial: typeof Math.PI }>;

    speed: fields.NumberField<{ nullable: false; initial: 0 }>;
  }

  interface ScaleSchema extends DataSchema {
    max: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;

    min: fields.NumberField<{ required: true; nullable: false; initial: 1; positive: true }>;
  }

  interface VelocitySchema extends DataSchema {
    angle: fields.NumberField<{ nullable: false }>;

    speed: fields.NumberField<{ nullable: false }>;

    x: fields.NumberField<{ nullable: false }>;

    y: fields.NumberField<{ nullable: false }>;
  }

  interface Schema extends VFXComponent._Schema<"particleGenerator"> {
    /** Alpha range [min, max] (default 1) */
    alpha: fields.SchemaField<AlphaSchema>;

    /**
     * Spawn area; a point, rect, circle, ring, or line object.
     * Supports reference resolution (e.g. \{reference: "target"\}).
     */
    area: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.ObjectField<{ required: false; nullable: true; initial: null }>
    >;

    /** PIXI blend mode (default NORMAL = 0) */
    blend: fields.NumberField<{ nullable: false; initial: 0 }>;

    /** Target particle count (default 50) */
    count: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: true; initial: null; positive: true }>
    >;

    /**
     * How long the generator runs in ms before soft-stopping
     * to let existing particles expire. If absent, runs until
     * the component is explicitly stopped.
     */
    duration: fields.NumberField<{ nullable: false }>;

    /** Layer elevation for the particle container (default 0) */
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /** Fade-in and fade-out durations in ms (default null) */
    fade: fields.SchemaField<FadeSchema, { required: false; nullable: true; initial: null }>;

    /**
     * Proportion of count to spawn immediately on start [0, 1] (default 0.25)
     */
    initial: fields.NumberField<{ required: true; nullable: false; initial: 0.25; min: 0; max: 1 }>;

    /**
     * Particle lifetime in ms. If max is null, min is used as a
     * fixed value. Otherwise, spawns with a random lifetime in
     * [min, max] (default min 1000).
     */
    lifetime: fields.SchemaField<LifetimeSchema>;

    /** Generator mode: "ambient" or "effect" (default "effect") */
    mode: fields.StringField<{ required: true; blank: false; initial: "effect"; choices: ["ambient", "effect"] }>;

    /**
     * Additional ParticleGenerator configuration passed directly to the constructor. Can include orbit, follow,
     * constraints, drift, blur, clip, anchor, callbacks, and any other
     * {@linkcode foundry.canvas.animation.ParticleGenerator.Configuration} fields.
     * When effects are built directly in code, this can also include a custom batchable `shaderClass` that is
     * compatible with SpriteMesh and whose plugin was already registered.
     * Values here override any explicitly-set schema fields of the same name.
     */
    config: fields.ObjectField<{ required: false }>;

    /**
     * Maximum particles spawned per second during auto-spawn
     * (default 300)
     */
    spawnRate: fields.NumberField<{ required: true; nullable: false; initial: 300; positive: true }>;

    /** Rotation configuration for particles. */
    rotation: fields.SchemaField<RotationSchema, { required: false }>;

    /** Scale range [min, max] (default 1) */
    scale: fields.SchemaField<ScaleSchema>;

    /** Sort order within the elevation layer (default 0) */
    sort: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    /** Texture paths for particles */
    textures: fields.ArrayField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * Initial particle velocity. Specify either x/y components
     * or speed (px/s) and angle (degrees). (default null)
     */
    velocity: fields.SchemaField<VelocitySchema, { required: false; nullable: true; initial: null }>;

    /**
     * An optional mask for clipping particles to wall boundaries. Accepts either a pre-computed PointSourcePolygon
     * (shared via VFXReferenceField resolution) or a serializable config object \{x, y, type, radius\} from which a
     * polygon is computed at draw time. Supports reference resolution for efficient reuse across multiple components
     * within the same effect.
     */
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
