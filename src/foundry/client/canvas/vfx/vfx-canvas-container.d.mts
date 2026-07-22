import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type PrimaryCanvasContainer from "#client/canvas/primary/primary-canvas-container.d.mts";

/**
 * A special subclass of PrimaryCanvasContainer used for the animation of related display objects in VFXEffects.
 */
declare class VFXCanvasContainer extends PrimaryCanvasContainer {
  /**
   * A registry of named display objects which belong to this container.
   */
  sprites: Record<string, PIXI.DisplayObject>;

  #VFXCanvasContainer: true;
}

declare namespace VFXCanvasContainer {
  interface Any extends AnyVFXCanvasContainer {}
  interface AnyConstructor extends Identity<typeof AnyVFXCanvasContainer> {}
}

export default VFXCanvasContainer;

declare abstract class AnyVFXCanvasContainer extends VFXCanvasContainer {
  constructor(...args: never);
}
