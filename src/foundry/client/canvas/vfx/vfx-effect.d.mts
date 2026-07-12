import type { Identity } from "#utils";
import type { DataSchema } from "#common/data/fields.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "./vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A specialized DataModel subclass used to configure VFXEffects in a way that can be serialized
 * for storage in a database or transmission over socket. VFXEffect instances involve animation
 * components which are animated over a configured timeline.
 *
 * Playback for a VFXEffect can only happen once. To repeat an effect multiple times, clone it
 * before each successive playback.
 */
declare class VFXEffect extends DataModel<VFXEffect.Schema> {
  static override defineSchema(): VFXEffect.Schema;

  /**
   * Is this VFXEffect currently playing?
   */
  get playing(): boolean;

  /**
   * Has playback of this effect started?
   */
  get started(): boolean;

  /**
   * Load necessary materials for all animation components.
   */
  load(): Promise<void>;

  /**
   * Perform initial drawing of every animation component.
   */
  draw(): Promise<void>;

  /**
   * Add managed display objects for each component to the primary canvas container.
   */
  attach(): void;

  override clone(
    data?: foundry.data.fields.SchemaField.UpdateData<VFXEffect.Schema>,
    context?: DataModel.CloneContext,
  ): this;

  /**
   * Begin playback of a VFXEffect using provided reference data.
   * @param references - A record of references used to resolve model data
   * @returns A Promise which resolves to whether playback fully completed,
   *          or `undefined` when the VFX framework is disabled via `CONFIG.Canvas.vfx.enabled`
   */
  play(references?: Record<string, unknown>): Promise<boolean | undefined>;

  /**
   * Stop animation, treating the animation as successfully completed.
   */
  stop(): Promise<void>;

  /**
   * Cancel animation and treat the animation as unsuccessful.
   */
  cancel(): Promise<void>;

  /**
   * Resolve all reference fields within this model against provided reference data.
   * This is idempotent: fields already resolved to concrete values are skipped on subsequent calls.
   * @param references - A record of references used to resolve model data
   */
  resolveReferences(references?: Record<string, unknown>): void;

  #VFXEffect: true;
}

declare namespace VFXEffect {
  interface Any extends AnyVFXEffect {}
  interface AnyConstructor extends Identity<typeof AnyVFXEffect> {}

  interface Schema extends DataSchema {
    name: fields.StringField<{ required: true; nullable: false; blank: false }>;
    // `components` is built at runtime from CONFIG.Canvas.vfx.components (open/dynamic set), so
    // there are no static type keys for TypedSchemaField to discriminate on. Override record types.
    components: fields.TypedObjectField<
      fields.TypedSchemaField<fields.TypedSchemaField.Types>,
      fields.TypedObjectField.DefaultOptions,
      Record<string, VFXComponent.CreateData>,
      Record<string, VFXComponent>,
      Record<string, VFXComponent.SourceData>
    >;
    timeline: fields.ArrayField<
      fields.SchemaField<{
        component: fields.StringField<{ required: true; nullable: false; blank: false }>;
        position: fields.AnyField;
      }>
    >;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /** The plain data shape of a VFXEffect configuration. */
  interface Data {
    name: string;
    components: Record<string, object>;
    timeline: TimelineSequenceEntry[];
  }

  /** A single entry in the VFXEffect timeline. */
  interface TimelineSequenceEntry {
    /** The labeled component in the sequence. */
    component: string;

    /**
     * The animejs offset position. Can be a number for absolute timeline values, a label
     * (with optional prefix), or a relative string (e.g. "+1000").
     */
    position?: number | string | undefined;
  }
}

export default VFXEffect;

declare abstract class AnyVFXEffect extends VFXEffect {
  constructor(...args: never);
}
