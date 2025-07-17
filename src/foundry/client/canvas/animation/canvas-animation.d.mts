import type { PropertiesOfType, Brand, AnyObject, Identity, InexactPartial, AllKeysOf } from "#utils";

/**
 * A helper class providing utility methods for PIXI Canvas animation
 */
declare class CanvasAnimation {
  /** @privateRemarks Returns a private class property that is a frozen object, so keys are readonly */
  static get STATES(): CanvasAnimation.States;

  /**
   * The ticker used for animations.
   */
  static get ticker(): PIXI.Ticker;

  /**
   * Track an object of active animations by name, context, and function
   * This allows a currently playing animation to be referenced and terminated
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
  static animate<Parents extends AnyObject[] = AnyObject[]>(
    attributes: CanvasAnimation.Attributes<Parents>,
    options?: CanvasAnimation.AnimateOptions<Parents>,
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
   * Terminate all active animations in progress, forcibly resolving each one with `false`.
   * This method returns a Promise that resolves once all animations have been terminated and removed.
   * @returns A promise that resolves when all animations have been forcibly terminated.
   */
  static terminateAll(): Promise<void>;

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

  static #CanvasAnimation: true;
}

declare namespace CanvasAnimation {
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

  type OnTickFunction<AnimationParent extends AnyObject = AnyObject> = (
    dt: number,
    animation: CanvasAnimation.AnimationData<AnimationParent>,
  ) => void;

  /** @internal */
  type _AnimateOptions<AnimationParent extends AnyObject = AnyObject> = InexactPartial<{
    /**
     * A DisplayObject which defines context to the PIXI.Ticker function
     * @defaultValue {@linkcode foundry.canvas.Canvas.stage | canvas.stage}
     */
    context: PIXI.DisplayObject;

    /**
     * A unique name which can be used to reference the in-progress animation
     * @defaultValue `Symbol("CanvasAnimation")`
     */
    name: PropertyKey;

    /**
     * A duration in milliseconds over which the animation should occur
     * @defaultValue `1000`
     */
    duration: number;

    /**
     * A priority in {@linkcode PIXI.UPDATE_PRIORITY} which defines when the animation
     * should be evaluated related to others
     * @defaultValue {@linkcode PIXI.UPDATE_PRIORITY.LOW}`+ 1`
     * @remarks Numerical values between `UPDATE_PRIORITY` levels are valid but must be cast `as PIXI.UPDATE_PRIORITY` due to the Branded enum
     */
    priority: PIXI.UPDATE_PRIORITY;

    /**
     * An easing function used to translate animation time or the string name
     * of a static member of the CanvasAnimation class
     */
    easing: CanvasAnimation.EasingFunction;

    /** A callback function which fires after every frame */
    ontick: OnTickFunction<AnimationParent>;

    /** The animation isn't started until this promise resolves */
    wait: Promise<void>;
  }>;

  interface AnimateOptions<Parents extends AnyObject[] = AnyObject[]>
    extends CanvasAnimation._AnimateOptions<Parents[number]> {}

  /** @internal */
  type _AnimationAttribute = InexactPartial<{
    /**
     * An initial value of the attribute, otherwise `parent[attribute]` is used
     * @remarks Will be replaced inside {@linkcode CanvasAnimation.animate} with {@linkcode Color.from | Color.from(from)} if `to` is a `Color`
     */
    from: number | Color;
  }>;

  type Attributes<Parents extends AnyObject[]> = {
    [K in keyof Parents]: Attribute<Parents[K]>;
  };

  /**
   * @remarks The portion of Foundry's `CanvasAnimationAttribute` typedef that gets respected if passed.
   *
   * See {@linkcode ProcessedAttribute}
   */
  interface Attribute<AnimationParent extends AnyObject = AnyObject> extends _AnimationAttribute {
    /**
     * The attribute name being animated
     * @remarks Does not support dotkeys
     */
    attribute: AllKeysOf<AnimationParent>;

    /** The object within which the attribute is stored */
    parent: AnimationParent;

    /** The destination value of the attribute */
    to: number | Color;
  }

  /**
   * @remarks This is the type after {@linkcode CanvasAnimation.animate} provides the computed `delta` and a `0` value
   * for `done`, which gets bundled into a {@linkcode CanvasAnimation.AnimationData} and put into {@linkcode CanvasAnimation.animations}
   *
   * See {@linkcode CanvasAnimation.Attribute}
   */
  interface ProcessedAttribute<AnimationParent extends AnyObject = AnyObject>
    extends CanvasAnimation.Attribute<AnimationParent> {
    /**
     * The computed delta between to and from
     * @remarks This key is always computed inside {@linkcode CanvasAnimation.animate}, its passed value is irrelevant
     */
    delta: number;

    /**
     * The amount of the total delta which has been animated
     * @remarks This key is always computed inside {@linkcode CanvasAnimation.animate}, its passed value is irrelevant
     */
    done: number;

    /**
     * Is this a color animation that applies to RGB channels
     * @remarks When true, `CanvasAnimation.#animateFrame` assumes `to` *and* `from` are both `Color`s. It's automatically set `true`
     * if `to` is passed as a `Color` regardless of its own passed value, and is irrelevant if `to` isn't a `Color`, so it should be
     * unnecessary to set manually and has been omitted from the passable interface. It is read by `CanvasAnimation##updateAttribute`
     * to determine update behaviour.
     */
    color?: boolean;
  }

  interface AnimationData<AnimationParent extends AnyObject = AnyObject> extends CanvasAnimation.AnimateOptions {
    /** The animation function being executed each frame */
    fn: (dt: number) => void;

    /** The current time of the animation, in milliseconds */
    time: number;

    /** The attributes being animated */
    // TODO: a method to narrow what `ProcessedAttribute.attributes` can be by the `.parent` (see https://discord.com/channels/732325252788387980/793933527065690184/1391965566276861964)
    attributes: ProcessedAttribute<AnimationParent>[];

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

export default CanvasAnimation;

declare abstract class AnyCanvasAnimation extends CanvasAnimation {
  constructor(...args: never);
}
