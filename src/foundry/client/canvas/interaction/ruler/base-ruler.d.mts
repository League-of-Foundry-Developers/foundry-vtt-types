import type { Identity, InexactPartial, IntentionalPartial, MaybePromise } from "#utils";
import type { RenderFlagsMixin, RenderFlag } from "../render-flags.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PIXI } from "#configuration";

/**
 * The ruler that is used to measure distances on the Canvas.
 */
declare abstract class BaseRuler extends RenderFlagsMixin() {
  /**
   * @param user - The User for whom to construct the Ruler instance
   */
  constructor(user: User.Implementation);

  static override RENDER_FLAGS: BaseRuler.RENDER_FLAGS;

  /**
   * Is the Ruler ready to measure?
   */
  static get canMeasure(): boolean;

  /**
   * Snaps the given point to the grid.
   * @param point - The point that is to be snapped
   * @returns The snapped point
   * @remarks Despite forwarding to {@linkcode foundry.grid.BaseGrid.getSnappedPoint | canvas.grid.getSnappedPoint},
   * since this only takes `{x, y}` in, it will only return `{x, y}`, never with `elevation`
   */
  static getSnappedPoint(point: Canvas.Point): Canvas.Point;

  /**
   * The User who this Ruler belongs to.
   */
  get user(): User.Implementation;

  /**
   * Is this Ruler active? True, if the path of the Ruler is nonempty.
   */
  get active(): boolean;

  /**
   * The Ruler is visible if it is active and either not hidden or its User is the current User.
   */
  get visible(): boolean;

  /**
   * The sequence of points that the Ruler measures.
   * @defaultValue `[]`
   * @remarks The `path` setter freezes both the outer array and each element
   */
  get path(): BaseRuler.Path;

  set path(value);

  /**
   * The first point of the path, or undefined if the path is empty.
   */
  get origin(): Canvas.ElevatedPoint | undefined;

  /**
   * The last point of the path, or undefined if the path is empty.
   * @remarks Returns `this.#path.at(-1)`, so could be the same as {@linkcode origin | #origin} if the path is
   * only one point long for whatever reason
   */
  get destination(): Canvas.ElevatedPoint | undefined;

  /**
   * Is this Ruler hidden? If true, only the User of the Ruler can see it.
   * @defaultValue `false`
   */
  get hidden(): boolean;

  set hidden(value);

  /**
   * Called when the Ruler's path has changed.
   */
  protected _onPathChange(): void;

  /**
   * Called when the Ruler becomes hidden or unhidden.
   */
  protected _onHiddenChange(): void;

  /**
   * Reset the path and the hidden state of the Ruler.
   */
  reset(): void;

  /**
   * Draw the Ruler.
   */
  abstract draw(): MaybePromise<void>;

  /**
   * Destroy the Ruler.
   */
  abstract destroy(): void;

  /**
   * Refresh the Ruler.
   */
  refresh(): void;

  /**
   * Refresh the Ruler.
   */
  protected abstract _refresh(): void;

  override applyRenderFlags(): void;

  /**
   * Add a waypoint.
   * @param point   - The (unsnapped) waypoint
   * @param options - Additional options
   */
  protected _addDragWaypoint(point: Canvas.Point, options?: BaseRuler.AddDragWaypointOptions): void;

  /**
   * Remove the second to last waypoint.
   */
  protected _removeDragWaypoint(): void;

  /**
   * Change the elevation of the destination.
   * @param delta   - The number vertical steps
   * @param options - Additional options
   */
  protected _changeDragElevation(delta: number, options?: BaseRuler.ChangeDragElevationOptions): void;

  /**
   * Handle the beginning of a new Ruler measurement workflow.
   * @param event - The drag start event
   */
  protected _onDragStart(event: PIXI.FederatedEvent): void;

  /**
   * Handle the end of the Ruler measurement workflow
   * @param event - The drag cancel event
   * @returns If false, the cancellation of the drag workflow is prevented
   */
  protected _onDragCancel(event: PIXI.FederatedEvent): boolean | void;

  /**
   * Handle left-click events on the Canvas during Ruler measurement.
   * @param event - The pointer-down event
   */
  protected _onClickLeft(event: PIXI.FederatedEvent): void;

  /**
   * Handle right-click events on the Canvas during Ruler measurement.
   * @param event - The pointer-down event
   */
  protected _onClickRight(event: PIXI.FederatedEvent): void;

  /**
   * Continue a Ruler measurement workflow for left-mouse movements on the Canvas.
   * @param event - The mouse move event
   */
  protected _onMouseMove(event: PIXI.FederatedEvent): void;

  /**
   * Conclude a Ruler measurement workflow by releasing the left-mouse button.
   * @param event - The pointer-up event
   */
  protected _onMouseUp(event: PIXI.FederatedEvent): void;

  /**
   * Adjust the elevation of Ruler waypoints by scrolling up/down.
   * @param event - The mousewheel event
   */
  protected _onMouseWheel(event: WheelEvent): void;

  /**
   * @deprecated "`BaseRuler#clear` is deprecated in favor of {@linkcode BaseRuler.reset | BaseRuler#reset}." (since v13, until v15)
   */
  clear(): void;

  /**
   * @deprecated "`BaseRuler#update` is deprecated. Set {@linkcode BaseRuler.path | BaseRuler#path}
   * and {@linkcode BaseRuler.hidden | BaseRuler#hidden} instead." (since v13, until v15)
   */
  update(data?: BaseRuler.UpdateData): void;

  #BaseRuler: true;
}

declare namespace BaseRuler {
  interface Any extends AnyBaseRuler {}
  interface AnyConstructor extends Identity<typeof AnyBaseRuler> {}

  interface RENDER_FLAGS extends RenderFlagsMixin.RENDER_FLAGS {
    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }

  type Path = ReadonlyArray<Readonly<Canvas.ElevatedPoint>>;

  /** @internal */
  type _AddDragWaypointOptions = InexactPartial<{
    /**
     * Snap the added waypoint?
     * @defaultValue `false`
     */
    snap: boolean;
  }>;

  interface AddDragWaypointOptions extends _AddDragWaypointOptions {}

  /** @internal */
  type _ChangeDragElevationOptions = InexactPartial<{
    /**
     * Round elevations to multiples of the grid distance divided by {@linkcode CONFIG.Canvas.elevationSnappingPrecision}?
     * If false, rounds to multiples of the grid distance.
     * @defaultValue `false`
     */
    precise: boolean;
  }>;

  interface ChangeDragElevationOptions extends _ChangeDragElevationOptions {}

  /** @internal */
  type _UpdateData = IntentionalPartial<{
    /**
     * @defaultValue `[]`
     * @remarks Can't be `undefined` because of an `in` check.
     */

    path: Canvas.ElevatedPoint[];

    /**
     * @defaultValue `false`
     * @remarks Can't be `undefined` because of an `in` check.
     */
    hidden: boolean;
  }>;

  interface UpdateData extends _UpdateData {}
}

export default BaseRuler;

declare abstract class AnyBaseRuler extends BaseRuler {
  constructor(...args: never);
}
