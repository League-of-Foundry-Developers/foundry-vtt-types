import type { NullishProps } from "fvtt-types/utils";

declare global {
  class ResizeHandle extends PIXI.Graphics {
    /**
     * @param handlers - (default: `{}`)
     */
    constructor(offset: ResizeHandle.Offsets, handlers?: ResizeHandle.Handlers);

    offset: ResizeHandle.Offsets;

    handlers: ResizeHandle.Handlers;

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
      options?: ResizeHandle.UpdateDimensionsOptions,
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

  namespace ResizeHandle {
    interface Any extends AnyResizeHandle {}
    type AnyConstructor = typeof AnyResizeHandle;

    type Offsets = [widthOffset: number, heightOffset: number];

    /** @internal */
    type _Handlers = NullishProps<{
      canDrag: () => boolean | null | void;
    }>;

    interface Handlers extends _Handlers {}

    /** @internal */
    type _UpdateDimensionsOptions = NullishProps<{
      /**
       * Constrain the aspect ratio
       * @defaultValue `null`
       * @remarks If truthy, will enforce the passed ratio, landscape if `width >= height`, portrait otherwise
       */
      aspectRatio: number;
    }>;

    interface UpdateDimensionsOptions extends _UpdateDimensionsOptions {}
  }
}

declare abstract class AnyResizeHandle extends ResizeHandle {
  constructor(arg0: never, ...args: never[]);
}
