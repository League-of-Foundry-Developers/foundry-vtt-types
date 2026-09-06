import type { Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type VFXPath from "../vfx-path.d.mts";
import type VFXPositionalSoundComponent from "./vfx-positional-sound-component.d.mts";

import fields = foundry.data.fields;

/**
 * A base class VFX component used for single actor -\> target direct attacks.
 *
 * This provides a convenience layer that can include any or all of the following:
 * 1. Pre-attack charge-up sprite animation
 * 2. Pre-attack charge-up audio
 * 3. Attack projectile sprite
 * 4. Attack projectile audio
 * 5. Pre-impact audio
 * 6. Impact sprite animation
 * 7. Impact (or pre-impact) audio
 *
 * @example A projectile with an impact animation
 * ```js
 * const vfxConfig = {
 *   name: "arrowShot",
 *   components: {
 *     arrowShot: {
 *       type: "singleAttack",
 *       path: [{reference: "token", deltas: {sort: 1}}, {reference: "target", deltas: {sort: 1}}],
 *       charge: {
 *         duration: 1000,
 *         animations: [{function: "drawBack"}],
 *         sound: {
 *          src: "assets/sounds/BowAttack1.ogg",
 *          align: 2
 *         }
 *       },
 *       projectile: {
 *        texture: "assets/arrow/arrow-wood.png",
 *        animations: [{function: "followPath"}],
 *        size: 3, // feet
 *        speed: 150 // feet-per-second
 *       },
 *       impact: {
 *         texture: "assets/impact/BloodSplatter1.png",
 *         duration: 2000,
 *         sound: {
 *            src: "assets/sounds/ArrowHit1.wav",
 *            align: 1
 *         }
 *       }
 *     }
 *   },
 *   timeline: [{component: "arrowShot"}]
 * };
 * const effect = new foundry.canvas.vfx.VFXEffect(vfxConfig);
 * const target = game.user.targets.first();
 * effect.play({
 *   token: {..._token.center, elevation: _token.document.elevation, sort: _token.document.sort},
 *   target: {...target.center, elevation: target.document.elevation, sort: target.document.sort}
 * });
 * ```
 */
declare class VFXSingleAttackComponent<
  Schema extends VFXComponent.Schema.Any = VFXSingleAttackComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "singleAttack";

  /**
   * The steps of the single attack sequence.
   */
  static STEPS: VFXSingleAttackComponent.StepName[];

  /**
   * The configured origin point of the path.
   * This is recorded at the beginning of the _draw workflow once references are resolved.
   */
  origin: VFXPath.BasePathPoint | undefined;

  /**
   * The configured destination point of the path.
   * This is recorded at the beginning of the _draw workflow once references are resolved.
   */
  destination: VFXPath.BasePathPoint | undefined;

  static override defineSchema(): VFXSingleAttackComponent.Schema;

  protected override _load(): Promise<void>;

  protected override _draw(): Promise<void>;

  /**
   * Basic charge animation. It is expected for subclasses to override this to refine the effect.
   */
  protected _animateCharge(timings: VFXSingleAttackComponent.ChargeTimings): void;

  /**
   * Basic projectile animation. It is expected for subclasses to override this to refine the effect.
   */
  protected _animateProjectile(timings: VFXSingleAttackComponent.ProjectileTimings): void;

  /**
   * Basic impact animation. It is expected for subclasses to override this to refine the effect.
   */
  protected _animateImpact(timings: VFXSingleAttackComponent.ImpactTimings): void;

  protected override _stop(): Promise<void>;

  protected override _destroy(): void;

  /**
   * Compute timings for each step start, end, and sound.
   */
  protected _getTimings(): VFXSingleAttackComponent.Timings;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<VFXSingleAttackComponent.Schema>;

  static override get schema(): fields.SchemaField<VFXSingleAttackComponent.Schema>;

  static override validateJoint(data: VFXSingleAttackComponent.SourceData): void;

  static override fromSource(
    source: VFXSingleAttackComponent.CreateData,
    context?: DataModel.FromSourceOptions,
  ): VFXSingleAttackComponent;

  static override fromJSON(json: string): VFXSingleAttackComponent;

  #VFXSingleAttackComponent: true;
}

declare namespace VFXSingleAttackComponent {
  interface Any extends AnyVFXSingleAttackComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXSingleAttackComponent> {}

  /** A step name in the single attack sequence. */
  type StepName = "charge" | "projectile" | "impact";

  /** Timeline offsets (ms) for the charge step: start, end, and an optional sound cue. */
  interface ChargeTimings {
    chargeStart: number;

    chargeEnd: number;

    chargeSound?: number | undefined;
  }

  /** Timeline offsets (ms) for the projectile step: start, end, and an optional sound cue. */
  interface ProjectileTimings {
    projectileStart: number;

    projectileEnd: number;

    projectileSound?: number | undefined;
  }

  /** Timeline offsets (ms) for the impact step: start, end, and an optional sound cue. */
  interface ImpactTimings {
    impactStart: number;

    impactEnd: number;

    impactSound?: number | undefined;
  }

  /** The full set of timeline offsets (ms) computed by `_getTimings`, covering every step. */
  interface Timings extends ChargeTimings, ProjectileTimings, ImpactTimings {}

  interface AnimationSchema extends DataSchema {
    function: fields.StringField<{ required: true }>;

    params: foundry.canvas.vfx.fields.VFXReferenceField<fields.ObjectField>;
  }

  interface SoundSchema extends VFXPositionalSoundComponent.PositionalSoundSchema {}

  /** Shared sub-schema for a charge, projectile, or impact step. */
  interface AttackStepSchema extends DataSchema {
    texture: fields.StringField<{ required: true }>;

    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;

    scale: foundry.canvas.vfx.fields.VFXReferencePointField<{ required: false }>;

    size: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ required: false }>>;

    animations: fields.ArrayField<fields.SchemaField<AnimationSchema>>;

    sound: fields.SchemaField<SoundSchema, { nullable: true; initial: null }>;
  }

  /** The projectile step, which additionally configures a flight speed. */
  interface ProjectileStepSchema extends AttackStepSchema {
    speed: fields.NumberField<{ required: false }>;
  }

  interface PathPointSchema extends DataSchema {
    x: fields.NumberField<{ required: true; nullable: false }>;

    y: fields.NumberField<{ required: true; nullable: false }>;

    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    sort: fields.NumberField<{ nullable: false; initial: 0 }>;

    sortLayer: fields.NumberField<{
      nullable: false;
      initial: typeof foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.TOKENS;
    }>;
  }

  interface PathTypeSchema extends DataSchema {
    /** The path type registered in CONFIG.Canvas.vfx.paths. */
    type: fields.StringField<{ required: true; initial: "linear" }>;

    /** Additional parameters passed to the path generator. */
    params: fields.ObjectField<{ required: false }>;
  }

  interface Schema extends VFXComponent._Schema<"singleAttack"> {
    path: fields.ArrayField<
      foundry.canvas.vfx.fields.VFXReferenceObjectField<fields.SchemaField<PathPointSchema>>,
      { required: true; min: 2 }
    >;

    pathType: fields.SchemaField<PathTypeSchema>;

    charge: fields.SchemaField<AttackStepSchema>;

    projectile: fields.SchemaField<ProjectileStepSchema>;

    impact: fields.SchemaField<AttackStepSchema>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXSingleAttackComponent;

declare abstract class AnyVFXSingleAttackComponent extends VFXSingleAttackComponent {
  constructor(...args: never);
}
