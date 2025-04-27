import { expectTypeOf } from "vitest";

declare const token: Token.Implementation;
declare const tokenDocument: TokenDocument.Implementation;

const bubbles = new ChatBubbles();
expectTypeOf(bubbles.template).toEqualTypeOf<string>();
expectTypeOf(bubbles.bubbles).toEqualTypeOf<object>();
expectTypeOf(bubbles.container).toEqualTypeOf<JQuery>();
expectTypeOf(bubbles.say(token, "Hello World!")).toEqualTypeOf<Promise<void>>();
expectTypeOf(bubbles.say(token, "Hello World!", { emote: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(bubbles.broadcast(tokenDocument, "Hello World!", { pan: true, requireVisible: false })).toEqualTypeOf<
  Promise<JQuery | null>
>();
