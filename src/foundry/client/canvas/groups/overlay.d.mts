import type { Identity } from "#utils";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { UnboundContainer } from "#client/canvas/containers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      OverlayCanvasGroup: OverlayCanvasGroup.Any;
    }
  }
}

/**
 * A container group which is not bound to the stage world transform.
 */
declare class OverlayCanvasGroup<
  DrawOptions extends OverlayCanvasGroup.DrawOptions = OverlayCanvasGroup.DrawOptions,
  TearDownOptions extends OverlayCanvasGroup.TearDownOptions = OverlayCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof UnboundContainer, "overlay">(UnboundContainer)<DrawOptions, TearDownOptions> {
  /**
   * Should this group tear down its non-layer children?
   * @defaultValue `false`
   */
  static override tearDownChildren: boolean;
}

declare namespace OverlayCanvasGroup {
  interface Any extends AnyOverlayCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyOverlayCanvasGroup> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
}

export default OverlayCanvasGroup;

declare abstract class AnyOverlayCanvasGroup extends OverlayCanvasGroup {
  constructor(...args: never);
}
