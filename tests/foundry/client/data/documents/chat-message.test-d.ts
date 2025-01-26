import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;
import ChatSpeakerData = foundry.data.ChatSpeakerData;

expectTypeOf(new ChatMessage()).toEqualTypeOf<ChatMessage>();
expectTypeOf(new ChatMessage({})).toEqualTypeOf<ChatMessage>();

expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.BLIND),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PRIVATE),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PUBLIC),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.SELF),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();

declare global {
  namespace CONFIG {
    namespace Dice {
      interface RollModes {
        "custom-roll-mode": "Some Custom Roll Mode";
      }
    }
  }
}

expectTypeOf(
  ChatMessage.applyRollMode({}, "custom-roll-mode"),
).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();

// @ts-expect-error - "unknown-roll-mode" is not a valid roll mode
ChatMessage.applyRollMode({}, "unknown-roll-mode");

expectTypeOf(ChatMessage.getSpeaker()).toEqualTypeOf<ChatSpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({})).toEqualTypeOf<ChatSpeakerData>();
if (game instanceof Game) {
  expectTypeOf(ChatMessage.getSpeaker({ scene: game.scenes?.active })).toEqualTypeOf<ChatSpeakerData>();
  expectTypeOf(ChatMessage.getSpeaker({ actor: game.user?.character })).toEqualTypeOf<ChatSpeakerData>();
  expectTypeOf(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: new TokenDocument(),
      alias: "Mario",
    }),
  ).toEqualTypeOf<ChatSpeakerData>();
}
expectTypeOf(ChatMessage.getSpeaker({ token: new TokenDocument() })).toEqualTypeOf<ChatSpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({ alias: "Mario" })).toEqualTypeOf<ChatSpeakerData>();

expectTypeOf(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker())).toEqualTypeOf<Actor | null>();
expectTypeOf(ChatMessage.getWhisperRecipients("Mario")).toEqualTypeOf<User.Stored[]>();

const chat = new ChatMessage();
expectTypeOf(chat.alias).toEqualTypeOf<string>();
expectTypeOf(chat.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(chat.isContentVisible).toEqualTypeOf<boolean>();
expectTypeOf(chat.isRoll).toEqualTypeOf<boolean>();
expectTypeOf(chat.rolls).toEqualTypeOf<Roll[]>();
expectTypeOf(chat.visible).toEqualTypeOf<boolean>();
expectTypeOf(chat.user).toEqualTypeOf<User.Implementation>(); // TODO: This seems off? Possible issue with ForeignDocumentField
expectTypeOf(chat.prepareData()).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.BLIND)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PRIVATE)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.PUBLIC)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode(CONST.DICE_ROLL_MODES.SELF)).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("roll")).toEqualTypeOf<void>();
expectTypeOf(chat.applyRollMode("custom-roll-mode")).toEqualTypeOf<void>();

// @ts-expect-error - "unknown-roll-mode" is not a valid roll mode
chat.applyRollMode("unknown-roll-mode");

expectTypeOf(chat.getRollData()).toEqualTypeOf<Record<string, unknown>>();
expectTypeOf(chat.getHTML()).toEqualTypeOf<Promise<JQuery>>();
expectTypeOf(chat.export()).toEqualTypeOf<string>();
