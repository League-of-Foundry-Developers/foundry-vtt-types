import type { FixedInstanceType, AnyObject, Identity, InexactPartial } from "#utils";
import type { LineIntersection } from "#common/utils/geometry.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Cursor, UnboundContainer } from "#client/canvas/containers/_module.mjs";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { InteractionLayer } from "#client/canvas/layers/_module.d.mts";
import type { Ping, Ruler } from "#client/canvas/interaction/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface InteractionLayerConfig {
      ControlsLayer: ControlsLayer.Implementation;
    }
  }
}

/**
 * A CanvasLayer for displaying UI controls which are overlaid on top of other layers.
 *
 * We track three types of events:
 * 1) Cursor movement
 * 2) Ruler measurement
 * 3) Map pings
 */
declare class ControlsLayer extends InteractionLayer {
  constructor();

  /** @privateRemarks This is not overridden in foundry but reflects the real behavior. */
  static get instance(): Canvas["controls"];

  /**
   * Always interactive even if disabled for doors controls
   * @defaultValue `true`
   */
  override interactiveChildren: boolean;

  /**
   * A container of DoorControl instances
   */
  doors: PIXI.Container;

  /**
   * A container of pings interaction elements.
   * Contains pings elements.
   * @remarks This Container's `eventMode` is set to `"none"` and its `mask` is set to `canvas.masks.canvas`
   */
  pings: PIXI.Container;

  /**
   * A container of cursor interaction elements.
   * Contains cursors, rulers, interaction rectangles, and pings
   * @remarks This Container's `eventMode` is set to `"none"`
   */
  cursors: UnboundContainer;

  /** @deprecated Removed and replaced with {@linkcode _rulerPaths} in v13. This warning will be removed in v14. */
  rulers: never;

  /**
   * The ruler paths.
   * @remarks This Container's `eventMode` is set to `"none"`
   * @internal
   */
  protected _rulerPaths: PIXI.Container;

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

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  _cursors: never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _rulers: never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _offscreenPings: never;

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

  /** @privateRemarks Fake type override */
  override options: ControlsLayer.LayerOptions;

  /**
   * A convenience accessor to the Ruler for the active game user
   */
  get ruler(): Ruler.Implementation | null;

  /**
   * Get the Ruler instance for a specific User ID.
   */
  getRulerForUser(userId: string): Ruler.Implementation | null;

  /**
   * Get the Cursor instance for a specific User ID.
   * @param userId - The User ID
   */
  getCursorForUser(userId: string): Cursor | null;

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  /**
   * Draw the cursors container
   */
  drawCursors(): void;

  /**
   * Create and add Ruler instances for every game User.
   */
  drawRulers(): Promise<void>;

  /**
   * Draw door control icons to the doors container.
   */
  drawDoors(): void;

  /**
   * Draw the select rectangle given an event originated within the base canvas layer
   * @param coords - The rectangle
   */
  drawSelect(coords: Canvas.Rectangle): void;

  protected override _deactivate(): void;

  /**
   * Handle mousemove events on the game canvas to broadcast activity. With SHOW_CURSOR permission enabled,
   * the user's cursor position is transmitted.
   * @internal
   */
  protected _onMouseMove(currentPos: PIXI.Point): void;

  /**
   * Handle pinging the canvas.
   * @param event   - The triggering canvas interaction event.
   * @param origin  - The local canvas coordinates of the mousepress.
   */
  protected _onLongPress(event: Canvas.Event.Pointer, origin: PIXI.Point): Promise<boolean>;

  /**
   * Handle the canvas panning to a new view.
   * @remarks Called externally in {@link Canvas#pan}
   */
  protected _onCanvasPan(): void;

  /**
   * Create and draw the Cursor object for a given User.
   * @param user - The User document for whom to draw the cursor Container
   */
  drawCursor(user: User.Implementation): Cursor;

  /**
   * Create and draw the Ruler object for a given User.
   * @param user - The User document for whom to draw the Ruler
   * @returns The Ruler instance
   */
  drawRuler(user: User.Implementation): Promise<Ruler.Implementation>;

  /**
   * Update the cursor when the user moves to a new position
   * @param user     - The User for whom to update the cursor
   * @param position - The new cursor position
   */
  updateCursor(user: User.Implementation, position: Canvas.Point | null): void;

  /**
   * Update display of an active Ruler object for a user given provided data
   */
  updateRuler(user: User.Implementation, rulerData?: Ruler.UpdateData | null): void;

  /**
   * Handle a broadcast ping.
   * @see {@linkcode ControlsLayer.drawPing | ControlsLayer#drawPing}
   * @param user     - The user who pinged.
   * @param position - The position on the canvas that was pinged.
   * @param data     - The broadcast ping data.
   * @returns A promise which resolves once the Ping has been drawn and animated
   * @remarks Despite `data` being a `={}` parameter, an object containing a valid `scene` property (a scene ID) must be passed
   */
  handlePing(
    user: User.Implementation,
    position: Canvas.Point,
    data: ControlsLayer.HandlePingOptions,
  ): Promise<boolean>;

  /**
   * Draw a ping at the edge of the viewport, pointing to the location of an off-screen ping.
   * @see {@linkcode Ping.drawPing | Ping#drawPing}
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
   * @see {@linkcode Ping.animate | Ping#animate}
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

  #ControlsLayer: true;
}

declare namespace ControlsLayer {
  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode Implementation} instead */
  type Any = Internal.Any;

  /** @deprecated There should only be a single implementation of this class in use at one time, use {@linkcode ImplementationClass} instead */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyControlsLayer {}
    interface AnyConstructor extends Identity<typeof AnyControlsLayer> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["layers"]["controls"]["layerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface LayerOptions extends InteractionLayer.LayerOptions {
    name: "controls";
    zIndex: number;
  }

  interface HandlePingOptions extends User.PingData, Ping.ConstructorOptions {}

  /** @internal */
  type _User = InexactPartial<{
    /**
     * The user who pinged.
     * @remarks Only used to set the color of the ping. If `user?.color` ends up `undefined`, the relevant Ping class will provide a default color.
     * If a `color` property is passed along with this, it will take precedence.
     */
    user: User.Implementation;
  }>;

  interface DrawPingOptions extends _User, Pick<User.PingData, "style">, Ping.ConstructorOptions {}

  /** @internal */
  type _DrawOffscreenPingOptions = InexactPartial<{
    /**
     * The style of ping to draw, from {@linkcode CONFIG.Canvas.pings}.
     * @defaultValue `"arrow"`
     * @remarks See {@linkcode User.PingData.style}
     */
    style: User.PingData["style"];
  }>;

  interface DrawOffscreenPingOptions extends Omit<DrawPingOptions, "style">, _DrawOffscreenPingOptions {}

  interface ViewportIntersectionData {
    /** A Ray from the center of the [viewport minus right sidebar] area to the point on the edge of that area in line with an offscreen ping */
    ray: Ray;

    /** The intersection with the viewport edge, or undefined if its on-screen */
    intersection: LineIntersection | undefined;
  }
}

export default ControlsLayer;

declare abstract class AnyControlsLayer extends ControlsLayer {
  constructor(...args: never);
}
