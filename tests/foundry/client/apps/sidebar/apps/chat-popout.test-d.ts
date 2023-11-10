import { expectTypeOf } from "vitest";

declare const message: ChatMessage;

const popout = new ChatPopout(message);
expectTypeOf(popout.message).toEqualTypeOf<ChatMessage>();
