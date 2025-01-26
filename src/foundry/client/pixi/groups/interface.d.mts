import type { HandleEmptyObject, InexactPartial, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A container group which displays interface elements rendered above other canvas groups.
   */
  class InterfaceCanvasGroup<
    DrawOptions extends InterfaceCanvasGroup.DrawOptions = InterfaceCanvasGroup.DrawOptions,
    TearDownOptions extends InterfaceCanvasGroup.TearDownOptions = InterfaceCanvasGroup.TearDownOptions,
  > extends CanvasGroupMixin<typeof PIXI.Container, "interface">(PIXI.Container)<DrawOptions, TearDownOptions> {
    /**
     * Add a PrimaryGraphics to the group.
     * @param drawing - The Drawing being added
     * @returns The created Graphics instance
     */
    addDrawing(drawing: Drawing.ConfiguredInstance): PIXI.Graphics;

    /**
     * Remove a PrimaryGraphics from the group.
     * @param drawing - The Drawing being removed
     */
    removeDrawing(drawing: Drawing.ConfiguredInstance): void;

    protected override _draw(options: HandleEmptyObject<DrawOptions>): Promise<void>;

    /**
     * Display scrolling status text originating from this ObjectHUD container.
     * @param origin  - An origin point where the text should first emerge
     * @param content - The text content to display
     * @param options - Options which customize the text animation
     * @returns - The created PreciseText object which is scrolling
     */
    createScrollingText(
      origin: Canvas.Point,
      content: string,
      options?: NullishProps<{
        /**
         * The duration of the scrolling effect in milliseconds
         * @defaultValue `2000`
         */
        duration: number;

        /**
         * The distance in pixels that the scrolling text should travel
         */
        distance: number;

        /**
         * The original anchor point where the text appears
         */
        anchor: foundry.CONST.TEXT_ANCHOR_POINTS;

        /**
         * The direction in which the text scrolls
         */
        direction: foundry.CONST.TEXT_ANCHOR_POINTS;

        /**
         * An amount of randomization between [0, 1] applied to the initial position
         * @defaultValue `0`
         */
        jitter: number;
      }> &
        /**
         * Additional parameters of PIXI.TextStyle which are applied to the text
         * @remarks Excess keys are collected as `{...textStyle}` and passed to `PreciseText.getTextStyle` which checks for `!== undefined`, so this can't be NullishProps
         */
        InexactPartial<PIXI.ITextStyle>,
    ): Promise<PreciseText | null>;
  }

  namespace InterfaceCanvasGroup {
    type Any = AnyInterfaceCanvasGroup;
    type AnyConstructor = typeof AnyInterfaceCanvasGroup;

    interface DrawOptions extends CanvasGroupMixin.DrawOptions {}

    interface TearDownOptions extends CanvasGroupMixin.TearDownOptions {}
  }
}

declare abstract class AnyInterfaceCanvasGroup extends InterfaceCanvasGroup {
  constructor(arg0: never, ...args: never[]);
}
