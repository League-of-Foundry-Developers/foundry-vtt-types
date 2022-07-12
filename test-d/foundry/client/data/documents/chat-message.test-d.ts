import type { ChatSpeakerData } from '../../../../../src/foundry/common/data/data.mjs.d.ts/chatSpeakerData';
import type { ConstructorDataType } from '../../../../../src/types/helperTypes';

import { expectError, expectType } from 'tsd';

expectType<ChatMessage>(new ChatMessage());
expectType<ChatMessage>(new ChatMessage({}));

expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.BLIND)
);
expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PRIVATE)
);
expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PUBLIC)
);
expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.SELF)
);

expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), 'roll')
);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace CONFIG {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Dice {
      interface RollModes {
        'custom-roll-mode': 'Some Custom Roll Mode';
      }
    }
  }
}

expectType<ConstructorDataType<foundry.data.ChatMessageData>>(
  ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), 'custom-roll-mode')
);

expectError(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), 'unknown-roll-mode'));

expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker());
expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker({}));
if (game instanceof Game) {
  expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker({ scene: game.scenes?.active }));
  expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker({ actor: game.user?.character }));
  expectType<ChatSpeakerData['_source']>(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: new TokenDocument(),
      alias: 'Mario'
    })
  );
}
expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker({ token: new TokenDocument() }));
expectType<ChatSpeakerData['_source']>(ChatMessage.getSpeaker({ alias: 'Mario' }));

expectType<Actor | null>(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker()));
expectType<StoredDocument<User>[]>(ChatMessage.getWhisperRecipients('Mario'));

const chat = new ChatMessage();
expectType<string>(chat.alias);
expectType<boolean>(chat.isAuthor);
expectType<boolean>(chat.isContentVisible);
expectType<boolean>(chat.isRoll);
expectType<Roll | null>(chat.roll);
expectType<boolean>(chat.visible);
expectType<User | undefined>(chat.user);
expectType<void>(chat.prepareData());
expectType<void>(chat.applyRollMode(CONST.DICE_ROLL_MODES.BLIND));
expectType<void>(chat.applyRollMode(CONST.DICE_ROLL_MODES.PRIVATE));
expectType<void>(chat.applyRollMode(CONST.DICE_ROLL_MODES.PUBLIC));
expectType<void>(chat.applyRollMode(CONST.DICE_ROLL_MODES.SELF));
expectType<void>(chat.applyRollMode('roll'));
expectType<void>(chat.applyRollMode('custom-roll-mode'));
expectError(chat.applyRollMode('unknown-roll-mode'));
expectType<object>(chat.getRollData());
expectType<Promise<JQuery>>(chat.getHTML());
expectType<string>(chat.export());
