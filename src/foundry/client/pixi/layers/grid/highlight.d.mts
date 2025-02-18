export {};

declare global {
  /**
   * A special Graphics class which handles Grid layer highlighting
   */
  class GridHighlight extends PIXI.Graphics {
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

    /** @privateRemarks Foundry handles this by passing `(...args)` directly to super, but it only takes the one */
    override destroy(options?: PIXI.IDestroyOptions | boolean): void;
  }
}
