import { expectError, expectType } from 'tsd';

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

expectError(new foundry.data.CardsData());
expectError(new foundry.data.CardsData({}));
expectType<foundry.data.CardsData>(new foundry.data.CardsData({ name: 'Some Cards' }));

expectError(new foundry.data.CardsData({ name: 'Some Cards With Wrong Type', type: 'foo' }));

const cardsData = new foundry.data.CardsData({ name: 'Some Deck', type: 'french' });

expectType<foundry.data.CardsData>(cardsData);
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
