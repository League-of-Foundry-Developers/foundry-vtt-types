import type { FixedInstanceType, Identity } from "#utils";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      RenderedCanvasGroup: RenderedCanvasGroup.Implementation;
    }
  }
}

/**
 * A container group which contains the environment canvas group and the interface canvas group.
 */
declare class RenderedCanvasGroup<
  DrawOptions extends RenderedCanvasGroup.DrawOptions = RenderedCanvasGroup.DrawOptions,
  TearDownOptions extends RenderedCanvasGroup.TearDownOptions = RenderedCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "rendered">(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /**
   * Should this group tear down its non-layer children?
   * @defaultValue `false`
   */
  static override tearDownChildren: boolean;
}

declare namespace RenderedCanvasGroup {
  interface Any extends AnyRenderedCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyRenderedCanvasGroup> {}

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.rendered.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
}

export default RenderedCanvasGroup;

declare abstract class AnyRenderedCanvasGroup extends RenderedCanvasGroup {
  constructor(...args: never);
}
