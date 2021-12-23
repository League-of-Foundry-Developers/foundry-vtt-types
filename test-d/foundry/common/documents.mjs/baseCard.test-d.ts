import { expectError, expectType } from 'tsd';

import type { PropertiesToSource } from '../../../../src/types/helperTypes';
import type { CardFaceDataProperties } from '../../../../src/foundry/common/data/data.mjs/cardFaceData.js';

const baseCard = new foundry.documents.BaseCard();
expectType<PropertiesToSource<CardFaceDataProperties>>(baseCard.data._source.faces[0]);

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

expectType<'old' | 'uno'>(baseCard.data.type);
expectType<Cards | null>(baseCard.parent);

if (baseCard.data._source.type === 'old') {
  expectType<'grubby'>(baseCard.data._source.data.condition);
  expectError(baseCard.data._source.data.age);
} else {
  expectType<boolean>(baseCard.data._source.data.special);
  expectError(baseCard.data._source.data.color);
}

if (baseCard.data.type === 'old') {
  expectType<'grubby'>(baseCard.data.data.condition);
  expectType<number>(baseCard.data.data.age);
} else {
  expectType<boolean>(baseCard.data.data.special);
  expectType<string>(baseCard.data.data.color);
}

// Flags for Actor, Items, Card, and Cards documents can be configured via the SourceConfig. This is tested here.
// For configuring flags via FlagConfig please take a look into baseItem.test-d.ts.
// shared flags are available
expectType<boolean>(baseCard.getFlag('my-module', 'someProp'));
// non shared flags are not available
expectType<never>(baseCard.getFlag('my-module', 'marked'));
expectType<never>(baseCard.getFlag('my-module', 'folded'));
// non shared flags are also not available if the type is known
if (baseCard.data._source.type === 'old') {
  expectType<never>(baseCard.getFlag('my-module', 'marked'));
}
if (baseCard.data.type === 'uno') {
  expectType<never>(baseCard.getFlag('my-module', 'folded'));
}
