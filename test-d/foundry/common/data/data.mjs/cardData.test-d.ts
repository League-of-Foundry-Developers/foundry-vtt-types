import { expectError, expectType } from 'tsd';

interface OldCardDataSourceData {
  condition: 'grubby';
}

interface OldCardFlags {
  'my-module': {
    someProp: boolean;
    marked: boolean;
  };
}

interface OldCardDataSource {
  type: 'old';
  data: OldCardDataSourceData;
  flags: OldCardFlags;
}

interface UnoCardDataSourceData {
  special: boolean;
}

interface UnoCardFlags {
  'my-module': {
    someProp: boolean;
    folded: boolean;
  };
}

interface UnoCardDataSource {
  type: 'uno';
  data: UnoCardDataSourceData;
  flags: UnoCardFlags;
}

interface OldCardDataPropertiesData extends OldCardDataSourceData {
  age: number;
}

interface OldCardDataProperties {
  type: 'old';
  data: OldCardDataPropertiesData;
  flags: OldCardFlags;
}

interface UnoCardDataPropertiesData extends UnoCardDataSourceData {
  color: string;
}

interface UnoCardDataProperties {
  type: 'uno';
  data: UnoCardDataPropertiesData;
  flags: UnoCardFlags;
}

type MyCardDataSource = OldCardDataSource | UnoCardDataSource;
type MyCardDataProperties = OldCardDataProperties | UnoCardDataProperties;

declare global {
  interface DataConfig {
    Card: MyCardDataProperties;
  }

  interface SourceConfig {
    Card: MyCardDataSource;
  }
}

expectError(new foundry.data.CardData());
expectError(new foundry.data.CardData({}));
expectType<foundry.data.CardData>(new foundry.data.CardData({ name: 'Some Card' }));

expectError(new foundry.data.CardData({ name: 'Some Card With Wrong Type', type: 'foo' }));

const cardData = new foundry.data.CardData({ name: 'Some Card', face: 42, type: 'old' });

expectType<foundry.data.CardData>(cardData);
expectType<'old' | 'uno'>(cardData.type);
if (cardData._source.type === 'old') {
  expectType<'grubby'>(cardData._source.data.condition);
  expectError(cardData._source.data.age);
} else {
  expectType<boolean>(cardData._source.data.special);
  expectError(cardData._source.data.color);
}

if (cardData.type === 'old') {
  expectType<'grubby'>(cardData.data.condition);
  expectType<number>(cardData.data.age);
} else {
  expectType<boolean>(cardData.data.special);
  expectType<string>(cardData.data.color);
}
