import type { Identity, IntentionalPartial, RemoveIndexSignatures } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";

/**
 * A class to manage a user ping on the canvas.
 * @privateRemarks Foundry doesn't mark this abstract, but because of {@linkcode animate} always passing a bound {@linkcode _animateFrame},
 * and the implementation here just throws, it is effectively abstract.
 */
declare abstract class Ping extends PIXI.Container {
  /**
   * @param origin  - The canvas coordinates of the origin of the ping.
   * @param options - Additional options to configure the ping animation.
   */
  constructor(origin: Canvas.Point, options?: Ping.ConstructorOptions);

  options: Ping.ConstructorOptions;

  /**
   * The color of the ping
   * @defaultValue {@linkcode Color.from | Color.from("#ff6400")}
   */
  protected _color: Color;

  /** @remarks Passing `options: boolean` is disallowed, as the body does `options.children = true` */
  override destroy(options?: PIXI.IDestroyOptions): void;

  /**
   * Start the ping animation.
   * @returns Returns true if the animation ran to completion, false otherwise.
   * @privateRemarks This calls {@linkcode CanvasAnimation.animate} with an empty attribute array for the first argument,
   * meaning no chance of early return, so no `| void` in the return type
   */
  animate(): Promise<boolean>;

  /**
   * On each tick, advance the animation.
   * @param dt        - The number of ms that elapsed since the previous frame.
   * @param animation - The animation state.
   * @remarks Simply throws in {@linkcode Ping}; subclasses must implement a valid {@linkcode CanvasAnimation.OnTickFunction}
   */
  protected abstract _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void;
}

declare namespace Ping {
  interface Any extends AnyPing {}
  interface AnyConstructor extends Identity<typeof AnyPing> {}

  type ConfiguredStyles = keyof RemoveIndexSignatures<typeof CONFIG.Canvas.pings.styles>;

  /** @internal */
  type _ConstructorOptions = IntentionalPartial<{
    /**
     * The duration of the animation in milliseconds.
     * @defaultValue `900`
     * @remarks Can't be `undefined` because the default is provided via `mergeObject`
     *
     * See {@linkcode CanvasAnimation.AnimateOptions.duration}
     */
    duration: number;

    /**
     * The size of the ping graphic.
     * @defaultValue `128`
     * @remarks Can't be `undefined` because the default is provided via `mergeObject`
     */
    size: number;

    /**
     * The color of the ping graphic.
     * @defaultValue `"#ff6400"`
     * @remarks Can't be `undefined` because the default is provided via `mergeObject`
     */
    color: Color.Source;

    /**
     * The name for the ping animation to pass to {@linkcode CanvasAnimation.animate}.
     *
     * See {@linkcode CanvasAnimation.AnimateOptions.name}
     */
    name: PropertyKey | undefined;
  }>;

  interface ConstructorOptions extends Ping._ConstructorOptions {}
}

export default Ping;

declare abstract class AnyPing extends Ping {
  constructor(...args: never);
}
