import type { InexactPartial } from "#utils";

/**
 * A controller class for managing drag and drop workflows within an Application instance.
 * The controller manages the following actions: dragstart, dragover, drop.
 *
 * @example Activate drag-and-drop handling for a certain set of elements
 * ```js
 * const dragDrop = new DragDrop({
 *   dragSelector: ".item",
 *   dropSelector: ".items",
 *   permissions: { dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this) },
 *   callbacks: { dragstart: this._onDragStart.bind(this), drop: this._onDragDrop.bind(this) }
 * });
 * dragDrop.bind(html);
 * ```
 */
declare class DragDrop {
  /**
   * @param options - (default: `{}`)
   */
  constructor({ dragSelector, dropSelector, permissions, callbacks }?: DragDrop.Configuration);

  /**
   * A set of callback functions for each action of the drag & drop workflow.
   * @defaultValue `{}`
   */
  callbacks: InexactPartial<Record<DragDrop.Action, (event: DragEvent) => void>>;

  /**
   * The HTML selector which identifies draggable elements.
   * @defaultValue `undefined`
   */
  dragSelector: string | null | undefined;

  /**
   * The HTML selector which identifies drop targets.
   * @defaultValue `undefined`
   */
  dropSelector: string | null | undefined;

  /**
   * A set of functions to control authorization to begin drag workflows, and drop content.
   * @defaultValue `{}`
   */
  permissions: Partial<Record<DragDrop.PermissionKey, (selector: this["dragSelector"]) => boolean>>;

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
  callback(event: DragEvent, action: DragDrop.Action): void;

  /**
   * Test whether the current user has permission to perform a step of the workflow
   * @param action   - The action being attempted
   * @param selector - The selector being targeted
   * @returns Can the action be performed?
   */
  can(action: DragDrop.PermissionKey, selector?: this["dragSelector"]): boolean;

  /**
   * Handle the start of a drag workflow
   * @param event - The drag event being handled
   * @internal
   */
  protected _handleDragStart(event: DragEvent): void;

  /**
   * Handle a drag workflow ending for any reason.
   * @param event - The drag event.
   */
  protected _handleDragEnd(event: DragEvent): void;

  /**
   * Handle entering a drop target while dragging.
   * @param event - The Drag event.
   */
  protected _handleDragEnter(event: DragEvent): void;

  /**
   * Handle leaving a drop target while dragging.
   * @param event - The drag event.
   */
  protected _handleDragLeave(event: DragEvent): void;

  /**
   * Handle a dragged element over a droppable target
   * @param event - The drag event being handled
   * @internal
   */
  protected _handleDragOver(event: DragEvent): false;

  /**
   * Handle a dragged element dropped on a droppable target
   * @param event - The drag event being handled
   * @internal
   */
  protected _handleDrop(event: DragEvent): unknown;

  /**
   * A helper to create an image preview element for use during HTML element dragging.
   */
  static createDragImage(img: HTMLImageElement, width: number, height: number): HTMLDivElement;

  /**
   * Retrieve the configured DragDrop implementation.
   */
  static get implementation(): typeof DragDrop;
}

declare namespace DragDrop {
  type Action = "dragstart" | "dragover" | "drop" | "dragenter" | "dragleave" | "dragend";

  type PermissionKey = "dragstart" | "drop";

  /** @internal */
  interface _Configuration {
    /**
     * The CSS selector used to target draggable elements.
     * @defaultValue `null`
     */
    dragSelector?: DragDrop["dragSelector"];

    /**
     * The CSS selector used to target viable drop targets.
     * @defaultValue `null`
     */
    dropSelector?: DragDrop["dropSelector"];

    /**
     * Permission tests for each action
     * @defaultValue `{}`
     */
    permissions?: DragDrop["permissions"];

    /**
     * Callback functions for each action
     * @defaultValue `{}`
     */
    callbacks?: DragDrop["callbacks"];
  }

  interface Configuration extends InexactPartial<_Configuration> {}
}

export default DragDrop;
