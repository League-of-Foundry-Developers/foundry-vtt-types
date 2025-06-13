import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";

/**
 * Detection mode that see ALL creatures (no blockers).
 * If not constrained by walls, see everything within the range.
 */
declare class DetectionModeAll extends DetectionMode {
  static override getDetectionFilter(): PIXI.Filter;

  protected override _canDetect(
    visionSource: foundry.canvas.sources.PointVisionSource.Any,
    target: CanvasVisibility.TestObject,
  ): boolean;
}

declare namespace DetectionModeAll {
  interface Any extends AnyDetectionModeAll {}
  interface AnyConstructor extends Identity<typeof AnyDetectionModeAll> {}
}

export default DetectionModeAll;

declare abstract class AnyDetectionModeAll extends DetectionModeAll {
  constructor(...args: never);
}
