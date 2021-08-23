import type { ChatSpeakerData } from '../../../../src/foundry/common/data/data.mjs/chatSpeakerData';
import type { ConstructorDataType } from '../../../../src/types/helperTypes';

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
expectError(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), 'custom-roll-mode'));

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
expectError(chat.applyRollMode('custom-roll-mode'));
expectType<Actor['getRollData'] | {}>(chat.getRollData());
expectType<Promise<JQuery>>(chat.getHTML());
expectType<string>(chat.export());
