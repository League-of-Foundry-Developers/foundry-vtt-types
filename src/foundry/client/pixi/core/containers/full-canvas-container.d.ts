export {};

declare class FullCanvasObject {
  /** @remarks Overrides the mixed in class */
  calculateBounds(): void;
}

declare global {
  /**
   * Augment any PIXI.DisplayObject to assume bounds that are always aligned with the full visible screen.
   * The bounds of this container do not depend on its children but always fill the entire canvas.
   * @param Base - Any PIXI DisplayObject subclass
   * @returns The decorated subclass with full canvas bounds
   */
  function FullCanvasObjectMixin<BaseClass extends typeof PIXI.DisplayObject>(
    Base: BaseClass,
  ): Mixin<typeof FullCanvasObject, BaseClass>;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks You are using the FullCanvasContainer class which has been deprecated in favor of a more flexible FullCanvasObjectMixin which can augment any PIXI.DisplayObject subclass.
   */
  class FullCanvasContainer extends FullCanvasObjectMixin(PIXI.Container) {}
}
