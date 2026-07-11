import type { FixedInstanceType, Identity, InexactPartial } from "#utils";
import type { Ruler } from "#client/canvas/interaction/_module.d.mts";
import type { BaseTokenRuler } from "#client/canvas/placeables/tokens/_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";

declare class TokenRuler extends BaseTokenRuler {
  /**
   * A handlebars template used to render each waypoint label.
   * @defaultValue `"templates/hud/waypoint-label.hbs"`
   */
  static WAYPOINT_LABEL_TEMPLATE: string;

  protected override _onVisibleChange(): void;

  /**
   * Configure the properties of the outline.
   * Called in {@linkcode TokenRuler.draw | TokenRuler#draw}.
   * @returns The thickness in pixels and the color
   */
  protected _configureOutline(): TokenRuler.Outline;

  /**
   * Configure the properties of the dash line.
   * Called in {@linkcode TokenRuler.draw | TokenRuler#draw}.
   * @returns The dash in pixels, the gap in pixels, and the speed in pixels per second
   */
  protected _configureDashLine(): TokenRuler.DashLine;

  draw(): Promise<void>;

  clear(): void;

  destroy(): void;

  refresh(rulerData: TokenRuler.Data): void;

  /**
   * Get the context used to render a ruler waypoint label.
   */
  protected _getWaypointLabelContext(
    waypoint: TokenRuler.Waypoint,
    state: TokenRuler.State,
  ): TokenRuler.WaypointContext | void;

  /**
   * Get the style of the waypoint at the given waypoint.
   * @param waypoint - The waypoint
   * @returns The radius, color, and alpha of the waypoint. If the radius is 0, no waypoint marker is drawn.
   */
  protected _getWaypointStyle(waypoint: TokenRuler.Waypoint): Ruler.WaypointStyle;

  /**
   * Get the style of the segment from the previous to the given waypoint.
   * @param waypoint - The waypoint
   * @returns The line width, color, and alpha of the segment.  If the width is 0, no segment is drawn.
   */
  protected _getSegmentStyle(waypoint: TokenRuler.Waypoint): Ruler.SegmentStyle;

  /**
   * Get the style to be used to highlight the grid offset.
   * @param waypoint - The waypoint
   * @param offset   - An occupied grid offset at the given waypoint that is to be highlighted
   * @returns The color, alpha, texture, and texture matrix to be used to draw the grid space.
   *          If the alpha is 0, the grid space is not highlighted.
   */
  protected _getGridHighlightStyle(
    waypoint: TokenRuler.Waypoint,
    offset: BaseGrid.Offset3D,
  ): TokenRuler.GridHighlightStyle;

  #TokenRuler: true;
}

declare namespace TokenRuler {
  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode Implementation} instead. This type will be removed in v15.
   */
  type Any = Internal.Any;

  /**
   * @deprecated There should only be a single implementation of this class in use at one time,
   * use {@linkcode ImplementationClass} instead. This type will be removed in v15.
   */
  type AnyConstructor = Internal.AnyConstructor;

  namespace Internal {
    interface Any extends AnyTokenRuler {}
    interface AnyConstructor extends Identity<typeof AnyTokenRuler> {}
  }

  interface ImplementationClass extends Identity<CONFIG["Token"]["rulerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  interface Outline {
    /** The thickness in pixels */
    thickness: number;

    color: PIXI.ColorSource;
  }

  interface DashLine {
    /** @remarks Dash length in pixels. */
    dash: number;

    /** @remarks Gap length in pixels. */
    gap: number;

    /** @remarks In pixels per second. */
    speed: number;
  }

  interface Data {
    /**
     * The waypoints that were already passed by the Token
     */
    passedWaypoints: TokenDocument.MeasuredMovementWaypoint[];

    /**
     * The waypoints that the Token will try move to next
     */
    pendingWaypoints: TokenDocument.MeasuredMovementWaypoint[];

    /**
     * Movement planned by Users
     * @remarks Keys are User IDs.
     */
    plannedMovement: Record<string, foundry.canvas.placeables.Token.PlannedMovement>;
  }

  interface WaypointData {
    /** The config of the movement action */
    actionConfig: CONFIG.Token.Movement.ActionConfig;

    /** The ID of movement, or null if planned movement. */
    movementId: string | null;

    /** The index of the waypoint, which is equal to the number of explicit waypoints from the first to this waypoint. */
    index: number;

    /** The stage this waypoint belongs to */
    stage: "passed" | "pending" | "planned";

    /** Is this waypoint hidden? */
    hidden: boolean;

    /** Is this waypoint unreachable? */
    unreachable: boolean;

    /** The center point of the Token at this waypoint. */
    center: PIXI.Point;

    /** The size of the Token in pixels at this waypoint. */
    size: {
      width: number;
      height: number;
    };

    /** The ray from the center point of previous to the center point of this waypoint, or null if there is no previous waypoint. */
    ray: Ray | null;

    /** The measurements at this waypoint. */
    measurement: BaseGrid.MeasurePathResultWaypoint;

    /** The previous waypoint, if any. */
    previous: Waypoint | null;

    /** The next waypoint, if any. */
    next: Waypoint | null;
  }

  /**
   * @remarks This is not intended to be mutated, so foundry has marked it DeepReadonly,
   * but there's no programmatic block on mutation
   */
  interface Waypoint extends Omit<TokenDocument.MeasuredMovementWaypoint, "movementId">, WaypointData {}

  /**
   * @remarks Intended to be extended by subclasses that need to track additional info between waypoints
   * Importantly, this is *not* saved to the token's movement data, instead it is merely mutated locally.
   */
  interface State {
    initialized?: boolean | undefined;
    hasElevation?: boolean | undefined;
    previousElevation?: number;
  }

  /**
   * @remarks Fed into the template
   */
  interface WaypointContext extends Ruler.WaypointContext {
    cost: SegmentCost;
  }

  interface SegmentCost extends InexactPartial<Ruler._DeltaString> {
    total: string;
    units: string;
  }

  interface GridHighlightStyle {
    color?: PIXI.ColorSource | undefined;
    alpha?: number | undefined;
    texture?: PIXI.Texture | undefined;
    matrix?: PIXI.Matrix | null | undefined;
  }
}

export default TokenRuler;

declare abstract class AnyTokenRuler extends TokenRuler {
  constructor(...args: never);
}
