import type { ChatSpeakerData } from "../../../../../src/foundry/common/data/data.mjs/chatSpeakerData";
import type { ConstructorDataType } from "../../../../../src/types/helperTypes";

import { expectTypeOf } from "vitest";

expectTypeOf(new ChatMessage()).toEqualTypeOf<ChatMessage>();
expectTypeOf(new ChatMessage({})).toEqualTypeOf<ChatMessage>();

expectTypeOf(ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.BLIND)).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();
expectTypeOf(ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PRIVATE)).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();
expectTypeOf(ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PUBLIC)).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();
expectTypeOf(ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.SELF)).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();

expectTypeOf(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), "roll")).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace CONFIG {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Dice {
      interface RollModes {
        "custom-roll-mode": "Some Custom Roll Mode";
      }
    }
  }
}

expectTypeOf(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), "custom-roll-mode")).toEqualTypeOf<
  ConstructorDataType<foundry.data.ChatMessageData>
>();

// @ts-expect-error - "unknown-roll-mode" is not a valid roll mode
ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), "unknown-roll-mode");

expectTypeOf(ChatMessage.getSpeaker()).toEqualTypeOf<ChatSpeakerData["_source"]>();
expectTypeOf(ChatMessage.getSpeaker({})).toEqualTypeOf<ChatSpeakerData["_source"]>();
if (game instanceof Game) {
  expectTypeOf(ChatMessage.getSpeaker({ scene: game.scenes?.active })).toEqualTypeOf<ChatSpeakerData["_source"]>();
  expectTypeOf(ChatMessage.getSpeaker({ actor: game.user?.character })).toEqualTypeOf<ChatSpeakerData["_source"]>();
  expectTypeOf(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: new TokenDocument(),
      alias: "Mario",
    }),
  ).toEqualTypeOf<ChatSpeakerData["_source"]>();
}
expectTypeOf(ChatMessage.getSpeaker({ token: new TokenDocument() })).toEqualTypeOf<ChatSpeakerData["_source"]>();
expectTypeOf(ChatMessage.getSpeaker({ alias: "Mario" })).toEqualTypeOf<ChatSpeakerData["_source"]>();

expectTypeOf(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker())).toEqualTypeOf<Actor | null>();
expectTypeOf(ChatMessage.getWhisperRecipients("Mario")).toEqualTypeOf<StoredDocument<User>[]>();

const chat = new ChatMessage();
expectTypeOf(chat.alias).toEqualTypeOf<string>();
expectTypeOf(chat.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(chat.isContentVisible).toEqualTypeOf<boolean>();
expectTypeOf(chat.isRoll).toEqualTypeOf<boolean>();
expectTypeOf(chat.roll).toEqualTypeOf<Roll | null>();
expectTypeOf(chat.visible).toEqualTypeOf<boolean>();
expectTypeOf(chat.user).toEqualTypeOf<User | undefined>();
expectTypeOf(chat.prepareData()).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.BLIND)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PRIVATE)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PUBLIC)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.SELF)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("roll")).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("custom-roll-mode")).toEqualTypeOf<void>();

// @ts-expect-error - "unknown-roll-mode" is not a valid roll mode
chat.applyRollMode("unknown-roll-mode");

expectTypeOf(chat.getRollData()).toEqualTypeOf<object>();
expectTypeOf(chat.getHTML()).toEqualTypeOf<Promise<JQuery>>();
expectTypeOf(chat.export()).toEqualTypeOf<string>();
