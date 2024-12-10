export {};

declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup<
    DrawOptions extends RenderedCanvasGroup.DrawOptions = RenderedCanvasGroup.DrawOptions,
    TearDownOptions extends RenderedCanvasGroup.TearDownOptions = RenderedCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin(PIXI.Container)<DrawOptions, TearDownOptions> {
    static override groupName: "rendered";

    /**
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace RenderedCanvasGroup {
    type AnyConstructor = typeof AnyRenderedCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
  }
}

declare abstract class AnyRenderedCanvasGroup extends RenderedCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
