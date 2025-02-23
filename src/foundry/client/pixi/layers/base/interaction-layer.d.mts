import type { HandleEmptyObject, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A subclass of CanvasLayer which provides support for user interaction with its contained objects.
   */
  class InteractionLayer extends CanvasLayer {
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
     * @returns - The layer instance, now activated
     */
    activate(options?: InteractionLayer.ActivateOptions): this;

    /**
     * The inner _activate method which may be defined by each InteractionLayer subclass.
     */
    protected _activate(): void;

    /**
     * Deactivate the InteractionLayer, removing interactivity from its children.
     * @returns - The layer instance, now inactive
     */
    deactivate(): this;

    /**
     * The inner _deactivate method which may be defined by each InteractionLayer subclass.
     */
    protected _deactivate(): void;

    protected override _draw(options: HandleEmptyObject<InteractionLayer.DrawOptions>): Promise<void>;

    /**
     * Get the zIndex that should be used for ordering this layer vertically relative to others in the same Container.
     */
    getZIndex(): number;

    /**
     * Handle left mouse-click events which originate from the Canvas stage.
     * @see {@link Canvas._onClickLeft | `Canvas#_onClickLeft`}
     * @param event - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onClickLeft(event: PIXI.FederatedEvent): void;

    /**
     * Handle double left-click events which originate from the Canvas stage.
     * @see {@link Canvas.#onClickLeft2 | `Canvas.#onClickLeft2`}
     * @param event - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onClickLeft2(event: PIXI.FederatedEvent): void;

    /**
     * Does the User have permission to left-click drag on the Canvas?
     * @param user  - The User performing the action.
     * @param event - The event object.
     */
    protected _canDragLeftStart(user: User.Implementation, event: PIXI.FederatedEvent): boolean;

    /**
     * Start a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas.#onDragLeftStart | `Canvas.#onDragLeftStart`}
     * @param event - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onDragLeftStart(event: PIXI.FederatedEvent): void;

    /**
     * Continue a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas.#onDragLeftMove | `Canvas.#onDragLeftMove`}
     * @param event - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onDragLeftMove(event: PIXI.FederatedEvent): void;

    /**
     * Conclude a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas.#onDragLeftDrop | `Canvas.#onDragLeftDrop`}
     * @param vent - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onDragLeftDrop(event: PIXI.FederatedEvent): void;

    /**
     * Cancel a left-click drag workflow originating from the Canvas stage.
     * @see {@link Canvas.#onDragLeftDrop | `Canvas.#onDragLeftDrop`}
     * @param event - A right-click pointer event on the document.
     */
    protected _onDragLeftCancel(event: PointerEvent): void;

    /**
     * Handle right mouse-click events which originate from the Canvas stage.
     * @see {@link Canvas._onClickRight | `Canvas._onClickRight`}
     * @param event - The PIXI InteractionEvent which wraps a PointerEvent
     */
    protected _onClickRight(event: PIXI.FederatedEvent): void;

    /**
     * Handle mouse-wheel events which occur for this active layer.
     * @see {@link MouseManager._onWheel | `MouseManager._onWheel`}
     * @param event - The WheelEvent initiated on the document
     */
    protected _onMouseWheel(event: WheelEvent): void;

    /**
     * Handle a DELETE keypress while this layer is active.
     * @see {@link ClientKeybindings._onDelete | `ClientKeybindings._onDelete`}
     * @param event - The delete key press event
     */
    protected _onDeleteKey(event: KeyboardEvent): Promise<void>;
  }

  namespace InteractionLayer {
    interface Any extends AnyInteractionLayer {}
    type AnyConstructor = typeof AnyInteractionLayer;

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

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}
  }
}

declare abstract class AnyInteractionLayer extends InteractionLayer {
  constructor(arg0: never, ...args: never[]);
}
