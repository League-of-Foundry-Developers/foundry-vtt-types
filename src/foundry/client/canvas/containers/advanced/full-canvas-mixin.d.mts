import type { FixedInstanceType, Mixin } from "#utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class FullCanvasObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /** @remarks Overrides the mixed PIXI class's method, @see {@link PIXI.DisplayObject.calculateBounds | `PIXI.DisplayObject#calculateBounds`} */
  calculateBounds(): void;
}

/**
 * Augment any PIXI.DisplayObject to assume bounds that are always aligned with the full visible screen.
 * The bounds of this container do not depend on its children but always fill the entire canvas.
 * @param Base - Any PIXI DisplayObject subclass
 */
declare function FullCanvasObjectMixin<BaseClass extends FullCanvasObjectMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof FullCanvasObject, BaseClass>;

declare namespace FullCanvasObjectMixin {
  interface AnyMixedConstructor extends ReturnType<typeof FullCanvasObjectMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.DisplayObject.AnyConstructor;
}

export default FullCanvasObjectMixin;
