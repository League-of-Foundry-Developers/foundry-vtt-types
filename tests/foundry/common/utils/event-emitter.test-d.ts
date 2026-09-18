import { expectTypeOf, test } from "vitest";
import EventEmitterMixin = foundry.utils.EventEmitterMixin;

declare class EventEmitter extends EventEmitterMixin() {}

declare const listener: (event: Event) => void;

declare const event: Event;

test("foundry/common/utils/event-emitter", () => {
  expectTypeOf(EventEmitter.emittedEvents).toEqualTypeOf<string[] | readonly string[]>();
  const eventEmitter = new EventEmitter();

  expectTypeOf(eventEmitter.addEventListener("eventName", listener)).toBeVoid();
  expectTypeOf(eventEmitter.addEventListener("eventName", listener, {})).toBeVoid();
  expectTypeOf(eventEmitter.addEventListener("eventName", listener, { once: true })).toBeVoid();
  expectTypeOf(eventEmitter.addEventListener("eventName", listener, { once: undefined })).toBeVoid();

  expectTypeOf(eventEmitter.removeEventListener("eventName", listener)).toBeVoid();
  expectTypeOf(eventEmitter.dispatchEvent(event)).toBeBoolean();
});
