import type { Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      RenderedCanvasGroup: RenderedCanvasGroup.Any;
    }
  }
}

declare global {
  /**
   * A container group which contains the environment canvas group and the interface canvas group.
   */
  class RenderedCanvasGroup<
    DrawOptions extends RenderedCanvasGroup.DrawOptions = RenderedCanvasGroup.DrawOptions,
    TearDownOptions extends RenderedCanvasGroup.TearDownOptions = RenderedCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof PIXI.Container, "rendered">(PIXI.Container)<DrawOptions, TearDownOptions> {
    /**
     * Should this group tear down its non-layer children?
     * @defaultValue `false`
     */
    static override tearDownChildren: boolean;
  }

  namespace RenderedCanvasGroup {
    interface Any extends AnyRenderedCanvasGroup {}
    interface AnyConstructor extends Identity<typeof AnyRenderedCanvasGroup> {}

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
  }
}

declare abstract class AnyRenderedCanvasGroup extends RenderedCanvasGroup {
  constructor(...args: never);
}
