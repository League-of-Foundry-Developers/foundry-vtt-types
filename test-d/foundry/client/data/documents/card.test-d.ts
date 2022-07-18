import { expectError, expectType } from 'tsd';
import type DataModel from '../../../../../src/foundry/common/abstract/data.mjs';
import type { BaseCardFaceSchema } from '../../../../../src/foundry/common/documents/card.mjs.js';

const card = new Card({ name: 'Just a deck of cards' });
const cards = new Cards({ name: 'Some Card Deck', type: 'german' });

expectType<DataModel.SchemaToData<BaseCardFaceSchema>>(card.back);
expectType<number | null>(card.face);
expectType<string | null>(card.back.name);
expectType<string>(card.back.img);
expectType<string>(card.img);
expectType<Cards | undefined | null>(card.source);
expectType<boolean>(card.isHome);
expectType<boolean>(card.showFace);
expectType<boolean>(card.hasNextFace);
expectType<boolean>(card.hasPreviousFace);

// flip
expectType<Promise<Card | undefined>>(card.flip());
expectType<Promise<Card | undefined>>(card.flip(1));
expectType<Promise<Card | undefined>>(card.flip(null));
expectType<Promise<Card | undefined>>(card.flip(undefined));

// pass
expectType<Promise<Card | undefined>>(card.pass(cards));
expectType<Promise<Card | undefined>>(
  card.pass(cards, {
    action: 'some custom action',
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(card.pass(cards, { unknownProp: 0 }));
expectError(card.pass(cards, { updateData: { unknownProp: 0 } }));

// play
expectType<Promise<Card | undefined>>(card.play(cards));
expectType<Promise<Card | undefined>>(
  card.play(cards, {
    action: 'some custom action',
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(card.play(cards, { unknownProp: 0 }));
expectError(card.play(cards, { updateData: { unknownProp: 0 } }));

// discard
expectType<Promise<Card | undefined>>(card.discard(cards));
expectType<Promise<Card | undefined>>(
  card.discard(cards, {
    action: 'some custom action',
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(card.discard(cards, { unknownProp: 0 }));
expectError(card.discard(cards, { updateData: { unknownProp: 0 } }));

// discard
expectType<Promise<Card>>(card.reset());
expectType<Promise<Card>>(
  card.reset({
    updateData: { value: 3 },
    chatNotification: true
  })
);
expectError(card.reset({ unknownProp: 0 }));
expectError(card.reset({ updateData: { unknownProp: 0 } }));

// toMessage
expectType<Promise<ChatMessage | undefined>>(card.toMessage());
expectType<Promise<ChatMessage | undefined>>(
  card.toMessage(
    {
      speaker: {
        alias: 'The Speaker'
      }
    },
    {
      noHook: true
    }
  )
);
