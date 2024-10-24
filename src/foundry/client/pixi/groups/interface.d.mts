import type { InexactPartial } from "../../../../types/utils.d.mts";

declare global {
  /**
   * A container group which displays interface elements rendered above other canvas groups.
   */
  class InterfaceCanvasGroup extends CanvasGroupMixin(PIXI.Container) {
    /**
     * @defaultValue `"interface"`
     */
    static override groupName: string;

    /**
     * Draw the canvas group and all its component layers.
     */
    override draw(): Promise<void>;

    /**
     * Display scrolling status text originating from this ObjectHUD container.
     * @param origin  - An origin point where the text should first emerge
     * @param content - The text content to display
     * @param options - Options which customize the text animation
     * @returns - The created PreciseText object which is scrolling
     */
    createScrollingText(
      origin: Point,
      content: string,
      options?: {
        /**
         * The duration of the scrolling effect in milliseconds
         * @defaultValue `2000`
         */
        duration?: number;

        /**
         * The distance in pixels that the scrolling text should travel
         * @defaultValue (2 * text.width)
         */
        distance?: number;

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

        /**
         * Additional parameters of PIXI.TextStyle which are applied to the text
         */
        textStyle: InexactPartial<PIXI.ITextStyle>;
      },
    ): Promise<PreciseText | null>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "InterfaceCanvasGroup.reverseMaskfilter is deprecated.
     * Please create your own ReverseMaskFilter, or instead of attaching the filter to each of your objects extend the
     * already masked GridLayer with a container for these objects, which is much better for performance."
     */
    get reverseMaskfilter(): ReverseMaskFilter;
  }
}
