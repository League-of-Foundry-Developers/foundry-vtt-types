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
     * Add a PrimaryGraphics to the group.
     * @param drawing - The Drawing being added
     * @returns The created Graphics instance
     */
    addDrawing(drawing: Drawing): PIXI.Graphics;

    /**
     * Remove a PrimaryGraphics from the group.
     * @param drawing - The Drawing being removed
     */
    removeDrawing(drawing: Drawing): void;

    override _draw(options: CanvasGroupMixin.DrawOptions): Promise<void>;

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
  }
}
