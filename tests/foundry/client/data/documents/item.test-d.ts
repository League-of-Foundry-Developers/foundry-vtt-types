import { expectTypeOf } from "vitest";

declare namespace ArmorData {
  export interface Schema extends DataSchema {
    defense: foundry.data.fields.NumberField;
  }
}

declare namespace WeaponData {
  export interface Schema extends DataSchema {
    attack: foundry.data.fields.NumberField;
  }
}

export class ArmorData extends foundry.abstract.TypeDataModel<ArmorData.Schema, Item> {}

export class WeaponData extends foundry.abstract.TypeDataModel<WeaponData.Schema, Item> {}

declare global {
  interface DataModelConfig {
    Item: {
      armor: ArmorData;
      weapon: WeaponData;
    };
  }
}

const item = await Item.create({ name: "Mighty Axe of Killing", type: "weapon" });
if (item) {
  expectTypeOf(item.actor).toEqualTypeOf<Actor | null>();
  expectTypeOf(item.img).toEqualTypeOf<string | null | undefined>();
  expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
  expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect[]>();
  expectTypeOf(item.type).toEqualTypeOf<"weapon" | "armor" | "base">();
  expectTypeOf(item.getRollData()).toEqualTypeOf<object>();
  expectTypeOf(item.system).toEqualTypeOf<WeaponData | ArmorData | object>();

  if (item.system instanceof WeaponData) {
    expectTypeOf(item.system.attack).toEqualTypeOf<number | null | undefined>();
  }
}
