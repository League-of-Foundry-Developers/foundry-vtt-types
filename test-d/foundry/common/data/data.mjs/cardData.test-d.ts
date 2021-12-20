import { expectError, expectType } from 'tsd';

interface OldCardDataSourceData {
  condition: 'grubby';
}

interface OldCardDataSource {
  type: 'old';
  data: OldCardDataSourceData;
}

interface UnoCardDataSourceData {
  special: boolean;
}

interface UnoCardDataSource {
  type: 'uno';
  data: UnoCardDataSourceData;
}

interface OldCardDataPropertiesData extends OldCardDataSourceData {
  age: number;
}

interface OldCardDataProperties {
  type: 'old';
  data: OldCardDataPropertiesData;
}

interface UnoCardDataPropertiesData extends UnoCardDataSourceData {
  color: string;
}

interface UnoCardDataProperties {
  type: 'uno';
  data: UnoCardDataPropertiesData;
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
