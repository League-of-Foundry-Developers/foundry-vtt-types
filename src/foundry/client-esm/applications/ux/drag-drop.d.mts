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
 * @remarks TODO: Stub, copy from v12 implementation & update
 */
declare class DragDrop {}

declare namespace DragDrop {}

export default DragDrop;
