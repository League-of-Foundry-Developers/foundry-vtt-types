import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * Detection mode that see creatures in contact with the ground.
 */
declare class DetectionModeTremor extends DetectionMode {
  static override getDetectionFilter(): PIXI.Filter;

  protected override _canDetect(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    target: CanvasVisibility.TestObject,
  ): boolean;
}

declare namespace DetectionModeTremor {
  interface Any extends AnyDetectionModeTremor {}
  interface AnyConstructor extends Identity<typeof AnyDetectionModeTremor> {}
}

export default DetectionModeTremor;

declare abstract class AnyDetectionModeTremor extends DetectionModeTremor {
  constructor(...args: never);
}
