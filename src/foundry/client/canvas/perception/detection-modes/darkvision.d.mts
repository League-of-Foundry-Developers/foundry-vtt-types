import type { Identity } from "#utils";
import type { DetectionMode } from "../_module.d.mts";
import type { CanvasVisibility } from "#client/canvas/groups/_module.d.mts";
import type { PointVisionSource } from "#client/canvas/sources/_module.d.mts";

/**
 * A special detection mode which models a form of darkvision (night vision).
 * This mode is the default case which is tested first when evaluating visibility of objects.
 * It is also a special case, in that it is the only detection mode which considers the area of distant light sources.
 */
declare class DetectionModeDarkvision extends DetectionMode {
  protected override _canDetect(
    visionSource: PointVisionSource.Internal.Any,
    target: CanvasVisibility.TestObject | undefined,
  ): boolean;
}

declare namespace DetectionModeDarkvision {
  interface Any extends AnyDetectionModeDarkvision {}
  interface AnyConstructor extends Identity<typeof AnyDetectionModeDarkvision> {}
}

export default DetectionModeDarkvision;

declare abstract class AnyDetectionModeDarkvision extends DetectionModeDarkvision {
  constructor(...args: never);
}
