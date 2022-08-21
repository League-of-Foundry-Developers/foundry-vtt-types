/**
 * A UI utility to make an element draggable.
 */
declare class Draggable<R extends boolean | Draggable.Resizable = false> {
  /**
   * @param app       - The Application that is being made draggable.
   * @param element   - A JQuery reference to the Application's outer-most element.
   * @param handle    - The element that acts as a drag handle. Supply false to disable dragging.
   * @param resizable - Is the application resizable? Supply an object to configure resizing behaviour
   *                    or true to have it automatically configured.
   */
  constructor(app: Draggable["app"], element: JQuery, handle: Draggable["handle"], resizable?: R);

  app: Application;

  element: HTMLElement;

  handle: HTMLElement | boolean;

  /**
   * @defaultValue `false`
   */
  resizable: R;

  /**
   * Duplicate the application's starting position to track differences
   * @defaultValue `null`
   */
  position: foundry.utils.Duplicated<Application.Position> | null;

  /**
   * Remember event handlers associated with this Draggable class so they may be later unregistered
   */
  // prettier-ignore
  handlers: this["resizable"] extends true
    ? Draggable.ResizableHandlers
    : this["resizable"] extends false
      ? Draggable.Handlers
      : Draggable.Handlers | Draggable.ResizableHandlers;

  /**
   * Throttle mousemove event handling to 60fps
   * @defaultValue `0`
   */
  protected _moveTime: number;

  /**
   * Activate event handling for a Draggable application
   * Attach handlers for floating, dragging, and resizing
   */
  activateListeners(): void;

  /**
   * Attach handlers for dragging and floating.
   */
  protected _activateDragListeners(): void;

  /**
   * Attach handlers for resizing.
   */
  protected _activateResizeListeners(): void;

  /**
   * Handle the initial mouse click which activates dragging behavior for the application
   */
  protected _onDragMouseDown(event: Event): void;

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onDragMouseMove(event: Event): void;

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onDragMouseUp(event: Event): void;

  /**
   * Handle the initial mouse click which activates dragging behavior for the application
   */
  protected _onResizeMouseDown(event: Event): void;

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onResizeMouseMove(event: Event): void;

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onResizeMouseUp(event: Event): void;
}

declare namespace Draggable {
  interface Resizable {
    /** A selector for the resize handle. */
    selector?: string;
    //     * @param {boolean} [resizable.resizeX=true]  Enable resizing in the X direction.
    /**
     * Enable resizing in the X direction.
     * @defaultValue `true`
     */
    resizeX?: boolean;
    /**
     * Enable resizing in the y direction.
     * @defaultValue `true`
     */
    resizeY?: boolean;
  }

  interface Handlers {
    click: ["click", (e: Event) => void, { capture: boolean; passive: boolean }];

    dragDown: ["mousedown", (e: Event) => void, false];
    dragMove: ["mousemove", (e: Event) => void, false];
    dragUp: ["mouseup", (e: Event) => void, false];
  }

  interface ResizableHandlers extends Handlers {
    resizeDown: ["mousedown", (e: Event) => void, false];
    resizeMove: ["mousemove", (e: Event) => void, false];
    resizeUp: ["mouseup", (e: Event) => void, false];
  }
}
