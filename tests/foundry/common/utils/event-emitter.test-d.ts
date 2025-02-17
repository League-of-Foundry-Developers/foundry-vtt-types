import { expectTypeOf } from "vitest";
import type EventEmitterMixin from "../../../../src/foundry/common/utils/event-emitter.d.mts";

declare class EventEmitter extends EventEmitterMixin(Object) {}
declare const eventEmitter: EventEmitter;

declare const listener: (event: Event) => void;
expectTypeOf(eventEmitter.addEventListener("", listener)).toEqualTypeOf<void>();
expectTypeOf(eventEmitter.removeEventListener("", listener)).toEqualTypeOf<void>();

declare const event: Event;
expectTypeOf(eventEmitter.dispatchEvent(event)).toEqualTypeOf<boolean>();

expectTypeOf(EventEmitter.emittedEvents).toEqualTypeOf<string[]>();
