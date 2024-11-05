import type { ValueOf } from "../../../../../types/utils.d.mts";

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

    /** Is this a color animation that applies to RGB channels */
    color?: boolean;
  }

  interface CanvasAnimationOptions {
    /** A DisplayObject which defines context to the PIXI.Ticker function */
    context?: PIXI.DisplayObject;

    /** A unique name which can be used to reference the in-progress animation */
    name?: string | symbol;

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

  interface CanvasAnimationData extends CanvasAnimationOptions {
    /** The animation function being executed each frame */
    fn: (dt: number) => void;

    /** The current time of the animation, in milliseconds */
    time: number;

    /** The attributes being animated */
    attributes: CanvasAnimationAttribute[];

    /** The current state of the animation */
    state: ValueOf<typeof CanvasAnimation.STATES>;

    /** A Promise which resolves once the animation is complete */
    promise: Promise<boolean>;

    /** The resolution function, allowing animation to be ended early */
    resolve: (value: boolean) => void;

    /** The rejection function, allowing animation to be ended early */
    reject: (err: Error) => void;
  }

  /**
   * A helper class providing utility methods for PIXI Canvas animation
   */
  class CanvasAnimation {
    static get STATES(): {
      /** An error occurred during waiting or running the animation. */
      FAILED: -2;

      /** The animation was terminated before it could complete. */
      TERMINATED: -1;

      /** Waiting for the wait promise before the animation is started. */
      WAITING: 0;

      /** The animation has been started and is running. */
      RUNNING: 1;

      /** The animation was completed without errors and without being terminated. */
      COMPLETED: 2;
    };

    /**
     * The ticker used for animations.
     */
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
      { context, name, duration, easing, ontick, priority }?: CanvasAnimationOptions,
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
     * Cosine based easing with smooth in-out.
     * @param pt - The proportional animation timing on [0,1]
     * @returns The eased animation progress on [0,1]
     */
    static easeInOutCosine(pt: number): number;

    /**
     * Shallow ease out.
     * @param pt - The proportional animation timing on [0,1]
     * @returns The eased animation progress on [0,1]
     */
    static easeOutCircle(pt: number): number;

    /**
     * Shallow ease in.
     * @param pt - The proportional animation timing on [0,1]
     * @returns The eased animation progress on [0,1]
     */
    static easeInCircle(pt: number): number;
  }
}
