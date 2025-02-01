export {};

declare global {
  /**
   * A container group which is not bound to the stage world transform.
   */
  class OverlayCanvasGroup<
    DrawOptions extends OverlayCanvasGroup.DrawOptions = OverlayCanvasGroup.DrawOptions,
    TearDownOptions extends OverlayCanvasGroup.TearDownOptions = OverlayCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof UnboundContainer, "overlay">(UnboundContainer)<DrawOptions, TearDownOptions> {
    /**
     * Should this group tear down its non-layer children?
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace OverlayCanvasGroup {
    interface Any extends AnyOverlayCanvasGroup {}
    type AnyConstructor = typeof AnyOverlayCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
  }
}

declare abstract class AnyOverlayCanvasGroup extends OverlayCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
