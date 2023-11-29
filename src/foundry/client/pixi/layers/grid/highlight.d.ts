/**
 * A special Graphics class which handles Grid layer highlighting
 */
declare class GridHighlight extends PIXI.Graphics {
  constructor(name: string, ...args: ConstructorParameters<typeof PIXI.Graphics>);

  /**
   * Track the Grid Highlight name
   */
  name: string;

  /**
   * Track distinct positions which have already been highlighted
   */
  positions: Set<string>;

  /**
   * Record a position that is highlighted and return whether or not it should be rendered
   * @param x - The x-coordinate to highlight
   * @param y - The y-coordinate to highlight
   * @returns Whether or not to draw the highlight for this location
   */
  highlight(x: number, y: number): boolean;

  override clear(): this;

  /**
   * @privateRemarks The parameter should be PIXI.Graphics["destroy"]
   * or something to that effect since this is inheriting from that
   * but I'm not sure why the reference isn't working
   */
  override destroy(...args: Parameters<PIXI.smooth.SmoothGraphics["destroy"]>): void;
}
