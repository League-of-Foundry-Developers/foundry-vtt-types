import type { Identity, InexactPartial } from "#utils";
import type { PulsePing } from "#client/canvas/interaction/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";

/**
 * A type of ping that produces an arrow pointing in a given direction.
 */
declare class ArrowPing extends PulsePing {
  /**
   * @param origin - The canvas coordinates of the origin of the ping. This becomes the arrow's tip.
   * @param options - Additional options to configure the ping animation.
   */
  constructor(origin: Canvas.Point, options?: ArrowPing.ConstructorOptions);

  // @privateRemarks The `options` property does not get overridden here as the `rotation` key does not
  // get passed up to super, so it's still just `PulsePing.Constructor.Options`

  protected override _drawShape(g: PIXI.Graphics, color: number, alpha: number, size: number): void;
}

declare namespace ArrowPing {
  interface Any extends AnyArrowPing {}
  interface AnyConstructor extends Identity<typeof AnyArrowPing> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The angle of the arrow in radians.
     * @defaultValue `0`
     */
    rotation: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions, PulsePing.ConstructorOptions {}
}

export default ArrowPing;

declare abstract class AnyArrowPing extends ArrowPing {
  constructor(...args: never);
}
