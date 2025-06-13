import type { Identity } from "#utils";
import type { CanvasTransformMixin } from "./primary-canvas-object.d.mts";

declare class PrimaryCanvasContainer extends CanvasTransformMixin(PIXI.Container) {
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
