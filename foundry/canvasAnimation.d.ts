/**
 * A helper class providing utility methods for PIXI Canvas animation
 */
declare class CanvasAnimation {
  static get ticker(): PIXI.Ticker;

  /**
   * Apply a linear animation from the current value of some attribute to a new value
   * Resolve a Promise once the animation has concluded and the attributes have reached their new target
   * @param attributes - An array of attributes to animate. Structure of the Array is shown in the example
   * @param context    - An animation context to use which defines scope
   * @param name       - Provide a unique animation name which may be referenced later (default: `null`)
   * @param duration   - The duration in milliseconds over which the animation should occur (default: `1000`)
   * @param ontick     - A function which defines additional behaviors to apply every animation frame
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
    {
      context,
      name,
      duration,
      ontick
    }: {
      context: PIXI.Container;
      name?: string | null;
      duration?: number;
      ontick: (dt: number, attributes: CanvasAnimation.Attribute[]) => void;
    }
  ): Promise<void>;

  /**
   * If an animation using a certain name already exists, terminate it
   * @param name - The animation name to terminate
   */
  static terminateAnimation(name: string): void;

  /**
   * Asynchronously animate a transition function and resolve a Promise once the animation has completed
   * @param fn      - A suitable transition function. See PIXI.Ticker for details
   * @param context - The Canvas container providing scope for the transition
   * @param name    - Provide a unique animation name which may be referenced later
   * @param args    - Variable argument passed to the transition function each frame
   * @returns A Promise which resolves once the animation has completed
   */
  protected static _animatePromise(
    fn: (dt: number, resolve: () => void, reject: (reason?: any) => void, ...args: any[]) => void,
    context: PIXI.Container,
    name: string,
    ...args: any[]
  ): Promise<void>;

  /**
   * Generic ticker function to implement the animation.
   * This animation wrapper executes once per frame for the duration of the animation event.
   * Once the animated attributes have converged to their targets, it resolves the original Promise.
   * The user-provided ontick function runs each frame update to apply additional behaviors.
   */
  protected static _animateFrame(
    deltaTime: number,
    resolve: () => void,
    reject: (reason?: any) => void,
    attributes: CanvasAnimation.Attribute[],
    duration: number,
    ontick: (dt: number, attributes: CanvasAnimation.Attribute[]) => void
  ): void;

  /**
   * Track an object of active animations by name, context, and function
   * This allows a currently playing animation to be referenced and terminated
   */
  static animations: Record<string, [(dt: number) => unknown, PIXI.Container]>;
}

declare namespace CanvasAnimation {
  interface Attribute {
    parent: any;
    attribute: string;
    to: number;
  }
}
