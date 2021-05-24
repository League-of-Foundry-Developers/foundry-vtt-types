/**
 * A controller class for managing drag and drop workflows within an Application instance.
 * The controller manages the following actions: dragstart, dragover, drop
 * @see {@link Application}
 *
 * @example
 * ```typescript
 * const dragDrop = new DragDrop({
 *   dragSelector: ".item",
 *   dropSelector: ".items",
 *   permissions: { dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this) }
 *   callbacks: { dragstart: this._onDragStart.bind(this), drop: this._onDragDrop.bind(this) }
 * });
 * dragDrop.bind(html);
 * ```
 */
declare class DragDrop {
  /**
   * @param dragSelector - The CSS selector used to target draggable elements.
   *                       (default: `null`)
   * @param dropSelector - The CSS selector used to target viable drop targets.
   *                       (default: `null`)
   * @param permissions  - An object of permission test functions for each action
   *                       (default: `{}`)
   * @param callbacks    - An object of callback functions for each action
   *                       (default: `{}`)
   */
  constructor({ dragSelector, dropSelector, permissions, callbacks }?: DragDrop.Options);

  /**
   * The HTML selector which identifies draggable elements
   * @defaultValue `null`
   */
  dragSelector: string | null;

  /**
   * The HTML selector which identifies drop targets
   * @defaultValue `null`
   */
  dropSelector: string | null;

  /**
   * A set of permission checking functions for each action of the Drag and Drop workflow
   * @defaultValue `{}`
   */
  permissions: Partial<Record<string, (selector: string | null) => boolean>>;

  /**
   * A set of callback functions for each action of the Drag and Drop workflow
   * @defaultValue `{}`
   */
  callbacks: Partial<Record<string, (event: DragEvent) => unknown>>;

  /**
   * Bind the DragDrop controller to an HTML application
   * @param html - The HTML element to which the handler is bound
   */
  bind(html: HTMLElement): this;

  /**
   * Execute a callback function associated with a certain action in the workflow
   * @param event  - The drag event being handled
   * @param action - The action being attempted
   */
  callback(event: DragEvent, action: string): unknown;

  /**
   * Test whether the current user has permission to perform a step of the workflow
   * @param action   - The action being attempted
   * @param selector - The selector being targeted
   * @returns Can the action be performed?
   */
  can(action: string, selector: string | null): boolean;

  /**
   * Handle the start of a drag workflow
   * @param event - The drag event being handled
   */
  protected _handleDragStart(event: DragEvent): void;

  /**
   * Handle a dragged element over a droppable target
   * @param event - The drag event being handled
   */
  protected _handleDragOver(event: DragEvent): false;

  /**
   * Handle a dragged element dropped on a droppable target
   * @param event - The drag event being handled
   */
  protected _handleDrop(event: DragEvent): unknown;

  static createDragImage(img: HTMLImageElement, width: number, height: number): HTMLDivElement | HTMLElement;
}

declare namespace DragDrop {
  interface Options {
    /**
     * The CSS selector used to target draggable elements.
     * @defaultValue `null`
     */
    dragSelector?: DragDrop['dragSelector'];

    /**
     * The CSS selector used to target viable drop targets.
     * @defaultValue `null`
     */
    dropSelector?: DragDrop['dropSelector'];

    /**
     * An object of permission test functions for each action
     * @defaultValue `{}`
     */
    permissions?: DragDrop['permissions'];

    /**
     * An object of callback functions for each action
     * @defaultValue `{}`
     */
    callbacks?: DragDrop['callbacks'];
  }
}
