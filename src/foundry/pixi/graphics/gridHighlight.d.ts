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

  /**
   * Extend the Graphics clear logic to also reset the highlighted positions
   * @remarks Returns `void`, see https://gitlab.com/foundrynet/foundryvtt/-/issues/4732
   */
  clear(): any;

  /**
   * Extend how this Graphics container is destroyed to also remove parent layer references
   */
  destroy(options?: { children?: boolean; texture?: boolean; baseTexture?: boolean }): void;
}
