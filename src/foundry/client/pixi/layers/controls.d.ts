import { ConfiguredDocumentClass } from "../../../../types/helperTypes";

declare global {
  /**
   * A CanvasLayer for displaying UI controls which are overlayed on top of other layers.
   *
   * We track three types of events:
   * 1) Cursor movement
   * 2) Ruler measurement
   * 3) Map pings
   */
  class ControlsLayer extends CanvasLayer<ControlsLayer.LayerOptions> {
    constructor();

    /**
     * A container of DoorControl instances
     * @defaultValue `this.addChild(new PIXI.Container())`
     */
    doors: PIXI.Container;

    /**
     * A container of HUD interface elements
     * @defaultValue `this.addChild(new PIXI.Container())`
     */
    hud: PIXI.Container;

    /**
     * A container of cursor interaction elements.
     * Contains cursors, rulers, interaction rectangles, and pings
     * @defaultValue `this.addChild(new PIXI.Container())`
     */
    cursors: PIXI.Container;

    /**
     * Ruler tools, one per connected user
     * @defaultValue `this.addChild(new PIXI.Container())`
     */
    rulers: PIXI.Container;

    /**
     * A graphics instance used for drawing debugging visualization
     * @defaultValue `this.addChild(new PIXI.Graphics())`
     */
    debug: PIXI.Graphics;

    /**
     * Canvas selection rectangle
     * @defaultValue `undefined`
     */
    select: PIXI.Graphics | undefined;

    /**
     * A mapping of user IDs to Cursor instances for quick access
     * @defaultValue `{}`
     */
    protected _cursors: Record<string, Cursor>;

    /**
     * A convenience mapping of user IDs to Ruler instances for quick access
     * @internal
     * @defaultValue `{}`
     */
    protected _rulers: Record<string, Ruler>;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: "controls",
     *   zIndex: 1000
     * })
     * ```
     */
    static override get layerOptions(): ControlsLayer.LayerOptions;

    /**
     * A convenience accessor to the Ruler for the active game user
     */
    get ruler(): ReturnType<ControlsLayer["getRulerForUser"]>;

    /**
     * Get the Ruler display for a specific User ID
     */
    getRulerForUser(userId: string): Ruler | null;

    override draw(): Promise<this>;

    /**
     * @remarks This breaks polymorphism. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6939
     */
    override tearDown(): Promise<void>;

    /**
     * Draw the cursors container
     */
    drawCursors(): void;

    /**
     * Draw Ruler tools
     */
    drawRulers(): void;

    /**
     * Draw the select rectangle given an event originated within the base canvas layer
     * @param coords - The rectangle coordinates of the form `{x, y, width, height}`
     */
    drawSelect({ x, y, width, height }: { x: number; y: number; width: number; height: number }): void;

    override deactivate(): void;

    /**
     * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
     */
    protected _onMoveCursor(event: PIXI.InteractionEvent): void;

    /**
     * Create and draw the Cursor object for a given User
     * @param user - The User document for whom to draw the cursor Container
     */
    drawCursor(user: InstanceType<ConfiguredDocumentClass<typeof User>>): Cursor;

    /**
     * Update the cursor when the user moves to a new position
     * @param user     - The User for whom to update the cursor
     * @param position - The new cursor position
     */
    updateCursor(user: InstanceType<ConfiguredDocumentClass<typeof User>>, position: Point | null): void;

    /**
     * Update display of an active Ruler object for a user given provided data
     */
    updateRuler(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      rulerData: Parameters<Ruler["update"]>[0] | null
    ): void;
  }

  namespace ControlsLayer {
    interface LayerOptions extends CanvasLayer.LayerOptions {
      name: "controls";
      zIndex: 1000;
    }
  }
}
