import type { Identity, InexactPartial } from "#utils";

/**
 * A lightweight screen/object shake utility.
 *
 * CanvasShakeEffect applies a smooth, time-based positional jitter to a target {@linkcode PIXI.DisplayObject}
 * by offsetting its `x` and `y` coordinates relative to a captured reference point. The shake motion is produced
 * using two independent {@linkcode SmoothNoise} generators (one per axis) to avoid harsh, frame-to-frame randomness
 * and provide a more natural camera-like shake.
 *
 * The effect runs for {@linkcode CanvasShakeEffect.duration | #duration} milliseconds, with a linearly decaying
 * amplitude from {@linkcode CanvasShakeEffect.maxDisplacement | #maxDisplacement} down to zero. After the active
 * shake window ends, the target smoothly returns to its reference point using
 * {@linkcode CanvasShakeEffect.returnSpeed | #returnSpeed} as a per-tick interpolation factor.
 *
 * If multiple shake instances target the same object, the newest shake replaces the currently active one using a
 * smooth transition, and the target returns to its original pre-shake position once shaking completes.
 * Important: Changes of `x` and `y` from external sources outside of CanvasShakeEffect are taken into account.
 *
 * Safety/termination conditions:
 * - If the target object is destroyed, the effect stops immediately.
 * - If {@linkcode foundry.canvas.Canvas.photosensitiveMode | Canvas#photosensitiveMode} is enabled, the effect stops
 *   immediately.
 * - If {@linkcode CanvasShakeEffect.maxDisplacement | #maxDisplacement} or
 *   {@linkcode CanvasShakeEffect.duration | #duration} are zero, the effect stops immediately.
 *
 * @example Shake a target for 6 seconds with a 20px peak amplitude
 * ```js
 * const shake = new foundry.canvas.animation.CanvasShakeEffect({
 *   target: canvas.stage,
 *   duration: 6000,
 *   maxDisplacement: 20,
 *   smoothness: 0.6,
 *   returnSpeed: 0.15,
 *   invalidateMasks: true
 * });
 * await shake.play();
 * ```
 *
 * @example Use a custom ticker and a deterministic time offset
 * ```js
 * const shake = new foundry.canvas.animation.CanvasShakeEffect({
 *   target: someContainer,
 *   seed: 12345,
 *   ticker: myTicker
 * });
 * shake.play();
 * ```
 */
declare class CanvasShakeEffect {
  constructor(options?: CanvasShakeEffect.ConstructorOptions);

  /**
   * Duration in ms of the smooth takeover transition when a new shake replaces an active shake.
   * @defaultValue `150`
   */
  static TAKEOVER_DURATION_MS: number;

  /**
   * Total shake duration in MS. After this duration elapses, the effect transitions into a return-to-origin phase.
   */
  duration: number;

  /**
   * Maximum displacement in pixels during the shake. This value is used as the target maximum offset along each
   * axis.
   */
  maxDisplacement: number;

  /**
   * Smoothness parameter in the range [0, 1]. Higher values produce smoother, lower-frequency motion.
   */
  smoothness: number;

  /**
   * Return-to-origin interpolation factor per tick, in the range [0, 1].
   * Higher values restore the target to its reference point more quickly.
   */
  returnSpeed: number;

  /**
   * The deterministic time offset derived from {@linkcode CanvasShakeEffect._ConstructorOptions.seed | #seed}.
   * Applied to the elapsed time before generating noise.
   */
  randomOffset: number;

  /**
   * The ticker time at which the current shake phase began.
   * @privateRemarks Has no field declaration in the class body; it is only created inside
   * {@linkcode play}, and skipped there when the target is already destroyed, so it stays `undefined`
   * until a `play()` call that actually starts.
   */
  startTime?: number | undefined;

  /**
   * Whether the shake effect is currently active.
   */
  get playing(): boolean;

  /**
   * Start the shake effect.
   * Registers a ticker callback and returns a promise that resolves once the effect ends.
   * If the effect is already playing, returns the existing promise (or a resolved one as a fallback).
   * @returns A promise that resolves when the effect completes or is stopped.
   */
  play(): Promise<void>;

  /**
   * Stop the shake effect immediately. Removes the ticker callback, optionally snaps the target back to its base
   * position, and resolves the active promise.
   */
  stop(options?: CanvasShakeEffect.StopOptions): void;

  static #CanvasShakeEffectStatic: true;

  #CanvasShakeEffect: true;
}

declare namespace CanvasShakeEffect {
  interface Any extends AnyCanvasShakeEffect {}
  interface AnyConstructor extends Identity<typeof AnyCanvasShakeEffect> {}

  /** @internal */
  interface _ConstructorOptions {
    /**
     * The target PIXI display object to shake.
     * @defaultValue `canvas.stage`
     */
    target: PIXI.DisplayObject | null;

    /**
     * Total shake duration in MS.
     * @defaultValue `5000`
     */
    duration: number;

    /**
     * Maximum displacement in pixels.
     * @defaultValue `35`
     */
    maxDisplacement: number;

    /**
     * Smoothness in the range [0, 1]. Higher is smoother.
     * @defaultValue `0.5`
     */
    smoothness: number;

    /**
     * "Return to origin" lerp factor per tick in the range [0, 1].
     * @defaultValue `0.1`
     */
    returnSpeed: number;

    /**
     * Should hidden canvas group masks be invalidated each frame?
     * @defaultValue `false`
     */
    invalidateMasks: boolean;

    /**
     * Optional seed used to derive a deterministic time offset.
     * @defaultValue `null`
     */
    seed: number | null;

    /**
     * Optional PIXI ticker.
     * @defaultValue {@linkcode foundry.canvas.animation.CanvasAnimation.ticker | CanvasAnimation.ticker}
     */
    ticker: PIXI.Ticker | null;
  }

  /** Options for the {@linkcode CanvasShakeEffect} constructor */
  interface ConstructorOptions extends InexactPartial<_ConstructorOptions> {}

  /** @internal */
  interface _StopOptions {
    /**
     * Snap the target back to its base position.
     * @defaultValue `true`
     */
    snap: boolean;

    /**
     * Release the target shake state if no other shake is active.
     * @defaultValue `true`
     */
    release: boolean;
  }

  interface StopOptions extends InexactPartial<_StopOptions> {}
}

export default CanvasShakeEffect;

declare abstract class AnyCanvasShakeEffect extends CanvasShakeEffect {
  constructor(...args: never);
}
