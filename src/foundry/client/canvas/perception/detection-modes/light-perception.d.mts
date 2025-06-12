import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * This detection mode tests whether the target is visible due to being illuminated by a light source.
 * By default tokens have light perception with an infinite range if light perception isn't explicitely
 * configured.
 */
declare class DetectionModeLightPerception extends DetectionMode {
  protected override _canDetect(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    target: CanvasVisibility.TestObject,
  ): boolean;

  protected override _testPoint(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    mode: TokenDocument.DetectionModeData,
    target: CanvasVisibility.TestObject,
    test: CanvasVisibility.Test,
  ): boolean;
}

declare namespace DetectionModeLightPerception {
  interface Any extends AnyDetectionModeLightPerception {}
  interface AnyConstructor extends Identity<typeof AnyDetectionModeLightPerception> {}
}

export default DetectionModeLightPerception;

declare abstract class AnyDetectionModeLightPerception extends DetectionModeLightPerception {
  constructor(...args: never);
}
