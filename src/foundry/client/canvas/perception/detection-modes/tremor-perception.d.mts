import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";
import type { OutlineOverlayFilter } from "#client/canvas/rendering/filters/_module.d.mts";

/**
 * Detection mode that see creatures in contact with the ground.
 */
declare class DetectionModeTremor extends DetectionMode {
  static override getDetectionFilter(): OutlineOverlayFilter;

  /** @privateRemarks Fake override */
  protected static override _detectionFilter: OutlineOverlayFilter | undefined;

  protected override _canDetect(
    visionSource: PointVisionSource.Any,
    target: CanvasVisibility.TestObject | undefined,
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
