import { expectTypeOf, test } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import Token = foundry.canvas.placeables.Token;

expectTypeOf(new ChatMessage.implementation()).toEqualTypeOf<ChatMessage.Implementation>();
expectTypeOf(new ChatMessage.implementation({})).toEqualTypeOf<ChatMessage.Implementation>();

expectTypeOf(ChatMessage.applyMode({})).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "public")).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "gm")).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "blind")).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "self")).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();
expectTypeOf(ChatMessage.applyMode({}, "ic")).toEqualTypeOf<foundry.documents.BaseChatMessage.CreateData>();

declare module "fvtt-types/configuration" {
  namespace CONFIG {
    namespace Dice {
      interface RollModes {
        "custom-roll-mode": "Some Custom Roll Mode";
      }
    }
  }
}

declare const tokenDoc: TokenDocument.Stored;
declare const token: Token.Implementation;

test("Regression test for CONFIG.Dice.rollModes as choices", () => {
  new foundry.data.fields.StringField({
    blank: true,
    required: true,
    choices: CONFIG.Dice.rollModes,
  });
});

expectTypeOf(ChatMessage.getSpeaker()).toEqualTypeOf<ChatMessage.SpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({})).toEqualTypeOf<ChatMessage.SpeakerData>();
if (game instanceof Game) {
  expectTypeOf(ChatMessage.getSpeaker({ scene: game.scenes?.active })).toEqualTypeOf<ChatMessage.SpeakerData>();
  expectTypeOf(ChatMessage.getSpeaker({ actor: game.user?.character })).toEqualTypeOf<ChatMessage.SpeakerData>();
  expectTypeOf(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: token,
    }),
  ).toEqualTypeOf<ChatMessage.SpeakerData>();
}
expectTypeOf(ChatMessage.getSpeaker({ token: tokenDoc })).toEqualTypeOf<ChatMessage.SpeakerData>();
expectTypeOf(ChatMessage.getSpeaker({ alias: "Mario" })).toEqualTypeOf<ChatMessage.SpeakerData>();

expectTypeOf(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker())).toEqualTypeOf<Actor.Stored | null>();
expectTypeOf(ChatMessage.getWhisperRecipients("Mario")).toEqualTypeOf<User.Stored[]>();

const chat = new ChatMessage.implementation();
expectTypeOf(chat.alias).toEqualTypeOf<string>();
expectTypeOf(chat.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(chat.isContentVisible).toEqualTypeOf<boolean>();
expectTypeOf(chat.isRoll).toEqualTypeOf<boolean>();
expectTypeOf(chat.rolls).toEqualTypeOf<Roll[]>();
expectTypeOf(chat.visible).toEqualTypeOf<boolean>();
expectTypeOf(chat.author).toEqualTypeOf<User.Stored | null>();
expectTypeOf(chat.prepareData()).toEqualTypeOf<void>();
expectTypeOf(chat.applyMode()).toEqualTypeOf<void>();
expectTypeOf(chat.applyMode("blind")).toEqualTypeOf<void>();
expectTypeOf(chat.applyMode("ic")).toEqualTypeOf<void>();

// @ts-expect-error "unknown-mode" is not a registered message visibility mode
chat.applyMode("unknown-mode");

expectTypeOf(chat.getRollData()).toEqualTypeOf<AnyObject>();

// deprecated since v13 until v15
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(chat.getHTML()).toEqualTypeOf<Promise<JQuery>>();
expectTypeOf(chat.export()).toEqualTypeOf<string>();

expectTypeOf(chat.flags.core?.sheetClass).toEqualTypeOf<string | undefined>();
expectTypeOf(chat.flags.core?.canPopout).toEqualTypeOf<boolean | undefined>();
await ChatMessage.create({
  flags: {
    core: {
      canPopout: true,
      sheetClass: "foobar",
    },
  },
});

expectTypeOf(chat.title).toEqualTypeOf<string | undefined>();
expectTypeOf(chat.timestamp).toEqualTypeOf<number | null>();
expectTypeOf(chat["_getHiddenContent"]()).toBeString();
