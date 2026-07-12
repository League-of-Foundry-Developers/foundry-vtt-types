import type { Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type VFXPath from "../vfx-path.d.mts";

import fields = foundry.data.fields;

/**
 * A VFX component used for single actor → target direct attacks.
 * Supports up to three steps: pre-attack charge-up, projectile flight, and impact.
 *
 * @example A projectile with an impact animation
 * ```js
 * const vfxConfig = {
 *   name: "arrowShot",
 *   components: {
 *     arrowShot: {
 *       type: "singleAttack",
 *       path: [{reference: "token", deltas: {sort: 1}}, {reference: "target", deltas: {sort: 1}}],
 *       projectile: {
 *         texture: "assets/arrow/arrow-wood.png",
 *         animations: [{function: "followPath"}],
 *         size: 3,
 *         speed: 150
 *       },
 *       impact: {
 *         texture: "assets/impact/BloodSplatter1.png",
 *         duration: 2000
 *       }
 *     }
 *   },
 *   timeline: [{component: "arrowShot"}]
 * };
 * ```
 */
declare class VFXSingleAttackComponent extends VFXComponent<VFXSingleAttackComponent.Schema> {
  static override TYPE: "singleAttack";

  /**
   * The steps of the single attack sequence.
   */
  static STEPS: ["charge", "projectile", "impact"];

  /**
   * The configured origin point of the path.
   * Populated at the beginning of the _draw workflow.
   */
  origin: VFXPath.BasePathPoint;

  /**
   * The configured destination point of the path.
   * Populated at the beginning of the _draw workflow.
   */
  destination: VFXPath.BasePathPoint;

  /**
   * Basic charge animation.
   * Subclasses may override this to refine the effect.
   */
  protected _animateCharge(timings: Record<string, number>): void;

  /**
   * Basic projectile animation.
   * Subclasses may override this to refine the effect.
   */
  protected _animateProjectile(timings: Record<string, number>): void;

  /**
   * Basic impact animation.
   * Subclasses may override this to refine the effect.
   */
  protected _animateImpact(timings: Record<string, number>): void;

  /**
   * Compute timings for each step start, end, and sound.
   */
  protected _getTimings(): Record<string, number>;

  static override defineSchema(): VFXSingleAttackComponent.Schema;

  protected override _load(): Promise<void>;

  protected override _draw(): Promise<void>;

  protected override _stop(): Promise<void>;

  protected override _destroy(): void;

  #VFXSingleAttackComponent: true;
}

declare namespace VFXSingleAttackComponent {
  interface Any extends AnyVFXSingleAttackComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXSingleAttackComponent> {}

  /** A step name in the single attack sequence. */
  type StepName = "charge" | "projectile" | "impact";

  /** Shared sub-schema for a charge, projectile, or impact step. */
  interface AttackStepSchema extends DataSchema {
    texture: fields.StringField<{ required: true }>;
    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;
    scale: foundry.canvas.vfx.fields.VFXReferencePointField;
    size: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ required: false }>>;
    animations: fields.ArrayField<
      fields.SchemaField<{
        function: fields.StringField<{ required: true }>;
        params: foundry.canvas.vfx.fields.VFXReferenceField<fields.ObjectField>;
      }>
    >;
    sound: fields.SchemaField<
      {
        src: fields.StringField<{ required: true; blank: false }>;
        align: fields.NumberField<{ required: true; nullable: false; initial: 3 }>;
        volume: fields.AlphaField;
        radius: fields.NumberField<{ required: true; nullable: false; initial: 60; positive: true }>;
        easing: fields.BooleanField<{ initial: true }>;
        walls: fields.BooleanField<{ initial: true }>;
      },
      { nullable: true; initial: null }
    >;
  }

  interface Schema extends DataSchema {
    type: fields.StringField<{ required: true; blank: false }>;
    /** Array of at least 2 path points. Points may be reference objects with deltas. */
    path: fields.ArrayField<
      foundry.canvas.vfx.fields.VFXReferenceObjectField<
        fields.SchemaField<{
          x: fields.NumberField<{ required: true; nullable: false }>;
          y: fields.NumberField<{ required: true; nullable: false }>;
          elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
          sort: fields.NumberField<{ nullable: false; initial: 0 }>;
          sortLayer: fields.NumberField<{ nullable: false; initial: 700 }>;
        }>
      >,
      { required: true; min: 2 }
    >;
    pathType: fields.SchemaField<{
      type: fields.StringField<{ required: true; initial: "linear" }>;
      params: fields.ObjectField<{ required: false }>;
    }>;
    charge: fields.SchemaField<AttackStepSchema>;
    projectile: fields.SchemaField<
      AttackStepSchema & {
        speed: fields.NumberField<{ required: false }>;
      }
    >;
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
