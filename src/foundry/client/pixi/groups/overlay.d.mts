export {};

declare global {
  /**
   * A container group which is not bound to the stage world transform.
   */
  class OverlayCanvasGroup extends CanvasGroupMixin(UnboundContainer) {
    /**
     * @defaultValue `"overlay"`
     */
    static override groupName: string;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace OverlayCanvasGroup {
    type Any = AnyOverlayCanvasGroup;
    type AnyConstructor = typeof AnyOverlayCanvasGroup;
  }
}

declare abstract class AnyOverlayCanvasGroup extends OverlayCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
