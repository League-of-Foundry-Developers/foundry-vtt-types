import type { AnyObject, Identity, NullishProps } from "#utils";
import type { CanvasLayer } from "../_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A subclass of CanvasLayer which provides support for user interaction with its contained objects.
 */
declare class InteractionLayer extends CanvasLayer {
  /**
   * Is this layer currently active
   */
  get active(): boolean;

  /**
   * @privateRemarks Override not in foundry docs but implicit from layerOptions
   */
  override options: InteractionLayer.LayerOptions;

  /**
   * @defaultValue `"passive"`
   * @remarks Set to `"static"` when this layer is `#activate()`d, returned to `"passive"` when `#deactivate()`d
   */
  override eventMode: PIXI.EventMode;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   * @defaultValue
   * ```js
   * {
   *   baseClass: InteractionLayer,
   *   zIndex: 0,
   * }
   * ```
   */
  static get layerOptions(): InteractionLayer.LayerOptions;

  /**
   * Activate the InteractionLayer, deactivating other layers and marking this layer's children as interactive.
   * @param options - Options which configure layer activation
   * @returns The layer instance, now activated
   */
  activate(options?: InteractionLayer.ActivateOptions): this;

  /**
   * The inner _activate method which may be defined by each InteractionLayer subclass.
   */
  protected _activate(): void;

  /**
   * Deactivate the InteractionLayer, removing interactivity from its children.
   * @returns The layer instance, now inactive
   */
  deactivate(): this;

  /**
   * The inner _deactivate method which may be defined by each InteractionLayer subclass.
   */
  protected _deactivate(): void;

  protected override _draw(options: AnyObject): Promise<void>;

  /**
   * Get the zIndex that should be used for ordering this layer vertically relative to others in the same Container.
   */
  getZIndex(): number;

  /**
   * Callback actions which occur on a single left-click event to assume control of the object
   * @param event - The triggering canvas interaction event
   */
  protected _onClickLeft(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Handle double left-click events which originate from the Canvas stage.
   * @see {@linkcode Canvas.#onClickLeft2}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onClickLeft2(event: Canvas.Event.Pointer): boolean | void;

  /**
   * Does the User have permission to left-click drag on the Canvas?
   * @param user  - The User performing the action.
   * @param event - The event object.
   */
  protected _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  /**
   * Start a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftStart}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  /**
   * Continue a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftMove}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Conclude a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftDrop}
   * @param vent - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  /**
   * Cancel a left-click drag workflow originating from the Canvas stage.
   * @see {@linkcode Canvas.#onDragLeftDrop}
   * @param event - A right-click pointer event on the document.
   */
  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle right mouse-click events which originate from the Canvas stage.
   * @see {@linkcode Canvas._onClickRight}
   * @param event - The PIXI InteractionEvent which wraps a PointerEvent
   */
  protected _onClickRight(event: Canvas.Event.Pointer): void;

  /**
   * Handle mouse-wheel events which occur for this active layer.
   * @see {@linkcode MouseManager._onWheel}
   * @param event - The WheelEvent initiated on the document
   */
  protected _onMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Handle a DELETE keypress while this layer is active.
   * @see {@linkcode ClientKeybindings._onDelete}
   * @param event - The delete key press event
   */
  protected _onDeleteKey(event: Canvas.Event.DeleteKey): Promise<void>;
}

declare namespace InteractionLayer {
  interface Any extends AnyInteractionLayer {}
  interface AnyConstructor extends Identity<typeof AnyInteractionLayer> {}

  interface LayerOptions extends CanvasLayer.LayerOptions {
    zIndex: number;

    baseClass: typeof InteractionLayer;
  }

  /** @internal */
  type _ActivateOptions = NullishProps<{
    /** A specific tool in the control palette to set as active */
    tool: string;
  }>;

  interface ActivateOptions extends _ActivateOptions {}
}

export default InteractionLayer;

declare abstract class AnyInteractionLayer extends InteractionLayer {
  constructor(...args: never);
}
