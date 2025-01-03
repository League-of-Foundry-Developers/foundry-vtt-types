export {};

declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup extends CanvasGroupMixin<typeof PIXI.Container, "rendered">(PIXI.Container) {
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
