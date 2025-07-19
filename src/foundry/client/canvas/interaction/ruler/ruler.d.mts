import type { FixedInstanceType, Identity, InexactPartial } from "#utils";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { BaseRuler } from "../_module.d.mts";
import type { BaseGrid } from "#common/grid/_module.d.mts";

/**
 * The default implementation of the Ruler.
 */
declare class Ruler extends BaseRuler {
  constructor(user: User.Implementation);

  /**
   * A handlebars template used to render each waypoint label.
   * @defaultValue `"templates/hud/waypoint-label.hbs"`
   */
  static WAYPOINT_LABEL_TEMPLATE: string;

  /**
   * Configure the properties of the outline.
   * Called in {@linkcode Ruler.draw | Ruler#draw}.
   * @returns The thickness in pixels and the color
   */
  protected _configureOutline(): Ruler.ConfigureOutlineReturn;

  override draw(): Promise<void>;

  override destroy(): void;

  protected override _refresh(): void;

  /**
   * Get the context used to render a ruler waypoint label
   * @remarks `Ruler##renderWaypointLabels` always starts by passing an empty object for `state`, but the parameter itself has no default
   */
  protected _getWaypointLabelContext(
    waypoint: Ruler.Waypoint,
    state: Ruler.WaypointContextState,
  ): Ruler.WaypointContext | void;

  /**
   * Get the style of the waypoint at the given waypoint.
   * @param waypoint - The waypoint
   * @returns The radius, color, and alpha of the waypoint
   * @remarks `waypoint` is unused in core's implementation as of 13.346
   */
  protected _getWaypointStyle(waypoint: Ruler.Waypoint): Ruler.WaypointStyle;

  /**
   * Get the style of the segment from the previous to the given waypoint.
   * @param waypoint - The waypoint
   * @returns The line width, color, and alpha of the segment
   * @remarks `waypoint` is unused in core's implementation as of 13.346
   */
  protected _getSegmentStyle(waypoint: Ruler.Waypoint): Ruler.SegmentStyle;

  /**
   * @deprecated "`Ruler#color` is deprecated. Use {@linkcode Ruler.user | Ruler#user#color} instead." (since v13, until v15)
   * @remarks Pulling `color` from {@linkcode Ruler._getWaypointStyle | #_getWaypointStyle()} or
   * {@linkcode Ruler._getSegmentStyle | #_getSegmentStyle()} as appropriate would be the more accurate replacement
   */
  get color(): Color;

  /**
   * @deprecated "`Ruler#ruler` is deprecated without replacement." (since v13, until v15)
   */
  get ruler(): PIXI.Graphics;

  #Ruler: true;
}

declare namespace Ruler {
  interface Any extends AnyRuler {}
  interface AnyConstructor extends Identity<typeof AnyRuler> {}

  interface ImplementationClass extends Identity<CONFIG["Canvas"]["rulerClass"]> {}
  interface Implementation extends FixedInstanceType<ImplementationClass> {}

  /** @deprecated Use {@linkcode ImplementationClass} instead */
  type ConfiguredClass = ImplementationClass;

  /** @deprecated Use {@linkcode Implementation} instead */
  type ConfiguredInstance = Implementation;

  interface ConfigureOutlineReturn {
    thickness: number;
    color: PIXI.ColorSource;
  }

  interface Waypoint {
    /** The x-coordinate in pixels */
    x: number;

    /** The y-coordinate in pixels */
    y: number;

    /** The elevation in grid units */
    elevation: number;

    /** The index of the waypoint */
    index: number;

    /**
     * The ray from the center point of previous to the center point of this waypoint,
     * or null if there is no previous waypoint.
     */
    ray: Ray | null;

    /** The measurements at this waypoint. */
    measurement: BaseGrid.MeasurePathResultWaypoint;

    /** The previous waypoint, if any. */
    previous: Waypoint;

    /** The next waypoint, if any. */
    next: Waypoint;
  }

