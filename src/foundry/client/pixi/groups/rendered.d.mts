export {};

declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
    /**
     * @defaultValue `"rendered"`
     */
    static override groupName: string;

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace RenderedCanvasGroup {
    type Any = AnyRenderedCanvasGroup;
    type AnyConstructor = typeof AnyRenderedCanvasGroup;
  }
}

declare abstract class AnyRenderedCanvasGroup extends RenderedCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
