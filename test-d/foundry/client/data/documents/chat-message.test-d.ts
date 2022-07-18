import { expectError, expectType } from 'tsd';
import type DataModel from '../../../../../src/foundry/common/abstract/data.mjs';

expectType<ChatMessage>(new ChatMessage());
expectType<ChatMessage>(new ChatMessage({}));

expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.BLIND)
);
expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PRIVATE)
);
expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.PUBLIC)
);
expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode({}, CONST.DICE_ROLL_MODES.SELF)
);

expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode(new foundry.documents.BaseChatMessage(), 'roll')
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

expectType<DataModel.SchemaToSourceInput<foundry.documents.BaseChatMessage['schema']>>(
  ChatMessage.applyRollMode(new foundry.documents.BaseChatMessage(), 'custom-roll-mode')
);

expectError(ChatMessage.applyRollMode(new foundry.documents.BaseChatMessage(), 'unknown-roll-mode'));

expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker());
expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker({}));
if (game instanceof Game) {
  expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker({ scene: game.scenes?.active }));
  expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker({ actor: game.user?.character }));
  expectType<foundry.documents.BaseChatMessage['speaker']>(
    ChatMessage.getSpeaker({
      scene: game.scenes?.active,
      actor: game.user?.character,
      token: new TokenDocument(),
      alias: 'Mario'
    })
  );
}
expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker({ token: new TokenDocument() }));
expectType<foundry.documents.BaseChatMessage['speaker']>(ChatMessage.getSpeaker({ alias: 'Mario' }));

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
