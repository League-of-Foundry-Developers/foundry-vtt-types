export {};

declare global {
  /**
   * A container group which contains the primary canvas group and the effects canvas group.
   */
  class EnvironmentCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
    /**
     * @defaultValue `"environment"`
     */
    static override groupName: string;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;

    override draw(): Promise<void>;
  }
}
