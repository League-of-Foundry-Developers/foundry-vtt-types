import type { FixedInstanceType, HandleEmptyObject, Identity, InexactPartial, IntentionalPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PreciseText } from "#client/canvas/containers/_module.mjs";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasGroupConfig {
      InterfaceCanvasGroup: InterfaceCanvasGroup.Implementation;
    }
  }
}

/**
 * A container group which displays interface elements rendered above other canvas groups.
 */
declare class InterfaceCanvasGroup<
  DrawOptions extends InterfaceCanvasGroup.DrawOptions = InterfaceCanvasGroup.DrawOptions,
  TearDownOptions extends InterfaceCanvasGroup.TearDownOptions = InterfaceCanvasGroup.TearDownOptions,
> extends CanvasGroupMixin<typeof PIXI.Container, "interface">(PIXI.Container)<DrawOptions, TearDownOptions> {
  // static override groupName is handled by the CanvasGroupMixin type

  /**
   * Add a PrimaryGraphics to the group.
   * @param drawing - The Drawing being added
   * @returns The created Graphics instance
   * @remarks
   */
  addDrawing(drawing: Drawing.Implementation): PIXI.Graphics;

  /**
   * Remove a PrimaryGraphics from the group.
   * @param drawing - The Drawing being removed
   */
  removeDrawing(drawing: Drawing.Implementation): void;

  protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

  /**
   * Display scrolling status text originating from an origin point on the Canvas.
   * @param origin  - An origin point where the text should first emerge
   * @param content - The text content to display
   * @param options - Options which customize the text animation (default: `{}`)
   * @returns The created {@linkcode PreciseText} object which is scrolling
   * @remarks Only returns `undefined` if the core `scrollingStatusText` setting is falsey
   */
  createScrollingText(
    origin: Canvas.Point,
    content: string,
    options?: InterfaceCanvasGroup.CreateScrollingTextOptions,
  ): Promise<PreciseText | undefined>;

  #InterfaceCanvasGroup: true;
}

declare namespace InterfaceCanvasGroup {
  interface Any extends AnyInterfaceCanvasGroup {}
  interface AnyConstructor extends Identity<typeof AnyInterfaceCanvasGroup> {}

  interface ImplementationClass extends Identity<typeof CONFIG.Canvas.groups.interface.groupClass> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @internal */
  type _CreateScrollingTextOptions = InexactPartial<{
    /**
     * The distance in pixels that the scrolling text should travel
     * @defaultValue Double the width or height of the text, depending on direction
     */
    distance: number;

    /**
     * The original anchor point where the text appears
     * @defaultValue {@linkcode CONST.TEXT_ANCHOR_POINTS.CENTER}
     */
    anchor: CONST.TEXT_ANCHOR_POINTS;

    /**
     * The direction in which the text scrolls
     * @defaultValue {@linkcode CONST.TEXT_ANCHOR_POINTS.TOP}
     */
    direction: CONST.TEXT_ANCHOR_POINTS;

    /**
     * An amount of randomization between [0, 1] applied to the initial position
     * @defaultValue `0`
     * @remarks Only used if truthy
     */
    jitter: number;

    /**
     * The duration of the scrolling effect in milliseconds
     * @defaultValue `2000`
     */
    duration: number;
  }> &
    /*
     * Additional parameters of PIXI.TextStyle which are applied to the text
     * Excess keys are collected as `{...textStyle}` and passed to {@linkcode PreciseText.getTextStyle} which checks for `!== undefined`, so this can't be NullishProps
     */
    IntentionalPartial<PIXI.ITextStyle>;

  interface CreateScrollingTextOptions extends _CreateScrollingTextOptions {}

  interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

  interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
}

export default InterfaceCanvasGroup;

declare abstract class AnyInterfaceCanvasGroup extends InterfaceCanvasGroup {
  constructor(...args: never);
}
