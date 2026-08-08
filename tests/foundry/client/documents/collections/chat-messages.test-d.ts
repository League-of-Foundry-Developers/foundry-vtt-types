import { afterAll, describe, expectTypeOf, test } from "vitest";

import ChatMessages = foundry.documents.collections.ChatMessages;

describe("ChatMessages Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const message = await ChatMessage.implementation.create({});
  if (!message) throw new Error("Failed to create test ChatMessage.");
  docsToCleanUp.add(message);

  const messageSource = message.toObject();
  const messageImpl = new ChatMessage.implementation({ type: "base" });

  const actor = await Actor.implementation.create({
    name: "ChatMessages Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new ChatMessages();
    new ChatMessages([messageSource]);

    // @ts-expect-error `Actor` data not assignable to `ChatMessage` data
    new ChatMessages([actorSource]);
  });

  const messages = new ChatMessages([messageSource]);

  test("Inheritance", () => {
    const _collection: Collection.Any = messages;
    // @ts-expect-error Currently broken
    const _dc: foundry.documents.abstract.DocumentCollection.Any = messages;
    const _wc: foundry.documents.abstract.WorldCollection.Any = messages;
  });

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

    expectTypeOf(messages.set("ID", message)).toEqualTypeOf<typeof messages>();

    expectTypeOf(messages.delete("ID")).toBeBoolean();
  });

  test("importDocument fake override", async () => {
    // Passing a doc with no subtype data gets back a `Stored` without any either
    const imported1 = await messages.importDocument(message, {});
    if (!imported1) throw new Error("Failed to create test `ChatMessage` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<ChatMessage.Stored>();

    // Passing a doc with subtype info preserves it
    const imported2 = await messages.importDocument(messageImpl, {});
    if (!imported2) throw new Error("Failed to create test `ChatMessage` via `#importDocument`");
    docsToCleanUp.add(imported2);
    expectTypeOf(imported2).toEqualTypeOf<ChatMessage.Stored<"base">>();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
