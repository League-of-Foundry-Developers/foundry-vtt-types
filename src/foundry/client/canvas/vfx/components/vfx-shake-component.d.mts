import type { Identity } from "#utils";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A component that applies a canvas shake effect to a target PIXI display object.
 * Primarily intended for camera shakes (`canvas.stage`) but can target individual layers or groups.
 *
 * @example A screen shake on impact
 * ```js
 * const vfxConfig = {
 *   name: "impactShake",
 *   components: {
 *     screenShake: {
 *       type: "shake",
 *       target: "stage",
 *       duration: 800,
 *       maxDisplacement: 18,
 *       smoothness: 0.4
 *     }
 *   },
 *   timeline: [{component: "screenShake"}]
 * };
 * const effect = new foundry.canvas.vfx.VFXEffect(vfxConfig);
 * effect.play();
 * ```
 */
declare class VFXShakeComponent<
  Schema extends VFXComponent.Schema.Any = VFXShakeComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "shake";

  static override defineSchema(): VFXShakeComponent.Schema;

  protected override _draw(): Promise<void>;

  protected override _stop(): Promise<void>;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<VFXShakeComponent.Schema>;

  static override get schema(): fields.SchemaField<VFXShakeComponent.Schema>;

  static override validateJoint(data: VFXShakeComponent.SourceData): void;

  static override fromSource(
    source: VFXShakeComponent.CreateData,
    context?: DataModel.FromSourceOptions,
  ): VFXShakeComponent;

  static override fromJSON(json: string): VFXShakeComponent;

  #VFXShakeComponent: true;
}

declare namespace VFXShakeComponent {
  interface Any extends AnyVFXShakeComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXShakeComponent> {}

  interface Schema extends VFXComponent._Schema<"shake"> {
    /** The active shake duration in milliseconds (default 5000). */
    duration: fields.NumberField<{ required: true; nullable: false; initial: 5000; positive: true }>;
    /** The maximum displacement in pixels at the start of the shake (default 35). */
    maxDisplacement: fields.NumberField<{ required: true; nullable: false; initial: 35; positive: true }>;
    /** The return-to-origin interpolation factor per tick in [0, 1] (default 0.1). */
    returnSpeed: fields.NumberField<{ required: true; nullable: false; initial: 0.1; min: 0; max: 1 }>;
    /** An optional seed for a deterministic, reproducible shake pattern (default null). */
    seed: fields.NumberField<{ initial: null }>;
    /** Shake smoothness in [0, 1]; higher values produce lower-frequency motion (default 0.5). */
    smoothness: fields.NumberField<{ required: true; nullable: false; initial: 0.5; min: 0; max: 1 }>;
    /** Canvas property key of the display object to shake (default "stage"). May be a reference. */
    target: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.StringField<{ required: true; blank: false; initial: "stage" }>
    >;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXShakeComponent;

declare abstract class AnyVFXShakeComponent extends VFXShakeComponent {
  constructor(...args: never);
}
