import type { Identity } from "#utils";
import type DataModel from "#common/abstract/data.d.mts";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A component for displaying scrolling text effects at a canvas location using the
 * `CanvasInterfaceGroup#createScrollingText` API.
 * This can be used for damage numbers, status effects, or other floating text animations.
 *
 * @example Damage number above a token
 * ```js
 * const vfxConfig = {
 *   name: "damageNumber",
 *   components: {
 *     text: {
 *       type: "scrollingText",
 *       origin: {reference: "target"},
 *       content: "-12",
 *       duration: 1500,
 *       scrollDirection: CONST.TEXT_ANCHOR_POINTS.TOP,
 *       textStyle: {fill: "#ff4444", fontSize: 28, fontWeight: "bold"}
 *     }
 *   },
 *   timeline: [{component: "text"}]
 * };
 * const effect = new foundry.canvas.vfx.VFXEffect(vfxConfig);
 * const target = game.user.targets.first();
 * effect.play({target: target.center});
 * ```
 */
declare class VFXScrollingTextComponent<
  Schema extends VFXComponent.Schema.Any = VFXScrollingTextComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "scrollingText";

  static override defineSchema(): VFXScrollingTextComponent.Schema;

  protected override _draw(): Promise<void>;

  /* DataModel overrides */

  static override _schema: fields.SchemaField<VFXScrollingTextComponent.Schema>;

  static override get schema(): fields.SchemaField<VFXScrollingTextComponent.Schema>;

  static override validateJoint(data: VFXScrollingTextComponent.SourceData): void;

  static override fromSource(
    source: VFXScrollingTextComponent.CreateData,
    context?: DataModel.FromSourceOptions,
  ): VFXScrollingTextComponent;

  static override fromJSON(json: string): VFXScrollingTextComponent;

  #VFXScrollingTextComponent: true;
}

declare namespace VFXScrollingTextComponent {
  interface Any extends AnyVFXScrollingTextComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXScrollingTextComponent> {}

  interface Schema extends VFXComponent._Schema<"scrollingText"> {
    /** The text string to display */
    content: foundry.canvas.vfx.fields.VFXReferenceField<fields.StringField<{ required: true; blank: false }>>;

    /** The distance in pixels the text travels; defaults to twice the text size */
    distance: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ nullable: false }>>;

    /** The duration of the scrolling effect in milliseconds (default 2000) */
    duration: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: 2000 }>
    >;

    /** Randomization between [0, 1] applied to the initial position (default 0) */
    jitter: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: 0 }>
    >;

    /** The canvas point where the text originates */
    origin: foundry.canvas.vfx.fields.VFXReferencePointField<{ required: true }>;

    /** The direction the text scrolls in CONST.TEXT_ANCHOR_POINTS (default TOP) */
    scrollDirection: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: typeof CONST.TEXT_ANCHOR_POINTS.TOP }>
    >;

    /** An anchor point in CONST.TEXT_ANCHOR_POINTS (default CENTER) */
    textAnchor: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: typeof CONST.TEXT_ANCHOR_POINTS.CENTER }>
    >;

    /** Additional PIXI.TextStyle parameters applied to the text */
    textStyle: foundry.canvas.vfx.fields.VFXReferenceField<fields.ObjectField>;
  }

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface SourceData extends fields.SchemaField.SourceData<Schema> {}
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}
}

export default VFXScrollingTextComponent;

declare abstract class AnyVFXScrollingTextComponent extends VFXScrollingTextComponent {
  constructor(...args: never);
}
