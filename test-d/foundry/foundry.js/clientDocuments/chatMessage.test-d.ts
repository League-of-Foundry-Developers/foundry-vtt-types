import { expectError, expectType } from 'tsd';
import { ActorData, ChatMessageData } from '../../../../src/foundry/common/data/data.mjs';
import { ChatSpeakerData } from '../../../../src/foundry/common/data/data.mjs/chatSpeakerData';

expectType<ChatMessage>(new ChatMessage());
expectType<ChatMessage>(new ChatMessage({}));

expectType<ChatMessageData>(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), CONST.DICE_ROLL_MODES.BLIND));
expectType<ChatMessageData>(
  ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), CONST.DICE_ROLL_MODES.PRIVATE)
);
expectType<ChatMessageData>(
  ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), CONST.DICE_ROLL_MODES.PUBLIC)
);
expectType<ChatMessageData>(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), CONST.DICE_ROLL_MODES.SELF));
expectError(ChatMessage.applyRollMode(new foundry.data.ChatMessageData(), 'custom-roll-mode'));

expectType<ChatSpeakerData>(ChatMessage.getSpeaker());
expectType<ChatSpeakerData>(ChatMessage.getSpeaker({}));
expectType<ChatSpeakerData>(ChatMessage.getSpeaker({ scene: game.scenes?.active }));
expectType<ChatSpeakerData>(ChatMessage.getSpeaker({ actor: game.user?.character }));
expectType<ChatSpeakerData>(ChatMessage.getSpeaker({ token: game.user?.character?.token }));
expectType<ChatSpeakerData>(ChatMessage.getSpeaker({ alias: 'Mario' }));
expectType<ChatSpeakerData>(
  ChatMessage.getSpeaker({
    scene: game.scenes?.active,
    actor: game.user?.character,
    token: game.user?.character?.token,
    alias: 'Mario'
  })
);

expectType<Actor | null>(ChatMessage.getSpeakerActor(ChatMessage.getSpeaker()));
expectType<User[]>(ChatMessage.getWhisperRecipients('Mario'));

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
expectType<ActorData | {}>(chat.getRollData());
expectType<Promise<JQuery>>(chat.getHTML());
expectType<string>(chat.export());
