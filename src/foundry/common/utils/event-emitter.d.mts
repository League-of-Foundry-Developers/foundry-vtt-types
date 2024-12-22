import type { InexactPartial, Mixin } from "../../../utils/index.d.mts";

/**
 * A mixin class which implements the behavior of EventTarget.
 * This is useful in cases where a class wants EventTarget-like behavior but needs to extend some other class.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 */
declare class EventEmitter {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * An array of event types which are valid for this class.
   */
  static emittedEvents: string[];

  /**
   * Add a new event listener for a certain type of event.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @param type     - The type of event being registered for
   * @param listener - The listener function called when the event occurs
   * @param options  - Options which configure the event listener
   */
  addEventListener(
    type: string,
    listener: EventEmitter.EmittedEventListener,
    options?: InexactPartial<{
      /**
       * Should the event only be responded to once and then removed
       * @defaultValue `false`
       */
      once: boolean;
    }>,
  ): void;

  /**
   * Remove an event listener for a certain type of event.
   * @param type     - The type of event being removed
   * @param listener - The listener function being removed
   */
  removeEventListener(type: string, listener: EventEmitter.EmittedEventListener): void;

  /**
   * Dispatch an event on this target.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
   * @param event - The Event to dispatch
   * @returns Was default behavior for the event prevented?
   */
  dispatchEvent(event: Event): boolean;
}

declare namespace EventEmitter {
  type EmittedEventListener = (event: Event) => void;
}

/**
 * Augment a base class with EventEmitter behavior.
 * @param BaseClass - Some base class augmented with event emitter functionality
 */
export default function EventEmitterMixin<ExtendedClass extends abstract new (...args: any[]) => any>(
  BaseClass: ExtendedClass,
): Mixin<typeof EventEmitter, ExtendedClass>;
