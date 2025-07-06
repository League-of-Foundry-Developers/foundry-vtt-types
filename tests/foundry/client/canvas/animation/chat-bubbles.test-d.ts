import { expectTypeOf } from "vitest";
import type { AnyMutableObject } from "#utils";

import ChatBubbles = foundry.canvas.animation.ChatBubbles;

declare const socket: io.Socket;

expectTypeOf(ChatBubbles["_activateSocketListeners"](socket)).toBeVoid();

const myCB = new ChatBubbles();

expectTypeOf(myCB.template).toBeString();
expectTypeOf(myCB.bubbles).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(myCB.element).toEqualTypeOf<HTMLElement>();

declare const someToken: foundry.canvas.placeables.Token.Implementation;
declare const docOrPlaceable: TokenDocument.Implementation | typeof someToken;

expectTypeOf(myCB.broadcast(docOrPlaceable, "Hey!"));
expectTypeOf(
  myCB.broadcast(docOrPlaceable, "Hey!", {
    cssClasses: ["foobar", "fizzbuzz"],
    pan: false,
    requireVisible: true,
  }),
);
expectTypeOf(
  myCB.broadcast(docOrPlaceable, "Hey!", {
    cssClasses: undefined,
    pan: undefined,
    requireVisible: undefined,
  }),
);

expectTypeOf(myCB.say(someToken, "Hey!"));
expectTypeOf(
  myCB.say(someToken, "Hey!", {
    cssClasses: ["foobar", "fizzbuzz"],
    pan: false,
    requireVisible: true,
  }),
);
expectTypeOf(
  myCB.say(someToken, "Hey!", {
    cssClasses: undefined,
    pan: undefined,
    requireVisible: undefined,
  }),
);

// deprecated since v13 until v15

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCB.container).toEqualTypeOf<JQuery>();
