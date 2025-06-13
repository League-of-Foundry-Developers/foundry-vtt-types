import type { Identity } from "#utils";

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
  positions: Set<GridHighlight.PositionString>;

  /**
   * Record a position that is highlighted and return whether or not it should be rendered
   * @param x - The x-coordinate to highlight
   * @param y - The y-coordinate to highlight
   * @returns Whether or not to draw the highlight for this location
   */
  highlight(x: number, y: number): boolean;

  override clear(): this;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;
}

declare namespace GridHighlight {
  interface Any extends AnyGridHighlight {}
  interface AnyConstructor extends Identity<typeof AnyGridHighlight> {}

  type PositionString = `${number},${number}`;
}

export default GridHighlight;

declare abstract class AnyGridHighlight extends GridHighlight {
  constructor(...args: never);
}
