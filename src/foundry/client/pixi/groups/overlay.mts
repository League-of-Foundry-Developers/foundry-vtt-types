declare global {
  /**
   * A container group which is not bound to the stage world transform.
   */
  class OverlayCanvasGroup extends BaseCanvasMixin(UnboundContainer) {
    /**
     * @defaultValue `"overlay"`
     */
    static override groupName: string;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }
}
