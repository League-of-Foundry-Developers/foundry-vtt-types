import { expectType } from 'tsd';

interface ArmorDataSourceData {
  armorValue: number;
}

interface WeaponDataSourceData {
  damagePerHit: number;
  attackSpeed: number;
}

interface ArmorDataPropertiesData extends ArmorDataSourceData {
  weight: number;
}

declare global {
  interface DataConfig {
    Item: {
      armor: ArmorDataPropertiesData;
      weapon: WeaponDataPropertiesData;
    };
  }

  interface SourceConfig {
    Item: {
      armor: ArmorDataSourceData;
      weapon: WeaponDataSourceData;
    };
  }
}

const item = await Item.create({ name: 'Mighty Axe of Killing', type: 'weapon', system: { foo: 1 } });
if (item) {
  expectType<Actor | null>(item.actor);
  expectType<string | null | undefined>(item.img);
  expectType<boolean>(item.isOwned);
  expectType<ActiveEffect[]>(item.transferredEffects);
  expectType<'weapon' | 'armor'>(item.type);
  expectType<object>(item.getRollData());
}
