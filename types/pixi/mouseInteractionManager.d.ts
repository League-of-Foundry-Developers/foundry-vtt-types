/**
 * Handle mouse interaction events for a Canvas object.
 *
 * There are three phases of events: hover, click, and drag
 *
 * Hover Events:
 *
 *      _handleMouseOver
 *              action: hoverIn
 *      _handleMouseOut
 *              action: hoverOut
 *
 * Left Click and Double-Click
 *
 *      _handleMouseDown
 *              action: clickLeft
 *              action: clickLeft2
 *
 * Right Click and Double-Click
 *
 *      _handleRightDown
 *              action: clickRight
 *              action: clickRight2
 *
 * Drag and Drop
 *
 *      _handleMouseMove
 *              action: dragLeftStart
 *              action: dragLeftMove
 *              action: dragRightStart
 *              action: dragLeftMove
 *      _handleMouseUp
 *              action: dragLeftDrop
 *              action: dragRightDrop
 *      _handleDragCancel
 *              action: dragLeftCancel
 *              action: dragRightCancel
 */
declare class MouseInteractionManager {
  callbacks: object

  /**
   * The drag handling time
   */
  dragTime: number

  /**
   * Bound handlers which can be added and removed
   */
  handlers: { [x: string]: Function }

  layer: PlaceablesLayer

  /**
   * The time of the last left-click event
   */
  lcTime: number

  object: PlaceableObject

  options: object

  permissions: object

  /**
   * The time of the last right-click event
   */
  rcTime: number

  /**
   * The current interaction state
   */
  state: number

  /**
   * A flag for whether we are right-click dragging
   */
  protected _dragRight: boolean

  constructor (
    object: PlaceableObject,
    layer: PlaceablesLayer,
    permissions?: object,
    callbacks?: object,
    options?: object
  );

  /**
   * A reference to the possible interaction states which can be observed
   */
  get states (): { [x: string]: number };

  /**
   * Get the target
   */
  get target (): any;

  /**
   * Activate interactivity for the handled object
   */
  activate (): MouseInteractionManager;

  /**
   * Execute a callback function associated with a certain action in the workflow
   * @param action - The action being attempted
   * @param event - The event being handled
   */
  callback (action: string, event: Event): any;

  /**
   * Test whether the current user has permission to perform a step of the workflow
   * @param action - The action being attempted
   * @param event - The event being handled
   * @returns Can the action be performed?
   */
  can (action: string, event: Event): boolean;

  /**
   * Activate a new set of listeners for click events on the target object
   */
  protected _activateClickEvents (): void;

  /**
   * Activate events required for handling a drag-and-drop workflow
   */
  protected _activateDragEvents (): void;

  /**
   * Activate a set of listeners which handle hover events on the target object
   */
  protected _activateHoverEvents (): void;

  /**
   * Deactivate event listeners for click events on the target object
   */
  protected _deactivateClickEvents (): void;

  /**
   * Deactivate events required for handling drag-and-drop workflow.
   */
  protected _deactivateDragEvents (): void;
  /**
   * Handle mouse-down which trigger a single left-click workflow.
   */
  protected _handleClickLeft (event: Event): void;

  /**
   * Handle mouse-down which trigger a single left-click workflow.
   */
  protected _handleClickLeft2 (event: Event): any;

  /**
   * Handle single right-click actions.
   */
  protected _handleClickRight (event: Event): void;

  /**
   * Handle double right-click actions.
   */
  protected _handleClickRight2 (event: Event): any;

  /**
   * Handle the cancellation of a drag workflow, resetting back to the original state
   */
  protected _handleDragCancel (event: Event): void;

  /**
   * Handle the conclusion of a drag workflow, placing all dragged objects back on the layer
   */
  protected _handleDragDrop (event: Event): void;

  /**
   * Handle the continuation of a drag workflow, moving all controlled objects on the layer
   */
  protected _handleDragMove (event: Event): any;

  /**
   * Handle the beginning of a new drag start workflow, moving all controlled objects on the layer
   */
  protected _handleDragStart (event: Event): any;

  /**
   * Handle mouse-down events which activate downstream listeners.
   * Stop further propagation only if the event is allowed by either single or double-click.
   */
  protected _handleMouseDown (event: Event): any;

  /**
   * Handle mouse movement during a drag workflow
   */
  protected _handleMouseMove (event: Event): any;

  /**
   * Handle mouse-out events which terminate hover workflows and do not stop propagation.
   */
  protected _handleMouseOut (event: Event): any;

  /**
   * Handle mouse-over events which activate downstream listeners and do not stop propagation.
   */
  protected _handleMouseOver (event: Event): any;

  /**
   * Handle mouse up events which may optionally conclude a drag workflow
   */
  protected _handleMouseUp (event: Event): void;

  /**
   * Handle right-click mouse-down events.
   * Stop further propagation only if the event is allowed by either single or double-click.
   */
  protected _handleRightDown (event: Event): any;
}
