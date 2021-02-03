/**
 * A UI utility to make an element draggable.
 */
declare class Draggable<R extends boolean | undefined = undefined> {
  constructor(app: Draggable['app'], element: JQuery, handle: Draggable['handle'], resizable?: R);

  app: Application;

  element: HTMLElement;

  handle: HTMLElement;

  /**
   * @defaultValue `false`
   */
  resizable: R;

  /**
   * Duplicate the application's starting position to track differences
   * @defaultValue `null`
   */
  position: Application.Position | null;

  /**
   * Remember event handlers associated with this Draggable class so they may be later unregistered
   */
  handlers: Draggable.Handlers<R>;

  /**
   * Throttle mousemove event handling to 60fps
   * @defaultValue `0`
   */
  protected _moveTime: number;

  /* -------------------------------------------- */

  /**
   * Activate event handling for a Draggable application
   * Attach handlers for floating, dragging, and resizing
   */
  activateListeners(): void;

  /* -------------------------------------------- */

  /**
   * Handle the initial mouse click which activates dragging behavior for the application
   */
  protected _onDragMouseDown(event: Event): void;

  /* -------------------------------------------- */

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onDragMouseMove(event: Event): void;

  /* -------------------------------------------- */

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onDragMouseUp(event: Event): void;

  /* -------------------------------------------- */

  /**
   * Handle the initial mouse click which activates dragging behavior for the application
   */
  protected _onResizeMouseDown(event: Event): void;

  /* -------------------------------------------- */

  /**
   * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
   */
  protected _onResizeMouseMove(event: Event): void;

  /* -------------------------------------------- */

  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   */
  protected _onResizeMouseUp(event: Event): void;
}

declare namespace Draggable {
  interface Handlers<R extends boolean | undefined> {
    click: ['click', (e: Event) => void, { capture: boolean; passive: boolean }];

    dragDown: ['mousedown', (e: Event) => void, false];
    dragMove: ['mousemove', (e: Event) => void, false];
    dragUp: ['mouseup', (e: Event) => void, false];

    resizeDown: R extends false | undefined ? undefined : ['mousedown', (e: Event) => void, false];
    resizeMove: R extends false | undefined ? undefined : ['mousemove', (e: Event) => void, false];
    resizeUp: R extends false | undefined ? undefined : ['mouseup', (e: Event) => void, false];
  }
}
