import { expectTypeOf } from "vitest";

declare const token: Token;

const bubbles = new ChatBubbles();
expectTypeOf(bubbles.template).toEqualTypeOf<string>();
expectTypeOf(bubbles.bubbles).toEqualTypeOf<object>();
expectTypeOf(bubbles.container).toEqualTypeOf<JQuery>();
expectTypeOf(bubbles.say(token, "Hello World!")).toEqualTypeOf<Promise<void>>();
expectTypeOf(bubbles.say(token, "Hello World!", { emote: true })).toEqualTypeOf<Promise<void>>();
