import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.data.ChatMessageData()).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(new foundry.data.ChatMessageData({})).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    blind: null,
    content: null,
    emote: null,
    flags: null,
    flavor: null,
    roll: null,
    sound: null,
    speaker: null,
    timestamp: null,
    type: null,
    user: null,
    whisper: null,
    _id: null,
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    blind: undefined,
    content: undefined,
    emote: undefined,
    flags: undefined,
    flavor: undefined,
    roll: undefined,
    sound: undefined,
    speaker: undefined,
    timestamp: undefined,
    type: undefined,
    user: undefined,
    whisper: undefined,
    _id: undefined,
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();

expectTypeOf(
  new foundry.data.ChatMessageData({
    speaker: {
      scene: null,
      actor: null,
      token: null,
      alias: null,
    },
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    speaker: {},
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    speaker: {
      scene: undefined,
      actor: undefined,
      token: undefined,
      alias: undefined,
    },
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();

expectTypeOf(
  new foundry.data.ChatMessageData({
    whisper: null,
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    whisper: ["someId"],
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
expectTypeOf(
  new foundry.data.ChatMessageData({
    whisper: [{ id: "someId" }],
  }),
).toEqualTypeOf<foundry.data.ChatMessageData>();
