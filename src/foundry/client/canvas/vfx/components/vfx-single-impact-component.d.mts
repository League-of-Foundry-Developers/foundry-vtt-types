import type { Identity, ValueOf } from "#utils";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A VFX component used to add a single impact effect at a certain location.
 * Handles basic impacts that can be represented as the combination of a sprite and a sound.
 *
 * @example A blood splatter impact
 * ```js
 * const vfxConfig = {
 *   name: "bloodSplatter",
 *   components: {
 *     splash: {
 *       type: "singleImpact",
 *       position: {reference: "target", deltas: {sort: 1}},
 *       texture: "assets/impact/BloodSplatter1.png",
 *       size: 2,
 *       duration: 2000,
 *       sound: { src: "assets/sounds/ArrowHit1.wav", align: 1 }
 *     }
 *   },
 *   timeline: [{component: "splash"}]
 * };
 * ```
 */
declare class VFXSingleImpactComponent<
  Schema extends VFXComponent.Schema.Any = VFXSingleImpactComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "singleImpact";

  static override defineSchema(): VFXSingleImpactComponent.Schema;

  protected override _load(): Promise<void>;

  protected override _draw(): Promise<void>;

  protected override _stop(): Promise<void>;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<VFXSingleImpactComponent.Schema>;

  static override get schema(): fields.SchemaField<VFXSingleImpactComponent.Schema>;

  static override validateJoint(data: VFXSingleImpactComponent.SourceData): void;

  static override fromSource(
    source: VFXSingleImpactComponent.CreateData,
    context?: DataModel.FromSourceOptions,
  ): VFXSingleImpactComponent;

  static override fromJSON(json: string): VFXSingleImpactComponent;

  #VFXSingleImpactComponent: true;
}

declare namespace VFXSingleImpactComponent {
  interface Any extends AnyVFXSingleImpactComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXSingleImpactComponent> {}

  interface Schema extends VFXComponent._Schema<"singleImpact"> {
    /** Position of the impact. May be a reference with deltas. */
    position: foundry.canvas.vfx.fields.VFXReferenceObjectField<
      fields.SchemaField<{
        x: fields.NumberField<{ required: true; nullable: false }>;
        y: fields.NumberField<{ required: true; nullable: false }>;
        elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
        sort: fields.NumberField<{ nullable: false; initial: 0 }>;
        sortLayer: fields.NumberField<{
          nullable: false;
          initial: typeof foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.TOKENS;
        }>;
      }>
    >;
    texture: fields.StringField<{ required: true }>;
    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;
    /** Scale override for the impact sprite. May be a reference. */
    scale: foundry.canvas.vfx.fields.VFXReferencePointField<{ required: false }>;
    /** Uniform size in grid units. May be a reference. */
    size: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ required: false }>>;
    sound: fields.SchemaField<
      {
        src: fields.StringField<{ required: true; blank: false }>;
        align: fields.NumberField<{
          required: true;
          nullable: false;
          choices: ValueOf<typeof foundry.canvas.vfx.constants.SOUND_ALIGNMENT>[];
          initial: typeof foundry.canvas.vfx.constants.SOUND_ALIGNMENT.END;
        }>;
        volume: fields.AlphaField;
        radius: fields.NumberField<{ required: true; nullable: false; initial: 60; positive: true }>;
        easing: fields.BooleanField<{ initial: true }>;
        walls: fields.BooleanField<{ initial: true }>;
      },
      { nullable: true; initial: null }
    >;
    animations: fields.ArrayField<
      fields.SchemaField<{
        function: fields.StringField<{ required: true }>;
        params: foundry.canvas.vfx.fields.VFXReferenceField<fields.ObjectField<{ required: false }>>;
      }>
    >;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXSingleImpactComponent;

declare abstract class AnyVFXSingleImpactComponent extends VFXSingleImpactComponent {
  constructor(...args: never);
}
