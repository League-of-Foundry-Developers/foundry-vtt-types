import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type { CanvasTransformMixin } from "./primary-canvas-object.d.mts";

/**
 * Primary canvas container are reserved for advanced usage.
 * They allow to group PrimarySpriteMesh in a single Container.
 * The container elevation is replacing individual sprite elevation.
 * @remarks This class is not used for anything by core as of 13.346
 */
declare class PrimaryCanvasContainer extends CanvasTransformMixin(PIXI.Container) {
  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   */
  get sort(): number;

  set sort(value);

  /**
   * The elevation of this container.
   */
  get elevation(): number;

  set elevation(value);

  /**
   * To know if this container has at least one children that should render its depth.
   */
  get shouldRenderDepth(): boolean;

  override sortChildren(): void;

  override updateCanvasTransform(): void;

  renderDepthData(renderer: PIXI.Renderer): void;

  #PrimaryCanvasContainer: true;
}

declare namespace PrimaryCanvasContainer {
  interface Any extends AnyPrimaryCanvasContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasContainer> {}
}

export default PrimaryCanvasContainer;

declare abstract class AnyPrimaryCanvasContainer extends PrimaryCanvasContainer {
  constructor(...args: never);
}
