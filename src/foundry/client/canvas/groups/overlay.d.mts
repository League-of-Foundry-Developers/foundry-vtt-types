import type { FixedInstanceType, Identity } from "#utils";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { UnboundContainer } from "#client/canvas/containers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      OverlayCanvasGroup: OverlayCanvasGroup.Implementation;
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
  // static override groupName is handled by the CanvasGroupMixin type

  /**
   * Should this group tear down its non-layer children?
   * @defaultValue `false`
   */
  static override tearDownChildren: boolean;
}

declare namespace OverlayCanvasGroup {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyOverlayCanvasGroup {}
    interface AnyConstructor extends Identity<typeof AnyOverlayCanvasGroup> {}
  }

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.overlay.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
}

export default OverlayCanvasGroup;

declare abstract class AnyOverlayCanvasGroup extends OverlayCanvasGroup {
  constructor(...args: never);
}
