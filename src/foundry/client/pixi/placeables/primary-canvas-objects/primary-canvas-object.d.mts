import type { FixedInstanceType, Mixin } from "fvtt-types/utils";
import type Document from "../../../../common/abstract/document.d.mts";

declare class PrimaryCanvasObject {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue `true`
   * @privateRemarks Actually an override of the property on `PIXI.DisplayObject`
   */
  cullable: boolean;

  /**
   * An optional reference to the object that owns this PCO.
   * This property does not affect the behavior of the PCO itself.
   * @defaultValue `null`
   * @privateRemarks Foundry types as `*`, but in practice, it will only ever be a `Drawing` (via `PrimaryGraphics`),
   * or a `Token`, `Tile`, or the `PrimaryCanvasGroup` (via `PrimarySpriteMesh`), or its default value `null`
   */
  //TODO: (esheyw) Revisit the "any canvas group" type when groups are done
  object: PlaceableObject.Any | CanvasGroupMixin.AnyMixed | null;

  /**
   * The elevation of this object.
   * @defaultValue `0`
   */
  get elevation(): number;

  set elevation(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   */
  get sort(): number;

  set sort(value);

  /**
   * A key which resolves ties amongst objects at the same elevation of different layers.
   */
  get sortLayer(): number;

  set sortLayer(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer and same sort.
   */
  get zIndex(): number;

  set zIndex(value);

  /**
   * Event fired when this display object is added to a parent.
   * @param parent - The new parent container.
   * @throws If `parent` is not `=== canvas.primary`
   */
  protected _onAdded(parent: PIXI.Container): void;

  /**
   * Event fired when this display object is removed from its parent.
   * @param parent - Parent from which the PCO is removed.
   */
  protected _onRemoved(parent: PIXI.Container): void;

  /** @see {@link CanvasTransformMixinClass#updateCanvasTransform} */
  updateCanvasTransform(): void;

  /** @see {@link CanvasTransformMixinClass#_onCanvasBoundsUpdate} */
  protected _onCanvasBoundsUpdate(): void;

  /**
   * Does this object render to the depth buffer?
   */
  get shouldRenderDepth(): boolean;

  /**
   * Does this object render to the depth buffer?
   */
  protected _shouldRenderDepth(): boolean;

  /**
   * Render the depth of this object.
   */
  renderDepthData(renderer: PIXI.Renderer): void;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks `"PrimaryCanvasObject#renderOcclusion is deprecated in favor of PrimaryCanvasObject#renderDepthData"`
   */
  renderOcclusion(renderer: PIXI.Renderer): void;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"PrimaryCanvasObject#document is deprecated."`
   */
  get document(): Document.Any | null;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"PrimaryCanvasObject#updateBounds is deprecated and has no effect."`
   */
  updateBounds(): void;
}

declare class CanvasTransformMixinClass {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The transform matrix from local space to canvas space.
   */
  canvasTransform: PIXI.Matrix;

  /**
   * The update ID of canvas transform matrix.
   * @privateRemarks Foundry marked `@internal`, technically accessed externally via `this.parent._convasTranformID` in `updateCanvasTransform`
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
}

declare global {
  /**
   * A mixin which decorates a DisplayObject with additional properties expected for rendering in the PrimaryCanvasGroup.
   * @param DisplayObject - The parent DisplayObject class being mixed
   * @returns A DisplayObject subclass mixed with PrimaryCanvasObject features
   * @privateRemarks Despite naming the argument "DisplayObject", it's typed as only taking `PIXI.Container`s, which matches core's usage
   */
  function PrimaryCanvasObjectMixin<BaseClass extends PrimaryCanvasObjectMixin.BaseClass>(
    DisplayObject: BaseClass,
  ): Mixin<typeof PrimaryCanvasObject, ReturnType<typeof CanvasTransformMixin<BaseClass>>>;

  namespace PrimaryCanvasObjectMixin {
    type AnyMixedConstructor = ReturnType<typeof PrimaryCanvasObjectMixin<PrimaryCanvasObjectMixin.BaseClass>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = PIXI.Container.AnyConstructor;
  }

  /**
   * A mixin which decorates a DisplayObject with additional properties for canvas transforms and bounds.
   * @param DisplayObject - The parent DisplayObject class being mixed
   * @returns A DisplayObject subclass mixed with CanvasTransformMixin features
   * @privateRemarks Despite naming the argument "DisplayObject", it's typed as only taking `PIXI.Container`s, which matches core's usage
   */
  function CanvasTransformMixin<BaseClass extends CanvasTransformMixin.BaseClass>(
    DisplayObject: BaseClass,
  ): Mixin<typeof CanvasTransformMixinClass, BaseClass>;

  namespace CanvasTransformMixin {
    type AnyMixedConstructor = ReturnType<typeof CanvasTransformMixin<CanvasTransformMixin.BaseClass>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = PIXI.Container.AnyConstructor;
  }
}
