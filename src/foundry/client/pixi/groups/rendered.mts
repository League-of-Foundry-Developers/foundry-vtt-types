declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup extends BaseCanvasMixin(PIXI.Container) {
    /**
     * @defaultValue `"rendered"`
     */
    static override groupName: string;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }
}
