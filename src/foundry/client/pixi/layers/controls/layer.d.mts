import type { FixedInstanceType, HandleEmptyObject, Identity, NullishProps } from "fvtt-types/utils";
import type { LineIntersection } from "#common/utils/geometry.d.mts";

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
     * Always interactive even if disabled for doors controls
     * @defaultValue `true`
     */
    override interactiveChildren: boolean;

    /**
     * A container of DoorControl instances
     * @defaultValue `new PIXI.Container()`
     */
    doors: PIXI.Container;

    /**
     * A container of cursor interaction elements.
     * Contains cursors, rulers, interaction rectangles, and pings
     * @defaultValue `new PIXI.Container()`
     * @remarks This Container's `eventMode` is set to `"none"` and its `mask` is set to `canvas.masks.canvas`
     */
    cursors: PIXI.Container;

    /**
     * Ruler tools, one per connected user
     * @defaultValue `new PIXI.Container()`
     * @remarks This Container's `eventMode` is set to `"none"`
     */
    rulers: PIXI.Container;

    /**
     * A graphics instance used for drawing debugging visualization
     * @defaultValue `new PIXI.Graphics()`
     * @remarks This Graphics's `eventMode` is set to `"none"`
     */
    debug: PIXI.Graphics;

    /**
     * Canvas selection rectangle
     * @remarks Only `undefined` prior to first draw
     */
    select: PIXI.Graphics | undefined;

    /**
     * A mapping of user IDs to Cursor instances for quick access
     * @defaultValue `{}`
     * @remarks Cursor class is non-configurable
     */
    _cursors: Record<string, Cursor>;

    /**
     * A convenience mapping of user IDs to Ruler instances for quick access
     * @defaultValue `{}`
     * @remarks Keys are User IDs
     *
     * Foundry marked `@private`
     */
    protected _rulers: Record<string, Ruler.ConfiguredInstance>;

    /**
     * The positions of any offscreen pings we are tracking.
     * @remarks Keys in the format `Ping.${foundry.utils.randomID()}`
     *
     * Foundry marked `@private`
     */
    protected _offscreenPings: Record<string, Canvas.Point>;

    /**
     * @privateRemarks This override does not exist in Foundry but reflects reality. Not automateable because of
     * lack of access to the constructor from the instance side
     */
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
    get ruler(): Ruler.ConfiguredInstance | null;

    /**
     * Get the Ruler display for a specific User ID
     */
    getRulerForUser(userId: string): Ruler.ConfiguredInstance | null;

    protected override _draw(options: HandleEmptyObject<ControlsLayer.DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<ControlsLayer.TearDownOptions>): Promise<void>;

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

    protected override _deactivate(): void;

    /**
     * Handle mousemove events on the game canvas to broadcast activity of the user's cursor position
     */
    protected _onMouseMove(): void;

    /**
     * Handle pinging the canvas.
     * @param event   - The triggering canvas interaction event.
     * @param origin  - The local canvas coordinates of the mousepress.
     */
    protected _onLongPress(event: PIXI.FederatedEvent, origin: PIXI.Point): Promise<boolean>;

    /**
     * Handle the canvas panning to a new view.
     * @remarks Called externally in {@link Canvas#pan}
     */
    protected _onCanvasPan(): void;

    /**
     * Create and draw the Cursor object for a given User
     * @param user - The User document for whom to draw the cursor Container
     */
    drawCursor(user: User.Implementation): Cursor;

    /**
     * Update the cursor when the user moves to a new position
     * @param user     - The User for whom to update the cursor
     * @param position - The new cursor position
     */
    updateCursor(user: User.Implementation, position: Canvas.Point | null): void;

    /**
     * Update display of an active Ruler object for a user given provided data
     * @see {@link Ruler#update}
     */
    updateRuler(user: User.Implementation, rulerData?: Ruler.MeasurementData | null): void;

    /**
     * Handle a broadcast ping.
     * @see {@link Ping.drawPing | `Ping#drawPing`}
     * @param user     - The user who pinged.
     * @param position - The position on the canvas that was pinged.
     * @param data     - The broadcast ping data.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    handlePing(
      user: User.Implementation,
      position: Canvas.Point,

      /** @remarks Despite being a `={}` parameter, an object containing a valid `scene` property (a scene ID) must be passed */
      data: ControlsLayer.HandlePingOptions,
    ): Promise<boolean>;

    /**
     * Draw a ping at the edge of the viewport, pointing to the location of an off-screen ping.
     * @see {@link Ping.drawPing | `Ping#drawPing`}
     * @param position - The coordinates of the off-screen ping.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    drawOffscreenPing(
      position: Canvas.Point,
      options?: ControlsLayer.DrawOffscreenPingOptions, // not:null (destructured)
    ): Promise<boolean>;

    /**
     * Draw a ping on the canvas
     * @see {@link Ping.animate | `Ping#animate`}
     * @param position - The position on the canvas that was pinged.
     * @param options  - Additional options to configure how the ping is drawn.
     * @returns A promise which resolves once the Ping has been drawn and animated
     */
    drawPing(
      position: Canvas.Point,
      options?: ControlsLayer.DrawPingOptions, // not:null (destructured)
    ): Promise<boolean>;

    /**
     * Given off-screen coordinates, determine the closest point at the edge of the viewport to these coordinates.
     * @param position - The off-screen co-ordinate.
     * @returns The closest point at the edge of the viewport to these coordinates and a ray cast from the centre of the screen towards it.
     * @remarks Foundry marked `@private`
     */
    protected _findViewportIntersection(position: Canvas.Point): ControlsLayer.ViewportIntersectionData;
  }

  namespace ControlsLayer {
    interface Any extends AnyControlsLayer {}
    interface AnyConstructor extends Identity<typeof AnyControlsLayer> {}

    type ImplementationClass = CONFIG["Canvas"]["layers"]["controls"]["layerClass"];
    type Implementation = FixedInstanceType<ImplementationClass>;

    interface DrawOptions extends InteractionLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}

    interface LayerOptions extends InteractionLayer.LayerOptions {
      name: "controls";
      zIndex: 1000;
    }

    interface HandlePingOptions extends User.PingData, Ping.ConstructorOptions {}

    /** @internal */
    type _DrawPingOptions = NullishProps<{
      /**
       * The user who pinged.
       * @remarks Only used to set the color of the ping. If `user?.color` ends up `undefined`, the relevant Ping class will provide a default color.
       * If a `color` property is passed along with this, `color` will take precedence
       */
      user: User.Implementation;
    }>;

    interface DrawPingOptions extends _DrawPingOptions, Pick<User.PingData, "style">, Ping.ConstructorOptions {}

    interface DrawOffscreenPingOptions extends DrawPingOptions {
      /**
       * @defaultValue `"arrow"`
       * @remarks Can't be `null` as it only has a parameter default
       */
      style?: User.PingData["style"] | undefined;
    }

    interface ViewportIntersectionData {
      /** A Ray from the center of the [viewport minus right sidebar] area to the point on the edge of that area in line with an offscreen ping */
      ray: Ray;

      /** The intersection with the viewport edge, or undefined if its on-screen */
      intersection: LineIntersection | undefined;
    }
  }
}

declare abstract class AnyControlsLayer extends ControlsLayer {
  constructor(...args: never);
}
