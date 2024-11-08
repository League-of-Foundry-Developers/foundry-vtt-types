export {};

declare global {
  class ResizeHandle extends PIXI.Graphics {
    /**
     * @param handlers - (default: `{}`)
     */
    constructor(offset: ResizeHandle["offset"], handlers?: ResizeHandle["handlers"]);

    offset: [widthOffset: number, heightOffset: number];

    handlers: { canDrag?: boolean };

    /**
     * Track whether the handle is being actively used for a drag workflow
     * @defaultValue `false`
     */
    active: boolean;

    refresh(bounds: Canvas.Rectangle): void;

    /**
     * @param aspectRatio - (default: `null`)
     */
    updateDimensions(
      current: Canvas.Rectangle,
      origin: Canvas.Rectangle,
      destination: Canvas.Rectangle,
      { aspectRatio }?: { aspectRatio?: number | null },
    ): Canvas.Rectangle;

    activateListeners(): void;

    /**
     * Handle mouse-over event on a control handle
     * @param event - The mouseover event
     */
    protected _onHoverIn(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-out event on a control handle
     * @param event - The mouseout event
     */
    protected _onHoverOut(event: PIXI.FederatedEvent): void;

    /**
     * When we start a drag event - create a preview copy of the Tile for re-positioning
     * @param event - The mousedown event
     */
    protected _onMouseDown(event: PIXI.FederatedEvent): void;
  }
}
