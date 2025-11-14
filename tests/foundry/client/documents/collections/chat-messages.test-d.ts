import { describe, expectTypeOf, test } from "vitest";

import ChatMessages = foundry.documents.collections.ChatMessages;

declare const messageCreateData: ChatMessage.CreateData;
declare const messageSource: ChatMessage.Source;
declare const message: ChatMessage.Stored;
declare const messageImpl: ChatMessage.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("ChatMessages Tests", () => {
  test("Construction", () => {
    new ChatMessages();
    new ChatMessages([messageCreateData]);
    new ChatMessages([messageSource]);

    // @ts-expect-error `Actor` data not assignable to `ChatMessage` data
    new ChatMessages([actorCreateData]);
  });

  const messages = new ChatMessages([messageCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(ChatMessages.documentName).toEqualTypeOf<"ChatMessage">();
    expectTypeOf(ChatMessages.instance).toEqualTypeOf<ChatMessages.Implementation>();
    expectTypeOf(messages.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(messages.directory).toEqualTypeOf<typeof ui.chat>();

    expectTypeOf(messages.render()).toBeVoid(); // no-op in `ChatMessages`

    expectTypeOf(messages.sayBubble(message)).toBeVoid();
    expectTypeOf(messages.export()).toBeVoid();
    expectTypeOf(messages.flush()).toEqualTypeOf<Promise<void | false | null>>(); // yes, no, close, respectively
  });

  test("Getting", () => {
    expectTypeOf(messages.get("ID")).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.get("ID", {})).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ChatMessage.Invalid | ChatMessage.Stored
    >();
    expectTypeOf(messages.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(messages.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ChatMessage.Invalid | ChatMessage.Stored
    >();
    expectTypeOf(messages.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ChatMessage.Stored>();
    expectTypeOf(messages.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<ChatMessage.Stored>();
    expectTypeOf(messages.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<ChatMessage.Stored>();
    expectTypeOf(messages.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      ChatMessage.Invalid | ChatMessage.Stored
    >();
    expectTypeOf(messages.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      ChatMessage.Invalid | ChatMessage.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(messages.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ChatMessage.Stored>();
    expectTypeOf(messages.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();
    expectTypeOf(messages.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();
    expectTypeOf(messages.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();
    expectTypeOf(messages.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();

    expectTypeOf(messages.getInvalid("ID")).toEqualTypeOf<ChatMessage.Invalid>();
    expectTypeOf(messages.getInvalid("ID", {})).toEqualTypeOf<ChatMessage.Invalid>();
    expectTypeOf(messages.getInvalid("ID", { strict: false })).toEqualTypeOf<ChatMessage.Invalid | undefined>();
    expectTypeOf(messages.getInvalid("ID", { strict: undefined })).toEqualTypeOf<ChatMessage.Invalid>();
    expectTypeOf(messages.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<ChatMessage.Invalid>();
    expectTypeOf(messages.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<
      ChatMessage.Invalid | undefined
    >();
    expectTypeOf(messages.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<
      ChatMessage.Invalid | undefined
    >();

    expectTypeOf(messages.getName("name")).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.getName("name", {})).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.getName("name", { strict: true })).toEqualTypeOf<ChatMessage.Stored>();
    expectTypeOf(messages.getName("name", { strict: undefined })).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<ChatMessage.Stored | undefined>();
    expectTypeOf(messages.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<
      ChatMessage.Stored | undefined
    >();
    expectTypeOf(messages.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<ChatMessage.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    messages.set("ID", messageImpl);
    // @ts-expect-error `Actor`s are not `ChatMessage`s
    messages.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(messages.set("ID", message)).toBeVoid();

    expectTypeOf(messages.delete("ID")).toBeBoolean();
  });
});
