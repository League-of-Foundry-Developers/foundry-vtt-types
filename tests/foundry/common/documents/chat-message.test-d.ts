import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";

expectTypeOf(foundry.documents.BaseChatMessage.create({})).toEqualTypeOf<
  Promise<StoredDocument<ChatMessage> | undefined>
>();
expectTypeOf(foundry.documents.BaseChatMessage.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<ChatMessage>[]>
>();
expectTypeOf(foundry.documents.BaseChatMessage.updateDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();
expectTypeOf(foundry.documents.BaseChatMessage.deleteDocuments([])).toEqualTypeOf<Promise<ChatMessage[]>>();

const chat = await foundry.documents.BaseChatMessage.create({}, { temporary: true });
if (chat) {
  expectTypeOf(chat).toEqualTypeOf<ChatMessage>();
}

expectTypeOf(new foundry.documents.BaseChatMessage()).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(new foundry.documents.BaseChatMessage({})).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
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
    user: null,
    whisper: null,
    _id: null,
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
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
    user: undefined,
    whisper: undefined,
    _id: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();

expectTypeOf(
  new foundry.documents.BaseChatMessage({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null,
    },
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
    speaker: {},
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined,
    },
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();

expectTypeOf(
  new foundry.documents.BaseChatMessage({
    whisper: null,
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
    whisper: ["someId"],
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
expectTypeOf(
  new foundry.documents.BaseChatMessage({
    whisper: [new foundry.documents.BaseUser({ name: "foo" })],
  }),
).toEqualTypeOf<foundry.documents.BaseChatMessage>();
