export {};

declare global {
  interface CanvasAnimationAttribute {
    /** The attribute name being animated */
    attribute: string;

    /** The object within which the attribute is stored */
    parent: object;

    /** The destination value of the attribute */
    to: number;

    /** An initial value of the attribute, otherwise parent[attribute] is used */
    from?: number;

    /** The computed delta between to and from */
    delta?: number;

    /** The amount of the total delta which has been animated */
    done?: number;
  }

  interface CanvasAnimationOptions {
    /** A DisplayObject which defines context to the PIXI.Ticker function */
    context?: PIXI.DisplayObject;

    /** A unique name which can be used to reference the in-progress animation */
    name?: string;

    /** A duration in milliseconds over which the animation should occur */
    duration?: number;

    /**
     * A priority in PIXI.UPDATE_PRIORITY which defines when the animation
     * should be evaluated related to others
     */
    priority?: number;

    /**
     * An easing function used to translate animation time or the string name
     * of a static member of the CanvasAnimation class
     */
    easing?: ((pt: number) => number) | string;

    /** A callback function which fires after every frame */
    ontick?: (dt: number, animation: CanvasAnimationData) => void;
  }

  interface CanvasAnimationData {
    /** The animation function being executed each frame */
    fn: (dt: number) => void;

    /** The current time of the animation, in milliseconds */
    time: number;

    /** The attributes being animated */
    attributes: CanvasAnimationAttribute[];

    /** A Promise which resolves once the animation is complete */
    promise: Promise<boolean>;

    /** The resolution function, allowing animation to be ended early */
    resolve: (value: boolean) => void;

    /** The rejection function, allowing animation to be ended early */
    reject: (err: unknown) => void;
  }

  /**
   * A helper class providing utility methods for PIXI Canvas animation
   */
  class CanvasAnimation {
    static get ticker(): PIXI.Ticker;

    /**
     * Track an object of active animations by name, context, and function
     * This allows a currently playing animation to be referenced and terminated
     */
    static animations: Record<string, CanvasAnimationData>;

    /**
     * Apply an animation from the current value of some attribute to a new value
     * Resolve a Promise once the animation has concluded and the attributes have reached their new target
     *
     * @param attributes - An array of attributes to animate
     * @param options    - Additional options which customize the animation
     *
     * @returns A Promise which resolves to true once the animation has concluded
     *          or false if the animation was prematurely terminated
     *
     * @example Animate Token Position
     * ```javascript
     * let animation = [
     *   {
     *     parent: token,
     *     attribute: "x",
     *     to: 1000
     *   },
     *   {
     *     parent: token,
     *     attribute: "y",
     *     to: 2000
     *   }
     * ];
     * CanvasAnimation.animate(attributes, {duration:500});
     * ```
     */
    static animate(
      attributes: CanvasAnimationAttribute[],
      { context, name, duration, easing, ontick, priority }?: CanvasAnimationOptions
    ): Promise<boolean | void>;

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
     * Retrieve an animation currently in progress by its name
     * @param name - The animation name to retrieve
     * @returns The animation data, or undefined
     */
    static getAnimation(name: string): CanvasAnimationData | undefined;

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
      resolve: CanvasAnimationData["resolve"],
      reject: (reason?: any) => void,
      attributes: CanvasAnimation.Attribute[],
      duration: number,
      ontick: TickFunction | undefined
    ): void;
  }

  namespace CanvasAnimation {
    interface Attribute {
      attribute: string;
      d?: number;
      delta?: number;
      done?: number;
      parent: any;
      remaining?: number;
      to: number;
    }
  }
}

interface LinearAnimationOptions {
  /**
   * An animation context to use which defines scope
   */
  context: PIXI.DisplayObject;

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
  resolve: CanvasAnimationData["resolve"],
  reject: (reason?: any) => void,
  attributes: CanvasAnimation.Attribute[],
  duration: number,
  ontick?: TickFunction
) => void;
