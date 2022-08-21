import { expectType } from "tsd";

declare const token: Token;

const bubbles = new ChatBubbles();
expectType<string>(bubbles.template);
expectType<object>(bubbles.bubbles);
expectType<JQuery>(bubbles.container);
expectType<Promise<void>>(bubbles.say(token, "Hello World!"));
expectType<Promise<void>>(bubbles.say(token, "Hello World!", { emote: true }));
