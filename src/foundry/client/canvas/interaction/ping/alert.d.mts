import type { Identity } from "#utils";
import type { PulsePing } from "#client/canvas/interaction/_module.d.mts";

/**
 * A type of ping that produces a pulse warning sign animation.
 */
declare class AlertPing extends PulsePing {
  /**
   * @param origin  - The canvas coordinates of the origin of the ping.
   * @param options - Additional options to configure the ping animation.
   */
  constructor(origin: PIXI.Point, options: AlertPing.ConstructorOptions);

  protected override _drawShape(g: PIXI.Graphics, color: number | Color, alpha: number, size: number): void;
}

declare namespace AlertPing {
  interface Any extends AnyAlertPing {}
  interface AnyConstructor extends Identity<typeof AnyAlertPing> {}

  /** @privateRemarks Only exists to change the default value of `color` */
  interface ConstructorOptions extends PulsePing.ConstructorOptions {
    /**
     * @defaultValue `"#ff0000"`
     * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key,
     * and passing either to `Color.from` produces a `Color(NaN)`, which may cause breakage in subclasses or when
     * passed to PIXI methods
     * @privateRemarks Typing this as `Ping.ConstructorOptions["color"]` breaks, because it thinks `| undefined` has snuck in for unknown reasons
     */
    color?: Color.Source;
  }
}

export default AlertPing;

declare abstract class AnyAlertPing extends AlertPing {
  constructor(...args: never);
}
