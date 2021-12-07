/**
 * A helper class providing utility methods for PIXI Canvas animation
 */
declare class CanvasAnimation {
  static get ticker(): PIXI.Ticker;

  /**
   * Track an object of active animations by name, context, and function
   * This allows a currently playing animation to be referenced and terminated
   */
  static animations: Partial<
    Record<string, { fn: (dt: number) => void; context: PIXI.Container; resolve: (value: boolean) => void }>
  >;

  /**
   * Apply a linear animation from the current value of some attribute to a new value
   * Resolve a Promise once the animation has concluded and the attributes have reached their new target
   * @param attributes - An array of attributes to animate. Structure of the Array is shown in the example
   * @param options    - Additional options which customize the animation
   *                     (default: `{}`)
   * @returns A Promise which resolves once the linear animation has concluded
   *
   * @example
   * ```typescript
   * let animation = [
   *   {
   *     parent: token,
   *     attribute: x,
   *     to: 1000
   *   },
   *   {
   *     parent: token,
   *     attribute: y,
   *     to: 2000
   *   }
   * ];
   * CanvasAnimation.animateLinear(attributes, {duration:500, ontick: console.log("ticking")});
   * ```
   */
  static animateLinear(
    attributes: CanvasAnimation.Attribute[],
    options?: InexactPartial<LinearAnimationOptions>
  ): Promise<boolean>;

  /**
   * If an animation using a certain name already exists, terminate it
   * @param name - The animation name to terminate
   */
  static terminateAnimation(name: string): void;

  /**
   * Asynchronously animate a transition function and resolve a Promise once the animation has completed
   * @param fn         - A suitable transition function. See PIXI.Ticker for details
   * @param context    - The Canvas container providing scope for the transition
   * @param name       -  Provide a unique animation name which may be referenced later
   * @param attributes - The attributes being animated by the function
   * @param duration   - The duration in milliseconds over which the animation should occur
   * @param ontick     - A function which defines additional behaviors to apply every animation frame
   * @returns A Promise which resolves once the animation has completed
   */
  protected static _animatePromise(
    fn: TransitionFunction,
    context: PIXI.Container,
    name: string,
    attributes: CanvasAnimation.Attribute[],
    duration: number,
    ontick: TickFunction | undefined
  ): Promise<boolean>;

  /**
   * Generic ticker function to implement the animation.
   * This animation wrapper executes once per frame for the duration of the animation event.
   * Once the animated attributes have converged to their targets, it resolves the original Promise.
   * The user-provided ontick function runs each frame update to apply additional behaviors.
   */
  protected static _animateFrame(
    deltaTime: number,
    resolve: (value: boolean) => void,
    reject: (reason?: any) => void,
    attributes: CanvasAnimation.Attribute[],
    duration: number,
    ontick: TickFunction | undefined
  ): void;
}

declare namespace CanvasAnimation {
  interface Attribute {
    parent: any;
    attribute: string;
    to: number;
  }
}

interface LinearAnimationOptions {
  /**
   * An animation context to use which defines scope
   */
  context: PIXI.Container;

  /**
   * Provide a unique animation name which may be referenced later
   */
  name: string;

  /**
   * The duration in milliseconds over which the animation should occur
   * @defaultValue `1000`
   */
  duration: number;

  /**
   * A function which defines additional behaviors to apply every animation frame
   */
  ontick: TickFunction;
}

type TickFunction = (dt: number, attributes: CanvasAnimation.Attribute[]) => void;
type TransitionFunction = (
  dt: number,
  resolve: (value: boolean) => void,
  reject: (reason?: any) => void,
  attributes: CanvasAnimation.Attribute[],
  duration: number,
  ontick?: TickFunction
) => void;
