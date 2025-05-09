import type { PropertiesOfType, Brand, NullishProps, AnyObject, Identity } from "fvtt-types/utils";

declare global {
  /**
   * A helper class providing utility methods for PIXI Canvas animation
   */
  class CanvasAnimation {
    /** @privateRemarks Returns a private class property that is a frozen object, so keys are readonly */
    static get STATES(): CanvasAnimation.States;

    /**
     * The ticker used for animations.
     */
    static get ticker(): PIXI.Ticker;

    /**
     * Track an object of active animations by name, context, and function
     * This allows a currently playing animation to be referenced and terminated
     * @privateRemarks Foundry does not account for the possibility of Symbol animation names and types the keys as simply `string`,
     * despite typing `CanvasAnimationOptions.name` as `string | symbol`
     */
    static animations: Record<PropertyKey, CanvasAnimation.AnimationData>;

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
      attributes: CanvasAnimation.Attribute[],
      options?: CanvasAnimation.AnimateOptions,
    ): CanvasAnimation.AnimateReturn;

    /**
     * Retrieve an animation currently in progress by its name
     * @param name - The animation name to retrieve
     * @returns The animation data, or undefined
     */
    static getAnimation(name: PropertyKey): CanvasAnimation.AnimationData | undefined;

    /**
     * If an animation using a certain name already exists, terminate it
     * @param name - The animation name to terminate
     */
    static terminateAnimation(name: PropertyKey): void;

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

  namespace CanvasAnimation {
    interface Any extends AnyCanvasAnimation {}
    interface AnyConstructor extends Identity<typeof AnyCanvasAnimation> {}

    /** @remarks Helper type as many things `return CanvasAnimation.animate(...)` */
    type AnimateReturn = Promise<boolean | void>;

    type EasingFunction = CoreEasingFunctions | ((percent: number) => number);
    type CoreEasingFunctions = PropertiesOfType<typeof CanvasAnimation, (percent: number) => number>;

    type STATES = Brand<number, "CanvasAnimation.STATES">;

    interface States {
      /** An error occurred during waiting or running the animation. */
      readonly FAILED: -2 & CanvasAnimation.STATES;

      /** The animation was terminated before it could complete. */
      readonly TERMINATED: -1 & CanvasAnimation.STATES;

      /** Waiting for the wait promise before the animation is started. */
      readonly WAITING: 0 & CanvasAnimation.STATES;

      /** The animation has been started and is running. */
      readonly RUNNING: 1 & CanvasAnimation.STATES;

      /** The animation was completed without errors and without being terminated. */
      readonly COMPLETED: 2 & CanvasAnimation.STATES;
    }

    type OnTickFunction = (dt: number, animation: CanvasAnimation.AnimationData) => void;

    /** @internal */
    type _AnimateOptions = NullishProps<{
      /**
       * A DisplayObject which defines context to the PIXI.Ticker function
       * @defaultValue `canvas.stage`
       * @remarks `null` is allowed here because despite only having a parameter default,
       * the (afaict, unexported) PIXI class `TickerListener`'s constructor (where this prop
       * ends up) accepts `null` for context. This is likely never actually desireable, however.
       */
      context: PIXI.DisplayObject;

      /** A unique name which can be used to reference the in-progress animation */
      name: PropertyKey;

      /**
       * A priority in PIXI.UPDATE_PRIORITY which defines when the animation
       * should be evaluated related to others
       * @defaultValue `PIXI.UPDATE_PRIORITY.LOW + 1`
       * @remarks Default provided by `??=` in function body. Numerical values between `UPDATE_PRIORITY`
       * levels are valid but must be cast `as PIXI.UPDATE_PRIORITY` due to the Branded enum
       */
      priority: PIXI.UPDATE_PRIORITY;

      /**
       * An easing function used to translate animation time or the string name
       * of a static member of the CanvasAnimation class
       */
      easing: CanvasAnimation.EasingFunction;

      /** A callback function which fires after every frame */
      ontick: OnTickFunction;

      /** The animation isn't started until this promise resolves */
      wait: Promise<unknown>;
    }>;

    /** @internal */
    type _AnimationAttribute = NullishProps<{
      /**
       * An initial value of the attribute, otherwise parent[attribute] is used
       * @remarks Will be replaced inside `.animate` with `Color.from(from)` if `to` is a `Color`
       */
      from: number | Color;
    }>;

    interface Attribute {
      /** The attribute name being animated */
      attribute: string;

      /** The object within which the attribute is stored */
      parent: AnyObject;

      /** The destination value of the attribute */
      to: number | Color;
    }

    interface AnimateOptions extends CanvasAnimation._AnimateOptions {
      /**
       * A duration in milliseconds over which the animation should occur
       * @defaultValue `1000`
       * @remarks Can't be `null` because it only has a parameter default, and is used as a divisor in `CanvasAnimation.#animateFrame`
       */
      duration?: number | undefined;
    }

    interface CanvasAnimationAttribute extends CanvasAnimation.Attribute {
      /**
       * The computed delta between to and from
       * @remarks This key is always overwritten inside `.animate`, its passed value is irrelevant
       */
      delta: number;

      /**
       * The amount of the total delta which has been animated
       * @remarks This key is always overwritten inside `.animate`, its passed value is irrelevant
       */
      done: number;

      /**
       * Is this a color animation that applies to RGB channels
       * @remarks When true, `CanvasAnimation.#animateFrame` assumes `to` *and* `from` are
       * both `Color`s. It's automatically set `true` if `to` is passed as a `Color`, so it
       * should be unnecessary to set manually.
       */
      color?: boolean;
    }

    interface AnimationData extends CanvasAnimation.AnimateOptions {
      /** The animation function being executed each frame */
      fn: (dt: number) => void;

      /** The current time of the animation, in milliseconds */
      time: number;

      /** The attributes being animated */
      attributes: CanvasAnimationAttribute[];

      /** The current state of the animation */
      state: CanvasAnimation.STATES;

      /** A Promise which resolves once the animation is complete */
      promise: Promise<boolean>;

      /** The resolution function, allowing animation to be ended early */
      resolve: (value: boolean) => void;

      /** The rejection function, allowing animation to be ended early */
      reject: (err: Error) => void;
    }
  }

  /** @deprecated Replaced with {@linkcode CanvasAnimation.AnimateOptions} */
  type CanvasAnimationOptions = CanvasAnimation.AnimateOptions;

  /** @deprecated Replaced with {@linkcode CanvasAnimation.AnimationData} */
  type CanvasAnimationData = CanvasAnimation.AnimationData;
}

declare abstract class AnyCanvasAnimation extends CanvasAnimation {
  constructor(...args: never);
}
