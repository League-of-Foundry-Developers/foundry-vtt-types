import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { Identity } from "#utils";
import type { Ping } from "#client/canvas/interaction/_module.d.mts";

/**
 * A type of ping that points to a specific location.
 */
declare class ChevronPing extends Ping {
  /**
   * @param origin  - The canvas coordinates of the origin of the ping.
   * @param options - Additional options to configure the ping animation. (default: see {@linkcode Ping.ConstructorOptions})
   */
  constructor(origin: Canvas.Point, options?: Ping.ConstructorOptions);

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _r: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _rInner: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _t14: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _t12: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _t34: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _inner: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _outer: never;

  /**
   * The path to the chevron texture.
   * @defaultValue `"icons/pings/chevron.webp"`
   * @remarks Unusually for Foundry, this is referred to by `ChevronPing.`, not `this.constructor.`, in
   * `##loadChevron`, so subclasses *cannot* specify other values, and changing this value affects *all*
   * chevrons.
   */
  static CHEVRON_PATH: string;

  override animate(): Promise<boolean>;

  protected override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _drawRings(a: never): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _loadChevron(): never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _createRings(): never;
}

declare namespace ChevronPing {
  interface Any extends AnyChevronPing {}
  interface AnyConstructor extends Identity<typeof AnyChevronPing> {}
}

export default ChevronPing;

declare abstract class AnyChevronPing extends ChevronPing {
  constructor(...args: never);
}
