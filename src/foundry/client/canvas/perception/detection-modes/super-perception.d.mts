import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";
import type { OutlineOverlayFilter } from "#client/canvas/rendering/filters/_module.d.mts";

/**
 * Detection mode that see ALL creatures (no blockers).
 * If not constrained by walls, see everything within the range.
 */
declare class DetectionModeAll extends DetectionMode {
  static override getDetectionFilter(): OutlineOverlayFilter;

  /** @privateRemarks Fake override */
  protected static override _detectionFilter: OutlineOverlayFilter | undefined;

  protected override _canDetect(
    visionSource: PointVisionSource.Internal.Any,
    target: CanvasVisibility.TestObject | undefined,
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
