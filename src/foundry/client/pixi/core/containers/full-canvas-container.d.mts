import type { FixedInstanceType, Mixin } from "fvtt-types/utils";

declare class FullCanvasObject {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /** @remarks Overrides the mixed PIXI class's method, @see {@link PIXI.DisplayObject#calculateBounds} */
  calculateBounds(): void;
}

declare global {
  /**
   * Augment any PIXI.DisplayObject to assume bounds that are always aligned with the full visible screen.
   * The bounds of this container do not depend on its children but always fill the entire canvas.
   * @param Base - Any PIXI DisplayObject subclass
   * @returns The decorated subclass with full canvas bounds
   */
  function FullCanvasObjectMixin<BaseClass extends FullCanvasObjectMixin.BaseClass>(
    Base: BaseClass,
  ): Mixin<typeof FullCanvasObject, BaseClass>;

  namespace FullCanvasObjectMixin {
    type AnyMixedConstructor = ReturnType<typeof FullCanvasObjectMixin<BaseClass>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = PIXI.DisplayObject.AnyConstructor;
  }

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "You are using the FullCanvasContainer class which has been deprecated in favor of a more flexible FullCanvasObjectMixin which can augment any PIXI.DisplayObject subclass."
   */
  class FullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}
}
