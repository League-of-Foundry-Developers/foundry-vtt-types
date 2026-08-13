/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FixedInstanceType, Mixin } from "#utils";

declare class CanvasTransformMixinClass {
  /** @privateRemarks All mixin classes should accept anything for their constructor. */
  constructor(...args: any[]);

  /**
   * The transform matrix from local space to canvas space.
   */
  canvasTransform: PIXI.Matrix;

  /**
   * The update ID of canvas transform matrix.
   * @internal
   */
  protected _canvasTransformID: number;

  /**
   * The canvas bounds of this object.
   */
  canvasBounds: PIXI.Rectangle;

  /**
   * The canvas bounds of this object.
   */
  protected _canvasBounds: PIXI.Bounds;

  /**
   * The update ID of the canvas bounds.
   * Increment to force recalculation.
   */
  protected _canvasBoundsID: number;

  /**
   * Calculate the canvas bounds of this object.
   */
  protected _calculateCanvasBounds(): void;

  /**
   * Recalculate the canvas transform and bounds of this object and its children, if necessary.
   */
  updateCanvasTransform(): void;

  /**
   * Called when the canvas transform changed.
   */
  protected _onCanvasTransformUpdate(): void;

  /**
   * Called when the canvas bounds changed.
   */
  protected _onCanvasBoundsUpdate(): void;

  /**
   * Is the given point in canvas space contained in this object?
   * @param point - The point in canvas space.
   */
  containsCanvasPoint(point: PIXI.IPointData): boolean;

  #CanvasTransformMixinClass: true;
}

/**
 * A mixin which decorates a {@linkcode PIXI.DisplayObject | DisplayObject} with additional properties for canvas transforms and bounds.
 * @param DisplayObject - The parent `DisplayObject` class being mixed
 * @privateRemarks Despite naming the argument `DisplayObject`, its core consumers require `PIXI.Container` features.
 */
declare function CanvasTransformMixin<BaseClass extends CanvasTransformMixin.BaseClass>(
  DisplayObject: BaseClass,
): Mixin<typeof CanvasTransformMixinClass, BaseClass>;

declare namespace CanvasTransformMixin {
  interface AnyMixedConstructor extends ReturnType<typeof CanvasTransformMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Container.AnyConstructor;
}

export default CanvasTransformMixin;
