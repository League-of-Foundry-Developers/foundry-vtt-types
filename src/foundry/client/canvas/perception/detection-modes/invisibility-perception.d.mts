import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * Detection mode that see invisible creatures.
 * This detection mode allows the source to:
 * - See/Detect the invisible target as if visible.
 * - The "See" version needs sight and is affected by blindness
 */
declare class DetectionModeInvisibility extends DetectionMode {
  static override getDetectionFilter(): PIXI.Filter;

  protected override _canDetect(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    target: CanvasVisibility.TestObject,
  ): boolean;
}

declare namespace DetectionModeInvisibility {
  interface Any extends AnyDetectionModeInvisibility {}
  interface AnyConstructor extends Identity<typeof AnyDetectionModeInvisibility> {}
}

export default DetectionModeInvisibility;

declare abstract class AnyDetectionModeInvisibility extends DetectionModeInvisibility {
  constructor(...args: never);
}
