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
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace OverlayCanvasGroup {
    type Any = AnyOverlayCanvasGroup;
    type AnyConstructor = typeof AnyOverlayCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TeardownOptions {}
  }
}

declare abstract class AnyOverlayCanvasGroup extends OverlayCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
