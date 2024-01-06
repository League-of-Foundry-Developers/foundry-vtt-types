import { ConfiguredDocumentClass } from "../../../../../types/helperTypes";
import type { LineIntersection } from "../../../../common/utils/geometry.mjs";

declare global {
  /**
   * A CanvasLayer for displaying UI controls which are overlayed on top of other layers.
   *
   * We track three types of events:
   * 1) Cursor movement
   * 2) Ruler measurement
   * 3) Map pings
   */
  class ControlsLayer extends InteractionLayer {
    constructor();

    /**
     * @privateRemarks This is not overridden in foundry but reflects the real behavior.
     */
    static get instance(): Canvas["controls"];

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
     * The positions of any offscreen pings we are tracking.
     * @internal
     */
    protected _offscreenPings: Record<string, Point>;

    override options: ControlsLayer.LayerOptions;

    static override get layerOptions(): ControlsLayer.LayerOptions;

    /**
     * A convenience accessor to the Ruler for the active game user
     */
    get ruler(): ReturnType<ControlsLayer["getRulerForUser"]>;

    /**
     * Get the Ruler display for a specific User ID
     */
    getRulerForUser(userId: string): Ruler | null;

    override _draw(): Promise<void>;

    override _tearDown(): Promise<void>;

    /**
     * Draw the cursors container
     */
    drawCursors(): void;

    /**
     * Create and add Ruler graphics instances for every game User.
     */
    drawRulers(): void;

    /**
     * Draw door control icons to the doors container.
     */
    drawDoors(): void;

    /**
     * Draw the select rectangle given an event originated within the base canvas layer
     * @param coords - The rectangle coordinates of the form `{x, y, width, height}`
     */
    drawSelect(coords: { x: number; y: number; width: number; height: number }): void;

    override _deactivate(): void;

    /**
     * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
     */
    protected _onMouseMove(event: PIXI.FederatedEvent): void;

    /**
     * Handle pinging the canvas.
     * @param event   - The triggering canvas interaction event.
     * @param origin  - The local canvas coordinates of the mousepress.
     */
    protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): void;

    /**
     * Handle the canvas panning to a new view.
     */
    protected _onCanvasPan(): void;

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
      rulerData: Parameters<Ruler["update"]>[0] | null,
    ): void;

    /**
     * Handle a broadcast ping.
     * @param user     - The user who pinged.
     * @param position - The position on the canvas that was pinged.
     * @param data     - The broadcast ping data.
     * @returns @see Ping#animate
     */
    handlePing(
      user: InstanceType<ConfiguredDocumentClass<typeof User>>,
      position: PIXI.Point,
      data?: User.PingData,
    ): Promise<boolean>;

    /**
     * Draw a ping at the edge of the viewport, pointing to the location of an off-screen ping.
     * @param position - The co-ordinates of the off-screen ping.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns @see {@link Ping#animate}
     */
    drawOffscreenPing(
      position: PIXI.Point,
      options?: InexactPartial<
        PingOptions & {
          /**
           * The style of ping to draw, from CONFIG.Canvas.pings.
           * @defaultValue `"arrow"`
           */
          style?: string;

          /**
           * The user who pinged.
           */
          user?: InstanceType<ConfiguredDocumentClass<typeof User>>;
        }
      >,
    ): Promise<boolean>;

    /**
     * Draw a ping on the canvas
     * @param position - The position on the canvas that was pinged.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns @see {@link Ping#animate}
     */
    drawPing(
      position: PIXI.Point,
      options?: PingOptions & {
        /**
         * The style of ping to draw, from CONFIG.Canvas.pings.
         * @defaultValue `"pulse"`
         */
        style?: string;

        /**
         * The user who pinged.
         */
        user?: InstanceType<ConfiguredDocumentClass<typeof User>>;
      },
    ): Promise<boolean>;

    /**
     * Given an off-screen co-ordinate, determine the closest point at the edge of the viewport to that co-ordinate.
     * @param position - The off-screen co-ordinate.
     * @returns The closest point at the edge of the viewport to that
     *          co-ordinate and a ray cast from the centre of the
     *          screen towards it.
     * @internal
     */
    protected _findViewportIntersection(position: Point): {
      ray: Ray;

      intersection: LineIntersection | null;
    };
  }

  namespace ControlsLayer {
    interface LayerOptions extends InteractionLayer.LayerOptions {
      name: "controls";
      zIndex: 1000;
    }
  }
}

declare namespace User {
  /**
   * TODO: Should be declared in client/data/documents/user
   */
  type PingData = {
    pull: boolean;

    style: string;

    scene: string;

    zoom: number;
  };
}
