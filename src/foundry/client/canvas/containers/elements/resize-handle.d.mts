import type { Identity, InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A class based on PIXI.Graphics, that allows to create a resize handle in the desired area.
 */
declare class ResizeHandle extends PIXI.smooth.SmoothGraphics {
  /**
   * @param offset   - A two-element array [xFactor, yFactor] which defines the normalized position of this handle relative to the bounding box.
   * @param handlers - An object of optional handler functions.
   */
  constructor(offset: ResizeHandle.Offsets, handlers?: ResizeHandle.Handlers);

  offset: ResizeHandle.Offsets;

  handlers: ResizeHandle.Handlers;

  /**
   * Track whether the handle is being actively used for a drag workflow
   * @defaultValue `false`
   */
  active: boolean;

  /**
   * Refresh the position and hit area of this handle based on the provided bounding box.
   * @param bounds - The bounding box in which this handle operates.
   */
  refresh(bounds: Canvas.Rectangle): void;

  /**
   * Compute updated dimensions for an object being resized, respecting optional constraints.
   * @param current     - The current geometric state of the object
   * @param origin      - The original position and dimensions used for reference
   * @param destination - The mouse (or pointer) destination coordinates.
   * @param options     - Additional options.
   * @returns An object containing the adjusted `{x, y, width, height}`.
   */
  updateDimensions(
    current: Canvas.Rectangle,
    origin: Canvas.Rectangle,
    destination: ResizeHandle.Destination,
    options?: ResizeHandle.UpdateDimensionsOptions,
  ): Canvas.Rectangle;

  /**
   * Activate listeners for pointer events, enabling hover and mouse-down behavior on the resize handle.
   */
  activateListeners(): void;

  /**
   * Handle mouse-over event on a control handle
   * @param event - The mouseover event
   */
  protected _onHoverIn(event: PIXI.FederatedEvent<PointerEvent>): void;

  /**
   * Handle mouse-out event on a control handle
   * @param event - The mouseout event
   */
  protected _onHoverOut(event: PIXI.FederatedEvent<PointerEvent>): void;

  /**
   * When we start a drag event - create a preview copy of the Tile for re-positioning
   * @param event - The mousedown event
   */
  protected _onMouseDown(event: PIXI.FederatedEvent<PointerEvent>): void;
}

declare namespace ResizeHandle {
  interface Any extends AnyResizeHandle {}
  interface AnyConstructor extends Identity<typeof AnyResizeHandle> {}

  type Offsets = [widthOffset: number, heightOffset: number];

  /** @internal */
  type _Handlers = InexactPartial<{
    /** A function determining if this handle can initiate a drag. */
    canDrag: () => boolean;
  }>;

  interface Handlers extends _Handlers {}

  /** @privateRemarks {@linkcode ResizeHandle.updateDimensions | #updateDimensions} is too cool to just use a Point */
  interface Destination {
    /** The x-coordinate where the pointer was released. */
    x: number;

    /** The y-coordinate where the pointer was released. */
    y: number;
  }

  /** @internal */
  type _UpdateDimensionsOptions = InexactPartial<{
    /**
     * If provided, a numeric aspect ratio to maintain (width/height).
     * @defaultValue `null`
     * @remarks If truthy, will enforce the passed ratio, landscape if `width >= height`, portrait otherwise
     */
    aspectRatio: number | null;
  }>;

  interface UpdateDimensionsOptions extends _UpdateDimensionsOptions {}
}

export default ResizeHandle;

declare abstract class AnyResizeHandle extends ResizeHandle {
  constructor(...args: never);
}
