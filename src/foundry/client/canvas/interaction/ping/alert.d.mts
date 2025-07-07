import type { Identity, InexactPartial } from "#utils";
import type { PulsePing } from "#client/canvas/interaction/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A type of ping that produces a pulse warning sign animation.
 */
declare class AlertPing extends PulsePing {
  /**
   * @param origin  - The canvas coordinates of the origin of the ping.
   * @param options - Additional options to configure the ping animation.
   */
  constructor(origin: Canvas.Point, options?: AlertPing.ConstructorOptions);

  protected override _drawShape(g: PIXI.Graphics, color: number, alpha: number, size: number): void;
}

declare namespace AlertPing {
  interface Any extends AnyAlertPing {}
  interface AnyConstructor extends Identity<typeof AnyAlertPing> {}

  /**
   * Only exists to change the default value of `color`
   * @internal
   */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The color of the ping graphic.
     * @defaultValue `"#ff0000"`
     */
    color: Color.Source;
  }>;

  interface ConstructorOptions extends Omit<PulsePing.ConstructorOptions, "color">, _ConstructorOptions {}
}

export default AlertPing;

declare abstract class AnyAlertPing extends AlertPing {
  constructor(...args: never);
}
