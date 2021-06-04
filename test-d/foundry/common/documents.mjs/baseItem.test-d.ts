import { expectType } from 'tsd';
import '../../../../index';
import EmbeddedCollection from '../../../../src/foundry/common/abstract/embedded-collection.mjs';
import { PropertiesToSource } from '../../../../src/types/helperTypes';
import { ActiveEffectDataProperties } from '../../../../src/foundry/common/data/data.mjs/activeEffectData';
import { EffectDurationDataProperties } from '../../../../src/foundry/common/data/data.mjs/effectDurationData';

const baseItem = new foundry.documents.BaseItem();
expectType<EmbeddedCollection<typeof ActiveEffect, foundry.data.ItemData>>(baseItem.effects);
expectType<PropertiesToSource<ActiveEffectDataProperties>>(baseItem.data._source.effects[0]);
expectType<EffectDurationDataProperties | undefined>(baseItem.data._source.effects[0].duration);

interface WeaponData extends foundry.data.ItemData {
  type: 'weapon';
  data: {
    attackSpeed: number;
    damage: number;
  };
}

interface ArmorData extends foundry.data.ItemData {
  type: 'armor';
  data: {
    armorValue: number;
  };
}

declare global {
  interface DataConfig {
    Item: WeaponData | ArmorData;
  }
}

expectType<'weapon' | 'armor'>(baseItem.data.type);

if (baseItem.data.type === 'armor') {
  expectType<number>(baseItem.data.data.armorValue);
}
