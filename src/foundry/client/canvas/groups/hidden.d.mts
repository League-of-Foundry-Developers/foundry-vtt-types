import type { FixedInstanceType, HandleEmptyObject, Identity } from "#utils";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { CanvasVisionMask, CanvasOcclusionMask, CanvasDepthMask } from "#client/canvas/layers/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      HiddenCanvasGroup: HiddenCanvasGroup.Implementation;
    }
  }
}

/**
 * A specialized canvas group for rendering hidden containers before all others (like masks).
 */
declare class HiddenCanvasGroup<
  DrawOptions extends HiddenCanvasGroup.DrawOptions = HiddenCanvasGroup.DrawOptions,
  TearDownOptions extends HiddenCanvasGroup.TearDownOptions = HiddenCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "hidden">(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /** @defaultValue `"none"` */
  override eventMode: PIXI.EventMode;

  /**
   * The container which hold masks.
   */
  masks: HiddenCanvasGroup.MasksContainer;

  /**
   * Add a mask to this group.
   * @param name          - Name of the mask.
   * @param displayObject - Display object to add.
   * @param position      - Position of the mask.
   * @remarks If `position` is passed, uses {@linkcode PIXI.Container.addChildAt | PIXI.Container#addChildAt},
   * replacing an existing child, otherwise simply appends with `addChild`
   * @throws If `name` is an empty string
   */
  addMask(name: string, displayObject: HiddenCanvasGroup.ObjectWithClear, position?: number): void;

  /**
   * Invalidate the masks: flag them for rerendering.
   */
  invalidateMasks(): void;

  protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<TearDownOptions>): Promise<void>;

  #HiddenCanvasGroup: true;
}

declare namespace HiddenCanvasGroup {
  interface Any extends AnyHiddenCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyHiddenCanvasGroup> {}

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.hidden.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /**
   * @remarks {@linkcode HiddenCanvasGroup.addMask | addMask} throws if the provided object lacks a
   * `clear` property, and by usage it wants a `() => void` method
   */
  interface ObjectWithClear extends PIXI.DisplayObject {
    clear(): void;
  }

  interface MasksContainer extends PIXI.Container {
    canvas: PIXI.LegacyGraphics;
    scene: PIXI.LegacyGraphics;
    vision: CanvasVisionMask;
    occlusion: CanvasOcclusionMask;
    depth: CanvasDepthMask;
  }

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
}

export default HiddenCanvasGroup;

declare abstract class AnyHiddenCanvasGroup extends HiddenCanvasGroup {
  constructor(...args: never);
}
