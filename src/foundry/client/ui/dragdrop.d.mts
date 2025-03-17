import type { InexactPartial } from "fvtt-types/utils";

declare global {
  interface DragDropConfiguration {
    /**
     * The CSS selector used to target draggable elements.
     */
    dragSelector?: DragDrop["dragSelector"];

    /**
     * The CSS selector used to target viable drop targets.
     */
    dropSelector?: DragDrop["dropSelector"];

    /**
     * An object of permission test functions for each action
     * @defaultValue `{}`
     */
    permissions?: DragDrop["permissions"];

    /**
     * An object of callback functions for each action
     * @defaultValue `{}`
     */
    callbacks?: DragDrop["callbacks"];
  }

  /**
   * A controller class for managing drag and drop workflows within an Application instance.
   * The controller manages the following actions: dragstart, dragover, drop
   * @see {@link Application}
   *
   * @example Activate drag-and-drop handling for a certain set of elements
   * ```typescript
   * const dragDrop = new DragDrop({
   *   dragSelector: ".item",
   *   dropSelector: ".items",
   *   permissions: { dragstart: this._canDragStart.bind(this), drop: this._canDragDrop.bind(this) },
   *   callbacks: { dragstart: this._onDragStart.bind(this), drop: this._onDragDrop.bind(this) }
   * });
   * dragDrop.bind(html);
   * ```
   */
  class DragDrop {
    /**
     * @param options - (default: `{}`)
     */
    constructor({ dragSelector, dropSelector, permissions, callbacks }?: InexactPartial<DragDropConfiguration>);

    /**
     * The HTML selector which identifies draggable elements
     * @defaultValue `undefined`
     */
    dragSelector: string | null | undefined;

    /**
     * The HTML selector which identifies drop targets
     * @defaultValue `undefined`
     */
    dropSelector: string | null | undefined;

    /**
     * A set of permission checking functions for each action of the Drag and Drop workflow
     * @defaultValue `{}`
     */
    permissions: Partial<Record<DragDrop.Action, (selector: this["dragSelector"]) => boolean>>;

    /**
     * A set of callback functions for each action of the Drag and Drop workflow
     * @defaultValue `{}`
     */
    callbacks: InexactPartial<Record<DragDrop.Action, (event: DragEvent) => void>>;

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
    can(action: DragDrop.Action, selector?: this["dragSelector"]): boolean;

    /**
     * Handle the start of a drag workflow
     * @param event - The drag event being handled
     * @internal
     */
    protected _handleDragStart(event: DragEvent): void;

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

    static createDragImage(img: HTMLImageElement, width: number, height: number): HTMLDivElement;
  }

  namespace DragDrop {
    type Action = "dragstart" | "dragover" | "drop";
  }
}
