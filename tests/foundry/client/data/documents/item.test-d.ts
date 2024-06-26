import { expectTypeOf } from "vitest";

export class ArmorDataModel extends foundry.abstract.TypeDataModel<DataSchema, Item> {}

export class WeaponDataModel extends foundry.abstract.TypeDataModel<DataSchema, Item> {}

declare global {
  interface DataModelConfig {
    Item: {
      armor: ArmorDataModel;
      weapon: WeaponDataModel;
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
}
