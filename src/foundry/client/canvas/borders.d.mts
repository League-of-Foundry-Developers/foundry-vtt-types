/**
 * Draw a border.
 * @param graphics - The graphics to draw the shape into.
 * @param shape    - The shape to draw or a draw callback.
 * @param options  - Additional options.
 */
declare function drawBorder(
  graphics: PIXI.smooth.SmoothGraphics,
  shape: drawBorder.Shape,
  options?: drawBorder.Options,
): void;

declare namespace drawBorder {
  /**
   * @remarks A shape the graphics can draw directly, or a callback that performs the drawing
   * itself.
   */
  type Shape =
    | PIXI.Rectangle
    | PIXI.RoundedRectangle
    | PIXI.Circle
    | PIXI.Ellipse
    | PIXI.Polygon
    | ((graphics: PIXI.smooth.SmoothGraphics) => void);

  interface Options {
    /**
     * The border color.
     * @defaultValue `0xFFFFFF`
     */
    color?: PIXI.ColorSource | undefined;

    /**
     * Dashed border?
     * @defaultValue `false`
     */
    dashed?: boolean | undefined;

    /**
     * The alignment of the outline.
     * @defaultValue `0.5`
     */
    alignment?: number | undefined;

    /**
     * Clear the graphics before drawing the border?
     * @defaultValue `true`
     * @privateRemarks Foundry's description says the default is `0.5`; the destructured default is `true`.
     */
    clear?: boolean | undefined;
  }
}

export { drawBorder };
