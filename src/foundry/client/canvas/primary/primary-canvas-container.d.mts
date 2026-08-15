import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type CanvasTransformMixin from "./canvas-transform-mixin.d.mts";
import type PrimaryCanvasObjectMixin from "./primary-canvas-object.d.mts";

/**
 * Primary canvas container are reserved for advanced usage.
 * They allow to group PrimarySpriteMesh in a single Container.
 * The container elevation is replacing individual sprite elevation.
 */
declare class PrimaryCanvasContainer extends CanvasTransformMixin(PIXI.Container) {
  /**
   * The elevation of this container.
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
   * Is this container in the primary group?
   */
  get inPrimary(): boolean;

  protected _inPrimary: boolean;

  /**
   * To know if this container has at least one children that should render its depth.
   */
  get shouldRenderDepth(): boolean;

  /**
   * Event fired when this container is added to a parent.
   * @param parent - The new parent container.
   * @throws If `parent` is neither `canvas.primary` nor a {@linkcode foundry.canvas.primary.PrimaryCanvasContainer | PrimaryCanvasContainer}.
   */
  protected _onAdded(parent: PrimaryCanvasObjectMixin.Parent): void;

  /**
   * Called when the container is now in the primary group.
   */
  protected _onAddedPrimary(): void;

  /**
   * Event fired when this container is removed from its parent.
   * @param parent - Parent from which the container is removed.
   * @remarks Foundry ignores `parent`.
   */
  protected _onRemoved(parent: PrimaryCanvasObjectMixin.Parent): void;

  /**
   * Called when the container is no longer in the primary group.
   */
  protected _onRemovedPrimary(): void;

  /**
   * Called when the elevation was changed.
   */
  protected _onElevationChange(): void;

  /**
   * Does this object render to the depth buffer?
   */
  protected _shouldRenderDepth(): boolean;

  renderDepthData(renderer: PIXI.Renderer): void;

  override updateCanvasTransform(): void;

  override sortChildren(): void;

  #PrimaryCanvasContainer: true;
  static #PrimaryCanvasContainerStatic: true;
}

declare namespace PrimaryCanvasContainer {
  interface Any extends AnyPrimaryCanvasContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasContainer> {}
}

export default PrimaryCanvasContainer;

declare abstract class AnyPrimaryCanvasContainer extends PrimaryCanvasContainer {
  constructor(...args: never);
}
