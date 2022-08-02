import { expectError, expectType } from 'tsd';

import type EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import type { CardDataSource } from '../../../../src/foundry/common/data/data.mjs.d.ts/cardData';
import type { CardFaceDataSource } from '../../../../src/foundry/common/data/data.mjs.d.ts/cardFaceData';

const baseCards = new foundry.documents.BaseCards();
expectType<EmbeddedCollection<typeof Card, foundry.documents.BaseCards>>(baseCards.cards);
expectType<CardDataSource>(baseCards.data._source.cards[0]);
expectType<CardFaceDataSource>(baseCards.data._source.cards[0].faces[0]);

interface GermanDeckDataSourceData {
  mostUsedGame: 'Skat';
}

interface GermanDeckDataSource {
  type: 'german';
  data: GermanDeckDataSourceData;
}

interface FrenchDeckDataSourceData {
  coolUse: 'throwing cards';
}

interface FrenchDeckDataSource {
  type: 'french';
  data: FrenchDeckDataSourceData;
}

interface GermanDeckDataPropertiesData extends GermanDeckDataSourceData {
  mostUsedBy: 'older players';
}

interface GermanDeckDataProperties {
  type: 'german';
  data: GermanDeckDataPropertiesData;
}

interface FrenchDeckDataPropertiesData extends FrenchDeckDataSourceData {
  possibleInjuries: 'card stuck in eye';
}

interface FrenchDeckDataProperties {
  type: 'french';
  data: FrenchDeckDataPropertiesData;
}

type MyCardsDataSource = GermanDeckDataSource | FrenchDeckDataSource;
type MyCardsDataProperties = GermanDeckDataProperties | FrenchDeckDataProperties;

declare global {
  interface DataConfig {
    Cards: MyCardsDataProperties;
  }

  interface SourceConfig {
    Cards: MyCardsDataSource;
  }
}

expectType<'french' | 'german'>(baseCards.data.type);
expectType<'french' | 'german'>(baseCards.type);
expectType<null>(baseCards.parent);

if (baseCards.data._source.type === 'french') {
  expectType<'throwing cards'>(baseCards.data._source.data.coolUse);
  expectError(baseCards.data._source.data.possibleInjuries);
} else {
  expectType<'Skat'>(baseCards.data._source.data.mostUsedGame);
  expectError(baseCards.data._source.data.mostUsedBy);
}

if (baseCards.data.type === 'french') {
  expectType<'throwing cards'>(baseCards.data.data.coolUse);
  expectType<'card stuck in eye'>(baseCards.data.data.possibleInjuries);
} else {
  expectType<'Skat'>(baseCards.data.data.mostUsedGame);
  expectType<'older players'>(baseCards.data.data.mostUsedBy);
}

expectError(new foundry.documents.BaseCards());
expectError(new foundry.documents.BaseCards({}));
expectType<foundry.documents.BaseCards>(new foundry.documents.BaseCards({ name: 'Some Cards' }));

expectError(new foundry.documents.BaseCards({ name: 'Some Cards With Wrong Type', type: 'foo' }));

const cardsData = new foundry.documents.BaseCards({ name: 'Some Deck', type: 'french' });

expectType<foundry.documents.BaseCards>(cardsData);
expectType<'french' | 'german'>(cardsData.type);
if (cardsData._source.type === 'french') {
  expectType<'throwing cards'>(cardsData._source.data.coolUse);
  expectError(cardsData._source.data.possibleInjuries);
} else {
  expectType<'Skat'>(cardsData._source.data.mostUsedGame);
  expectError(cardsData._source.data.mostUsedBy);
}

if (cardsData.type === 'french') {
  expectType<'throwing cards'>(cardsData.data.coolUse);
  expectType<'card stuck in eye'>(cardsData.data.possibleInjuries);
} else {
  expectType<'Skat'>(cardsData.data.mostUsedGame);
  expectType<'older players'>(cardsData.data.mostUsedBy);
}
