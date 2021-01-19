/**
 * A special Graphics class which handles Grid layer highlighting
 * @type {PIXI.Graphics}
 */
declare class GridHighlight extends PIXI.Graphics {
    
    /**
     * Track the Grid Highlight name
     * @type {string}
     */
    name: string

    /**
     * Track distinct positions which have already been highlighted
     * @type {Set}
     */
    positions: Set

    /* -------------------------------------------- */

  /**
   * Record a position that is highlighted and return whether or not it should be rendered
   * @param {number} x    The x-coordinate to highlight
   * @param {number} y    The y-coordinate to highlight
   * @return {boolean}    Whether or not to draw the highlight for this location
   */
  highlight(
      x: number
      y: number
    ): boolean

    /* -------------------------------------------- */

  /**
   * Extend the Graphics clear logic to also reset the highlighted positions
   * @param args
   */
  clear(
      ...args: any[]
  ): void

  /* -------------------------------------------- */

  /**
   * Extend how this Graphics container is destroyed to also remove parent layer references
   * @param args
   */
  destroy(
      ...args any[]
  )

  constructor (name: any, ...args: any[])
}