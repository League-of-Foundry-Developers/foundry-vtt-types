import type { AnyConstructor, Coalesce, FixedInstanceType, Mixin, PhantomConstructor, NullishProps } from "#utils";

/**
 * A mixin class which implements the behavior of EventTarget.
 * This is useful in cases where a class wants EventTarget-like behavior but needs to extend some other class.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget}
 */
// ESLint doesn't like this class "only being used as a type"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class EventEmitter {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * An array of event types which are valid for this class.
   */
  static emittedEvents: string[];

  /**
   * Add a new event listener for a certain type of event.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener}
   * @param type     - The type of event being registered for
   * @param listener - The listener function called when the event occurs
   * @param options  - Options which configure the event listener
   */
  // options: not null (destructured)
  addEventListener(
    type: string,
    listener: EventEmitterMixin.EventListener,
    options?: EventEmitterMixin.AddListenerOptions,
  ): void;

  /**
   * Remove an event listener for a certain type of event.
   * @param type     - The type of event being removed
   * @param listener - The listener function being removed
   */
  removeEventListener(type: string, listener: EventEmitterMixin.EventListener): void;

  /**
   * Dispatch an event on this target.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent}
   * @param event - The Event to dispatch
   * @returns Was default behavior for the event prevented?
   */
  dispatchEvent(event: Event): boolean;
}

declare namespace EventEmitterMixin {
  interface AnyMixedConstructor extends ReturnType<typeof EventEmitterMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type Mix<BaseClass extends EventEmitterMixin.BaseClass | undefined> = Mixin<
    typeof EventEmitter,
    Coalesce<BaseClass, PhantomConstructor>
  >;

  type BaseClass = AnyConstructor;

  /** @internal */
  type _AddListenerOptions = NullishProps<{
    /**
     * Should the event only be responded to once and then removed
     * @defaultValue `false`
     */
    once: boolean;
  }>;

  interface AddListenerOptions extends _AddListenerOptions {}

  type EventListener = (event: Event) => void;
}

/**
 * Augment a base class with EventEmitter behavior.
 * @param BaseClass - Some base class augmented with event emitter functionality
 */
declare function EventEmitterMixin<BaseClass extends EventEmitterMixin.BaseClass | undefined = undefined>(
  BaseClass?: BaseClass,
): EventEmitterMixin.Mix<BaseClass>;

export default EventEmitterMixin;
