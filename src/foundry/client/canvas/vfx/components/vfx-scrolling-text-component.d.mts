import type { Identity } from "#utils";
import type VFXComponent from "../vfx-component.d.mts";

import fields = foundry.data.fields;

/**
 * A component for displaying scrolling text effects at a canvas location.
 * Uses the `CanvasInterfaceGroup#createScrollingText` API.
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
 * ```
 */
declare class VFXScrollingTextComponent<
  Schema extends VFXComponent.Schema.Any = VFXScrollingTextComponent.Schema,
> extends VFXComponent<Schema> {
  static override TYPE: "scrollingText";

  static override defineSchema(): VFXScrollingTextComponent.Schema;

  protected override _draw(): Promise<void>;

  #VFXScrollingTextComponent: true;
}

declare namespace VFXScrollingTextComponent {
  interface Any extends AnyVFXScrollingTextComponent {}
  interface AnyConstructor extends Identity<typeof AnyVFXScrollingTextComponent> {}

  interface Schema extends VFXComponent._Schema<"scrollingText"> {
    /** The text string to display. May be a reference. */
    content: foundry.canvas.vfx.fields.VFXReferenceField<fields.StringField<{ required: true; blank: false }>>;
    /** Distance in pixels the text travels. May be a reference. */
    distance: foundry.canvas.vfx.fields.VFXReferenceField<fields.NumberField<{ nullable: false }>>;
    /** Duration of the scrolling effect in ms. May be a reference. */
    duration: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: 2000 }>
    >;
    /** Randomization [0, 1] applied to the initial position. May be a reference. */
    jitter: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: 0 }>
    >;
    /** The canvas point where text originates. May be a reference. */
    origin: foundry.canvas.vfx.fields.VFXReferencePointField;
    /** Direction the text scrolls; value from CONST.TEXT_ANCHOR_POINTS. May be a reference. */
    scrollDirection: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: typeof CONST.TEXT_ANCHOR_POINTS.TOP }>
    >;
    /** Anchor point for the text; value from CONST.TEXT_ANCHOR_POINTS. May be a reference. */
    textAnchor: foundry.canvas.vfx.fields.VFXReferenceField<
      fields.NumberField<{ required: true; nullable: false; initial: typeof CONST.TEXT_ANCHOR_POINTS.CENTER }>
    >;
    /** Additional PIXI.TextStyle parameters. May be a reference. */
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
