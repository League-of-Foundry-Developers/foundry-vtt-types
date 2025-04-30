import { expectTypeOf } from "vitest";
import EventEmitterMixin = foundry.utils.EventEmitterMixin;

declare class EventEmitter extends EventEmitterMixin() {}

expectTypeOf(EventEmitter.emittedEvents).toEqualTypeOf<string[]>();

declare const listener: (event: Event) => void;
const eventEmitter = new EventEmitter();

expectTypeOf(eventEmitter.addEventListener("eventName", listener)).toBeVoid();
expectTypeOf(eventEmitter.addEventListener("eventName", listener, {})).toBeVoid();
expectTypeOf(eventEmitter.addEventListener("eventName", listener, { once: true })).toBeVoid();
expectTypeOf(eventEmitter.addEventListener("eventName", listener, { once: null })).toBeVoid();

expectTypeOf(eventEmitter.removeEventListener("eventName", listener)).toBeVoid();

declare const event: Event;
expectTypeOf(eventEmitter.dispatchEvent(event)).toBeBoolean();
