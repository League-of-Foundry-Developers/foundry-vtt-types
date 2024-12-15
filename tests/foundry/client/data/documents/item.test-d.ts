import { expectTypeOf } from "vitest";

declare namespace ArmorData {
  interface Schema extends DataSchema {
    defense: foundry.data.fields.NumberField;
  }
}

declare namespace WeaponData {
  interface Schema extends DataSchema {
    attack: foundry.data.fields.NumberField;
  }
}

export class ArmorData extends foundry.abstract.TypeDataModel<ArmorData.Schema, Item> {}

export class WeaponData extends foundry.abstract.TypeDataModel<WeaponData.Schema, Item> {}

declare global {
  interface DataModelConfig {
    Item: {
      armor: typeof ArmorData;
      weapon: typeof WeaponData;
    };
  }
}

// @ts-expect-error - Item requires name.
new Item();

// @ts-expect-error - Item requires name.
new Item({});

const item = new Item({ name: "Mighty Axe of Killing", type: "weapon" });

expectTypeOf(item.actor).toEqualTypeOf<Actor | null>();
expectTypeOf(item.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(item.isOwned).toEqualTypeOf<boolean>();
expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect[]>();
expectTypeOf(item.type).toEqualTypeOf<"weapon" | "armor" | "base">();
expectTypeOf(item.getRollData()).toEqualTypeOf<object>();
