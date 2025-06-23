import type Application from "#client/appv1/api/application-v1.mjs";
import type ApplicationV2 from "#client/applications/api/application.d.mts";
import type { Identity } from "#utils";

/**
 * A UI utility to make an element draggable.
 */
declare class Draggable<R extends boolean | Draggable.Resizable = false> {
  /**
   * @param app       - The Application that is being made draggable.
   * @param element   - The application's outer-most element.
   * @param handle    - The element that acts as a drag handle. Supply false to disable dragging.
   * @param resizable - Is the application resizable? Supply an object to configure resizing behavior
   *                    or true to have it automatically configured.
   */
  constructor(app: Draggable["app"], element: JQuery | HTMLElement, handle: Draggable["handle"], resizable?: R);

  /**
   * The Application being made draggable.
   */
  app: Application.Any | ApplicationV2.Any;

  /**
   * The Application's outer-most element.
   */
  element: HTMLElement;

  /**
   * The drag handle, or false to disable dragging.
   */
  handle: HTMLElement | boolean;

  /**
   * Registered event handlers.
   * @defaultValue `{}`
   */
  handlers: Draggable.RegisteredHandlers<R>;

  /**
   * The Application's starting position, pre-drag.
   * @defaultValue `null`
   */
  position: foundry.utils.Duplicated<Application.Position> | null;

  /**
   * Resize configuration.
   * @defaultValue `false`
   */
  resizable: R;

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
  protected _onDragMouseDown(event: PointerEvent): void;

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onDragMouseMove(event: PointerEvent): void;

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onDragMouseUp(event: PointerEvent): void;

  /**
   * Handle the initial mouse click which activates dragging behavior for the application
   */
  protected _onResizeMouseDown(event: PointerEvent): void;

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onResizeMouseMove(event: PointerEvent): void;

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onResizeMouseUp(event: PointerEvent): void;

  /**
   * Retrieve the configured Draggable implementation.
   * @remarks TODO: Link up with CONFIG
   */
  static get implementation(): typeof Draggable;
}

declare namespace Draggable {
  interface Any extends AnyDraggable {}
  interface AnyConstructor extends Identity<typeof AnyDraggable> {}

  interface Resizable {
    /**
     * A CSS selector for the resize handle.
     */
    selector?: string | undefined;

    /**
     * Enable resizing in the X direction.
     * @defaultValue `true`
     */
    resizeX?: boolean | undefined;

    /**
     * Enable resizing in the y direction.
     * @defaultValue `true`
     */
    resizeY?: boolean | undefined;

    /**
     * Modify the resizing direction to be right-to-left.
     */
    rt1?: boolean | null | undefined;
  }

  type RegisteredHandlers<R extends boolean | Resizable> = R extends true
    ? ResizableHandlers
    : R extends false
      ? Handlers
      : Handlers | ResizableHandlers;

  interface Handlers {
    click: ["click", (e: MouseEvent) => void, { capture: boolean; passive: boolean }];
    dragDown: ["pointerdown", (e: Event) => void, false];
    dragMove: ["pointermove", (e: Event) => void, false];
    dragUp: ["pointerup", (e: Event) => void, false];
  }

  interface ResizableHandlers extends Handlers {
    resizeDown: ["pointerdown", (e: Event) => void, false];
    resizeMove: ["pointermove", (e: Event) => void, false];
    resizeUp: ["pointerup", (e: Event) => void, false];
  }
}

declare abstract class AnyDraggable extends Draggable<boolean | Draggable.Resizable> {
  constructor(...args: never);
}

export default Draggable;
