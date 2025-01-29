import { expectTypeOf } from "vitest";

expectTypeOf(foundry.documents.BaseChatMessage.create({})).toEqualTypeOf<Promise<ChatMessage.Stored | undefined>>();
expectTypeOf(foundry.documents.BaseChatMessage.createDocuments([])).toEqualTypeOf<Promise<ChatMessage.Stored[]>>();
expectTypeOf(foundry.documents.BaseChatMessage.updateDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();
expectTypeOf(foundry.documents.BaseChatMessage.deleteDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectTypeOf(chat).toEqualTypeOf<ChatMessage>();
}

class TestBaseChatMessage extends foundry.documents.BaseChatMessage {}

expectTypeOf(new TestBaseChatMessage()).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(new TestBaseChatMessage({})).toEqualTypeOf<foundry.documents.BaseChatMessage>();
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
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
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
).toEqualTypeOf<foundry.documents.BaseChatMessage>();

expectTypeOf(
  new TestBaseChatMessage({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null,
    },
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    speaker: {},
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined,
    },
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();

expectTypeOf(
  new TestBaseChatMessage({
    whisper: null,
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new TestBaseChatMessage({
    whisper: ["someId"],
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();

declare const myUser: foundry.documents.BaseUser;

expectTypeOf(
  new TestBaseChatMessage({
    whisper: [myUser],
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
