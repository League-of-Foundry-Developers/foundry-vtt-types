import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseChatMessage.create({})).toEqualTypeOf<Promise<ChatMessage.Stored | undefined>>();
expectTypeOf(foundry.documents.BaseChatMessage.createDocuments([])).toEqualTypeOf<Promise<ChatMessage.Stored[]>>();
expectTypeOf(foundry.documents.BaseChatMessage.updateDocuments([])).toEqualTypeOf<
  Promise<ChatMessage.Implementation[]>
>();
expectTypeOf(foundry.documents.BaseChatMessage.deleteDocuments([])).toEqualTypeOf<
  Promise<ChatMessage.Implementation[]>
>();

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectTypeOf(chat).toEqualTypeOf<ChatMessage.Implementation>();
}

class TestBaseChatMessage extends foundry.documents.BaseChatMessage {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"ChatMessage">)
      : null;
  }
}

expectTypeOf(new TestBaseChatMessage()).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(new TestBaseChatMessage({})).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    blind: null,
    content: null,
    emote: null,
    flags: null,
    flavor: null,
    rolls: null,
    sound: null,
    speaker: null,
    timestamp: null,
    type: null,
    author: null,
    whisper: null,
    _id: null,
  }),
).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    blind: undefined,
    content: undefined,
    emote: undefined,
    flags: undefined,
    flavor: undefined,
    rolls: undefined,
    sound: undefined,
    speaker: undefined,
    timestamp: undefined,
    type: undefined,
    author: undefined,
    whisper: undefined,
    _id: undefined,
  }),
).toEqualTypeOf<TestBaseChatMessage>();

expectTypeOf(
  new TestBaseChatMessage({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null,
    },
  }),
).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    speaker: {},
  }),
).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined,
    },
  }),
).toEqualTypeOf<TestBaseChatMessage>();

expectTypeOf(
  new TestBaseChatMessage({
    whisper: null,
  }),
).toEqualTypeOf<TestBaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    whisper: ["someId"],
  }),
).toEqualTypeOf<TestBaseChatMessage>();

declare const myUser: User.Stored;

expectTypeOf(
  new TestBaseChatMessage({
    whisper: [myUser],
  }),
).toEqualTypeOf<TestBaseChatMessage>();
