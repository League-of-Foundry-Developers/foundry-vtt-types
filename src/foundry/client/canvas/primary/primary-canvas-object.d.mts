/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FixedInstanceType, Mixin } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { CanvasGroupMixin, PrimaryCanvasGroup } from "#client/canvas/groups/_module.d.mts";
import type { placeables, primary } from "#client/canvas/_module.d.mts";

declare class PrimaryCanvasObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue `true`
   * @privateRemarks Actually an override of {@linkcode PIXI.DisplayObject.cullable | PIXI.DisplayObject#cullable}
   */
  cullable: boolean;

  /**
   * An optional reference to the object that owns this PCO.
   * This property does not affect the behavior of the PCO itself.
   * @defaultValue `null`
   * @remarks Foundry types as `*`, but in core usage, it is only ever:
   * - {@linkcode placeables.Drawing | Drawing} ({@linkcode PrimaryCanvasGroup.addDrawing | PrimaryCanvasGroup#addDrawing} creates a {@linkcode primary.PrimaryGraphics | PrimaryGraphics})
   * - {@linkcode placeables.Token | Token} (`Token##handleTransitionChanges` and {@linkcode PrimaryCanvasGroup.addToken | PrimaryCanvasGroup#addToken} create {@linkcode primary.PrimarySpriteMesh | PrimarySpriteMesh}es)
   * - {@linkcode placeables.Tile | Tile} ({@linkcode PrimaryCanvasGroup.addTile | PrimaryCanvasGroup#addTile} creates a `PrimarySpriteMesh`)
   * - {@linkcode PrimaryCanvasGroup} (`PrimaryCanvasGroup##drawBackground` and `##drawForeground` create `PrimarySpriteMesh`es)
   * - `null`
   */
  object: PrimaryCanvasObjectMixin.OwningObject | null;

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
   * @remarks Foundry types this as taking a {@linkcode PIXI.Container} but then is more specific internally
   * @throws Unless `parent` is either `=== canvas.primary` or a {@linkcode foundry.canvas.primary.PrimaryCanvasContainer | PrimaryCanvasContainer}
   */
  protected _onAdded(parent: PrimaryCanvasObjectMixin.Parent): void;

  /**
   * Event fired when this display object is removed from its parent.
   * @param parent - Parent from which the PCO is removed.
   */
  protected _onRemoved(parent: PrimaryCanvasObjectMixin.Parent): void;

  /** @remarks See {@linkcode CanvasTransformMixinClass.updateCanvasTransform | CanvasTransformMixinClass#updateCanvasTransform} */
  updateCanvasTransform(): void;

  /** @remarks See {@linkcode CanvasTransformMixinClass._onCanvasBoundsUpdate | CanvasTransformMixinClass#_onCanvasBoundsUpdate} */
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
   * @deprecated "`PrimaryCanvasObject#document` is deprecated." (since v12, until v14)
   */
  get document(): placeables.PlaceableObject.AnyCanvasDocument | null;

  /**
   * @deprecated "`PrimaryCanvasObject#updateBounds` is deprecated and has no effect." (since v12, until v14)
   */
  updateBounds(): void;

  #PrimaryCanvasObject: true;
}

declare class CanvasTransformMixinClass {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The transform matrix from local space to canvas space.
   */
  canvasTransform: PIXI.Matrix;

  /**
   * The update ID of canvas transform matrix.
   * @internal
   * @remarks Accessed externally via `this.parent._canvasTransformID` in {@linkcode updateCanvasTransform}
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

/**
 * A mixin which decorates a {@linkcode PIXI.DisplayObject | DisplayObject} with additional properties expected for rendering in the {@linkcode PrimaryCanvasGroup}.
 * @param  DisplayObject - The parent `DisplayObject` class being mixed
 * @privateRemarks Despite naming the argument `DisplayObject`, it's typed as only taking `PIXI.Container`s, which matches core's usage
 */
declare function PrimaryCanvasObjectMixin<BaseClass extends PrimaryCanvasObjectMixin.BaseClass>(
  DisplayObject: BaseClass,
): Mixin<typeof PrimaryCanvasObject, ReturnType<typeof CanvasTransformMixin<BaseClass>>>;

declare namespace PrimaryCanvasObjectMixin {
  interface AnyMixedConstructor
    extends ReturnType<typeof PrimaryCanvasObjectMixin<PrimaryCanvasObjectMixin.BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Container.AnyConstructor;

  /**
   * @remarks {@linkcode PrimaryCanvasObject._onAdded | PrimaryCanvasObject#_onAdded} throws if not passed a {@linkcode PrimaryCanvasContainer}
   * or whatever {@linkcode canvas.primary} currently is, which presumably will be a {@linkcode PrimaryCanvasGroup}
   */
  type Parent = PrimaryCanvasGroup.Any | primary.PrimaryCanvasContainer.Any;

  /** @remarks See {@linkcode PrimaryCanvasObject.object | PrimaryCanvasObject#object} remarks */
  type OwningObject = placeables.PlaceableObject.Any | CanvasGroupMixin.AnyMixed;
}

/**
 * A mixin which decorates a {@linkcode PIXI.DisplayObject | DisplayObject} with additional properties for canvas transforms and bounds.
 * @param DisplayObject - The parent `DisplayObject` class being mixed
 * @privateRemarks Despite naming the argument `DisplayObject`, it's typed as only taking `PIXI.Container`s, which matches core's usage
 */
declare function CanvasTransformMixin<BaseClass extends CanvasTransformMixin.BaseClass>(
  DisplayObject: BaseClass,
): Mixin<typeof CanvasTransformMixinClass, BaseClass>;

declare namespace CanvasTransformMixin {
  interface AnyMixedConstructor extends ReturnType<typeof CanvasTransformMixin<CanvasTransformMixin.BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Container.AnyConstructor;
}
export { PrimaryCanvasObjectMixin as default, CanvasTransformMixin };