  /**
   * @remarks The type of the `state` param passed to {@linkcode Ruler._getWaypointLabelContext | Ruler#_getWaypointLabelContext}.
   * It gets passed initially empty, and is mutated and shared between each call to that method made in `Ruler##renderWaypointLabels`.
   */
  interface WaypointContextState {
    /**
     * @remarks Gets set `true` the first time a waypoint has non-`0` elevation and remains `true` from then on, within
     * the context of a single `##renderWaypointLabels` call
     */
    hasElevation?: boolean | undefined;
  }

  interface WaypointContext {
    action: string;
    cssClass: string;
    secret: boolean;
    units: string;
    uiScale: number;
    position: {
      x: number;
      y: number;
    };
    distance: SegmentDistance;
    elevation: ElevationContext;
  }

  /**
   * {@linkcode SegmentDistance} and {@linkcode ElevationContext} (and {@linkcode foundry.canvas.placeables.tokens.TokenRuler.SegmentCost | TokenRuler.SegmentCost})
   * all will include the {@linkcode Number.signedString | .signedString()} of the difference in the property they're describing
   * @internal
   */
  type _DeltaString = InexactPartial<{
    delta: string;
  }>;

  interface SegmentDistance extends _DeltaString {
    total: string;
  }

  interface ElevationContext extends _DeltaString {
    total: number;
    icon: string;
    hidden: boolean;
  }

  /**
   * {@linkcode WaypointStyle} and {@linkcode SegmentStyle} both have defaults applied to these properties when read in
   * `Ruler##drawPath` and `TokenRuler##drawPath`, via:
   * ```js
   * // WaypointStyle:
   * const {radius, color=0xFFFFFF, alpha=1} = this._getWaypointStyle(waypoint);
   * // SegmentStyle:
   * let {width, color=0xFFFFFF, alpha=1} = this._getSegmentStyle(waypoint)
   * ```
   * @internal
   */
  type _StylePropsWithDefaults = InexactPartial<{
    /**
     * @defaultValue `0xFFFFFF`
     * @remarks The above default is the value if the implementation of {@linkcode Ruler._getWaypointStyle | Ruler#_getWaypointStyle}
     * or {@linkcode foundry.canvas.placeables.tokens.TokenRuler._getWaypointStyle | TokenRuler#_getWaypointStyle} being used provides
     * no value/`undefined` for this property. The effective defaults in core's implementations are {@linkcode Ruler.user | this.user.color}
     * and `game.users.get(waypoint.userId)?.color ?? 0x000000`, respectively
     */
    color: PIXI.ColorSource;

    /**
     * @defaultValue `1`
     * @remarks The above default is the value if the implementation of {@linkcode Ruler._getWaypointStyle | Ruler#_getWaypointStyle}
     * or {@linkcode foundry.canvas.placeables.tokens.TokenRuler._getWaypointStyle | TokenRuler#_getWaypointStyle} being used provides
     * no value/`undefined` for this property. It is *also* the default value core's implementations provide in both cases.
     */
    alpha: number;
  }>;

  interface WaypointStyle extends _StylePropsWithDefaults {
    radius: number;
  }

  interface SegmentStyle extends _StylePropsWithDefaults {
    width: number;
  }

  // BaseRuler interfaces it'd be convenient to not need a second import for
  export import RENDER_FLAGS = foundry.canvas.interaction.BaseRuler.RENDER_FLAGS;
  export import Path = foundry.canvas.interaction.BaseRuler.Path;
  export import UpdateData = foundry.canvas.interaction.BaseRuler.UpdateData;
  export import AddDragWaypointOptions = foundry.canvas.interaction.BaseRuler.AddDragWaypointOptions;
  export import ChangeDragElevationOptions = foundry.canvas.interaction.BaseRuler.ChangeDragElevationOptions;
}

export default Ruler;

declare abstract class AnyRuler extends Ruler {
  constructor(...args: never);
}
