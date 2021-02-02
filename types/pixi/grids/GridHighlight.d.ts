/**
 * A special Graphics class which handles Grid layer highlighting
 */
declare class GridHighlight extends PIXI.Graphics {
  /**
   * Track the Grid Highlight name
   */
  name: string;

  /**
   * Track distinct positions which have already been highlighted
   */
  positions: Set<any>;

  constructor(name: any, ...args: any[]);
  /* -------------------------------------------- */

  /**
   * Record a position that is highlighted and return whether or not it should be rendered
   * @param x - The x-coordinate to highlight
   *            (type: `number`)
   * @param y - The y-coordinate to highlight
   *            (type: `number`)
   * @returns  - Whether or not to draw the highlight for this location
   *            (type: `boolean`)
   */
  highlight(x: number, y: number): boolean;

  /* -------------------------------------------- */

  /**
   * Extend the Graphics clear logic to also reset the highlighted positions
   * @param args - (type: `any[]`)
   */
  clear(...args: any[]): any;

  /* -------------------------------------------- */

  /**
   * Extend how this Graphics container is destroyed to also remove parent layer references
   * @param args - (type: `any[]`)
   */
  destroy(...args: any[]): any;
}
