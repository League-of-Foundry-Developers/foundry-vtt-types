import type { InexactPartial } from "../../../../../types/utils.d.mts";
import type { LineIntersection } from "../../../../common/utils/geometry.d.mts";

declare global {
  /**
   * A CanvasLayer for displaying UI controls which are overlayed on top of other layers.
   *
   * We track three types of events:
   * 1) Cursor movement
   * 2) Ruler measurement
   * 3) Map pings
   */
  class ControlsLayer<
    DrawOptions extends ControlsLayer.DrawOptions = ControlsLayer.DrawOptions,
    TearDownOptions extends ControlsLayer.TearDownOptions = ControlsLayer.TearDownOptions,
  > extends InteractionLayer<DrawOptions, TearDownOptions> {
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
     * Always interactive even if disabled for doors controls
     * @defaultValue `true`
     */
    override interactiveChildren: boolean;

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
    protected _offscreenPings: Record<string, Canvas.Point>;

    override options: ControlsLayer.LayerOptions;

    /**
     * @defaultValue
     * ```js
     * foundry.utils.mergeObject(super.layerOptions, {
     *   name: "controls",
     *   zIndex: 1000
     * }
     * ```
     */
    static override get layerOptions(): ControlsLayer.LayerOptions;

    /**
     * A convenience accessor to the Ruler for the active game user
     */
    get ruler(): ReturnType<this["getRulerForUser"]>;

    /**
     * Get the Ruler display for a specific User ID
     */
    getRulerForUser(userId: string): Ruler | null;

    override _draw(options?: DrawOptions): Promise<void>;

    override _tearDown(options?: TearDownOptions): Promise<void>;

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
    drawSelect(coords: Canvas.Rectangle): void;

    override _deactivate(): void;

    /**
     * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
     */
    protected _onMouseMove(): void;

    /**
     * Handle pinging the canvas.
     * @param event   - The triggering canvas interaction event.
     * @param origin  - The local canvas coordinates of the mousepress.
     */
    protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): ReturnType<Canvas["ping"]>;

    /**
     * Handle the canvas panning to a new view.
     */
    protected _onCanvasPan(): void;

    /**
     * Create and draw the Cursor object for a given User
     * @param user - The User document for whom to draw the cursor Container
     */
    drawCursor(user: User.ConfiguredInstance): Cursor;

    /**
     * Update the cursor when the user moves to a new position
     * @param user     - The User for whom to update the cursor
     * @param position - The new cursor position
     */
    updateCursor(user: User.ConfiguredInstance, position: Canvas.Point | null): void;

    /**
     * Update display of an active Ruler object for a user given provided data
     */
    updateRuler(user: User.ConfiguredInstance, rulerData: Ruler.MeasurementData | null): void;

    /**
     * Handle a broadcast ping.
     * @see {@link Ping#drawPing}
     * @param user     - The user who pinged.
     * @param position - The position on the canvas that was pinged.
     * @param data     - The broadcast ping data.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    handlePing(
      user: User.ConfiguredInstance,
      position: Canvas.Point,
      data?: InexactPartial<User.PingData & PingOptions>,
    ): Promise<boolean>;

    /**
     * Draw a ping at the edge of the viewport, pointing to the location of an off-screen ping.
     * @see {@link Ping#drawPing}
     * @param position - The coordinates of the off-screen ping.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    drawOffscreenPing(
      position: Canvas.Point,
      options?: InexactPartial<
        PingOptions & {
          /**
           * The style of ping to draw, from CONFIG.Canvas.pings.
           * @defaultValue `"arrow"`
           */
          //TODO: eventually replace with a type like `keyof CONFIG.Canvas.pings` but something mergable?
          style: string;

          /**
           * The user who pinged.
           */
          user: User.ConfiguredInstance;
        }
      >,
    ): ReturnType<this["drawPing"]>;

    /**
     * Draw a ping on the canvas
     * @see {@link Ping#animate}
     * @param position - The position on the canvas that was pinged.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    drawPing(
      position: PIXI.Point,
      options?: PingOptions & {
        /**
         * The style of ping to draw, from CONFIG.Canvas.pings.
         * @defaultValue `"pulse"`
         */
        //TODO: eventually replace with a type like `keyof CONFIG.Canvas.pings` but something mergable?
        style?: string;

        /**
         * The user who pinged.
         */
        user?: User.ConfiguredInstance;
      },
    ): ReturnType<Ping["animate"]>;

    /**
     * Given off-screen coordinates, determine the closest point at the edge of the viewport to these coordinates.
     * @param position - The off-screen co-ordinate.
     * @returns The closest point at the edge of the viewport to these coordinates and a ray cast from the centre of the screen towards it.
     * @internal
     */
    protected _findViewportIntersection(position: Canvas.Point): {
      ray: Ray;

      intersection: LineIntersection | null;
    };
  }

  namespace ControlsLayer {
    type AnyConstructor = typeof AnyControlsLayer;

    interface DrawOptions extends InteractionLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}

    interface LayerOptions extends InteractionLayer.LayerOptions {
      name: "controls";
      zIndex: 1000;
    }
  }
}

declare abstract class AnyControlsLayer extends ControlsLayer {
  constructor(arg0: never, ...args: never[]);
}
