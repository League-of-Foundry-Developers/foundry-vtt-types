/* eslint-disable @typescript-eslint/no-unused-vars */
import type { FixedInstanceType, Mixin } from "#utils";
import type { CanvasGroupMixin, PrimaryCanvasGroup } from "#client/canvas/groups/_module.d.mts";
import type { placeables, primary } from "#client/canvas/_module.d.mts";
import type CanvasTransformMixin from "./canvas-transform-mixin.d.mts";

declare class PrimaryCanvasObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * An optional reference to the object that owns this PCO.
   * This property does not affect the behavior of the PCO itself.
   * @defaultValue `null`
   * @remarks Foundry types as `*`, but in core usage, it is only ever:
   * - {@linkcode placeables.Drawing | Drawing} ({@linkcode PrimaryCanvasGroup.addDrawing | PrimaryCanvasGroup#addDrawing} creates a {@linkcode primary.PrimaryGraphics | PrimaryGraphics})
   * - {@linkcode placeables.Token | Token} (`Token##handleTransitionChanges` and {@linkcode PrimaryCanvasGroup.addToken | PrimaryCanvasGroup#addToken} create {@linkcode primary.PrimarySpriteMesh | PrimarySpriteMesh}es)
   * - {@linkcode placeables.Tile | Tile} ({@linkcode PrimaryCanvasGroup.addTile | PrimaryCanvasGroup#addTile} creates a `PrimarySpriteMesh`)
   * - {@linkcode placeables.Wall | Wall} ({@linkcode placeables.Wall.createDoorMeshes | Wall#createDoorMeshes} creates various {@linkcode foundry.canvas.containers.DoorMesh | DoorMesh}es)
   * - {@linkcode PrimaryCanvasGroup} (`PrimaryCanvasGroup##drawBackground` and `##drawForeground` create `PrimarySpriteMesh`es)
   * - `null`, its default
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
   * Is this object in the primary group?
   */
  get inPrimary(): boolean;

  /**
   * The index of this object in {@linkcode canvas.primary.objects}.
   * @private
   */
  protected _primaryIndex: number;

  /**
   * Event fired when this display object is added to a parent.
   * @param parent - The new parent container.
   * @throws If `parent` is neither `canvas.primary` nor a {@linkcode foundry.canvas.primary.PrimaryCanvasContainer | PrimaryCanvasContainer}.
   */
  protected _onAdded(parent: PrimaryCanvasObjectMixin.Parent): void;

  /**
   * Called when the PCO is now in the primary group.
   */
  protected _onAddedPrimary(): void;

  /**
   * Event fired when this display object is removed from its parent.
   * @param parent - Parent from which the PCO is removed.
   * @remarks Foundry ignores `parent`.
   */
  protected _onRemoved(parent: PrimaryCanvasObjectMixin.Parent): void;

  /**
   * Called when the PCO is no longer in the primary group.
   */
  protected _onRemovedPrimary(): void;

  /**
   * Called when the elevation was changed.
   */
  protected _onElevationChange(): void;

  // Mixin override.
  updateCanvasTransform(): void;

  // Mixin override.
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

  #PrimaryCanvasObject: true;
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
  interface AnyMixedConstructor extends ReturnType<
    typeof PrimaryCanvasObjectMixin<PrimaryCanvasObjectMixin.BaseClass>
  > {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Container.AnyConstructor;

  /**
   * @remarks {@linkcode PrimaryCanvasObject._onAdded | PrimaryCanvasObject#_onAdded} throws if not passed a either {@linkcode PrimaryCanvasContainer}
   * or whatever {@linkcode canvas.primary} currently is, which presumably will be a {@linkcode PrimaryCanvasGroup}
   */
  type Parent = PrimaryCanvasGroup.Implementation | primary.PrimaryCanvasContainer.Any;

  /** @remarks See {@linkcode PrimaryCanvasObject.object | PrimaryCanvasObject#object} remarks */
  type OwningObject = placeables.PlaceableObject.Any | CanvasGroupMixin.AnyMixed;
}

export default PrimaryCanvasObjectMixin;
