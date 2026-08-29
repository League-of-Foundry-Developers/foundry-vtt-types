import type { Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type VFXPositionalSoundComponent from "./vfx-positional-sound-component.d.mts";

import fields = foundry.data.fields;

/**
 * A VFX component used to add a single impact effect at a certain location.
 * This component handles basic impacts that can be represented as the combination of a sprite and a sound.
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
 *       sound: {
 *         src: "assets/sounds/ArrowHit1.wav",
 *         align: 1
 *       }
 *     }
 *   },
 *   timeline: [{component: "splash"}]
 * };
 * const effect = new foundry.canvas.vfx.VFXEffect(vfxConfig);
 * const target = game.user.targets.first();
 * effect.play({
 *   target: {...target.center, elevation: target.document.elevation, sort: target.document.sort}
 * });
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

  static override _schema: fields.DataModelSchemaField<typeof VFXSingleImpactComponent>;

  static override get schema(): fields.DataModelSchemaField<typeof VFXSingleImpactComponent>;

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

  interface PositionSchema extends DataSchema {
    x: fields.NumberField<{ required: true; nullable: false }>;

    y: fields.NumberField<{ required: true; nullable: false }>;

    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

    sort: fields.NumberField<{ nullable: false; initial: 0 }>;

    sortLayer: fields.NumberField<{
      nullable: false;
      initial: typeof foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.TOKENS;
    }>;
  }

  interface SoundSchema extends VFXPositionalSoundComponent.PositionalSoundSchema {}

  interface AnimationSchema extends DataSchema {
    function: fields.StringField<{ required: true }>;

    params: foundry.canvas.vfx.fields.VFXReferenceField<fields.ObjectField<{ required: false }>>;
  }

  interface Schema extends VFXComponent._Schema<"singleImpact"> {
    position: foundry.canvas.vfx.fields.VFXReferenceObjectField<fields.SchemaField<PositionSchema>>;

    texture: fields.StringField<{ required: true }>;

    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;

    scale: foundry.canvas.vfx.fields.VFXReferencePointField<{ required: false }>;

    size: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ required: false }>>;

    sound: fields.SchemaField<SoundSchema, { nullable: true; initial: null }>;

    animations: fields.ArrayField<fields.SchemaField<AnimationSchema>>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXSingleImpactComponent;

declare abstract class AnyVFXSingleImpactComponent extends VFXSingleImpactComponent {
  constructor(...args: never);
}
