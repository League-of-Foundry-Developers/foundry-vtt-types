export {};

declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup<
    DrawOptions extends RenderedCanvasGroup.DrawOptions = RenderedCanvasGroup.DrawOptions,
    TearDownOptions extends RenderedCanvasGroup.TearDownOptions = RenderedCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof PIXI.Container, "rendered">(PIXI.Container)<DrawOptions, TearDownOptions> {
    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace RenderedCanvasGroup {
    type Any = AnyRenderedCanvasGroup;
    type AnyConstructor = typeof AnyRenderedCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TeardownOptions {}
  }
}

declare abstract class AnyRenderedCanvasGroup extends RenderedCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
