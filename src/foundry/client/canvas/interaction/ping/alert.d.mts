import type { Identity, IntentionalPartial } from "#utils";
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

  /** @internal */
  interface _ConstructorOptions extends PulsePing._ConstructorOptionsBase {
    /**
     * The color of the ping graphic.
     * @defaultValue `"#ff0000"`
     * @remarks Can be `undefined`; the default is provided by destructuring, not `mergeObject`
     */
    color: Color.Source | undefined;
  }

  interface ConstructorOptions extends IntentionalPartial<_ConstructorOptions> {}
}

export default AlertPing;

declare abstract class AnyAlertPing extends AlertPing {
  constructor(...args: never);
}
