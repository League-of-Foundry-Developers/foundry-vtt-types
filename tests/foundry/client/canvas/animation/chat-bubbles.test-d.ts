import { describe, expectTypeOf, test } from "vitest";
import type { AnyMutableObject } from "#utils";

import ChatBubbles = foundry.canvas.animation.ChatBubbles;

declare const socket: io.Socket;
declare const someToken: foundry.canvas.placeables.Token.Implementation;
declare const docOrPlaceable: TokenDocument.Implementation | typeof someToken;

describe("ClassName tests", () => {
  const myCB = new ChatBubbles();

  test("Miscellaneous", () => {
    expectTypeOf(ChatBubbles["_activateSocketListeners"](socket)).toBeVoid();

    expectTypeOf(myCB.template).toBeString();
    expectTypeOf(myCB.bubbles).toEqualTypeOf<AnyMutableObject>();
    expectTypeOf(myCB.element).toEqualTypeOf<HTMLElement>();

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
  });

  test("Deprecated", () => {
    // deprecated since v13 until v15

    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myCB.container).toEqualTypeOf<JQuery>();
  });
});
