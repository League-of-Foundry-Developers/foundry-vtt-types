import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { BaseItem } from "../../../../src/foundry/common/documents/module.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ArmorModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<(typeof ArmorModel)["defineSchema"]>> {}
class ArmorModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<(typeof ArmorModel)["defineSchema"]>>,
  foundry.documents.BaseActor | null
> {
  static override defineSchema() {
    return {
      /** The protective value of the armor */
      armorValue: new foundry.data.fields.NumberField(),
    };
  }

  /** Get the weight of the armor. */
  get weight(): number {
    return 42;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WeaponModel
  extends foundry.data.fields.SchemaField.InnerInitializedType<ReturnType<(typeof WeaponModel)["defineSchema"]>> {}
class WeaponModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<(typeof WeaponModel)["defineSchema"]>>,
  foundry.documents.BaseActor | null
> {
  static override defineSchema() {
    return {
      /** The attack speed of the weapon */
      attackSpeed: new foundry.data.fields.NumberField({ nullable: false, required: true }),
      /** The damage per hit of the weapon */
      damagePerHit: new foundry.data.fields.NumberField({ nullable: false, required: true }),
    };
  }

  /** Get the damage of the weapon. */
  get damage(): number {
    return this.attackSpeed * this.damagePerHit;
  }
}

declare global {
  interface SystemConfig {
    Item: {
      armor: ArmorModel;
      weapon: WeaponModel;
    };
  }
}

expectType<foundry.documents.BaseItem<"armor">>(new foundry.documents.BaseItem({ name: "Plate", type: "armor" }));
expectType<foundry.documents.BaseItem<"weapon">>(new foundry.documents.BaseItem({ name: "Sword", type: "weapon" }));
expectError(new foundry.documents.BaseItem({ name: "Junk", type: "foo" }));

const armorModel = new ArmorModel();
const weaponModel = new WeaponModel();

expectType<foundry.documents.BaseItem<"armor">>(
  new foundry.documents.BaseItem({ name: "Plate", type: "armor", system: { armorValue: 42 } }),
);
expectType<foundry.documents.BaseItem<"armor">>(
  new foundry.documents.BaseItem({ name: "Plate", type: "armor", system: armorModel }),
);
expectType<foundry.documents.BaseItem<"weapon">>(
  new foundry.documents.BaseItem({ name: "Sword", type: "weapon", system: { attackSpeed: 1, damagePerHit: 2 } }),
);
expectType<foundry.documents.BaseItem<"weapon">>(
  new foundry.documents.BaseItem({ name: "Sword", type: "weapon", system: weaponModel }),
);
expectError(new foundry.documents.BaseItem({ name: "Sword", type: "weapon", system: { damage: 34 } }));
expectError(new foundry.documents.BaseItem({ name: "Sword", type: "weapon", system: { foo: "bar" } }));

const armorItem = new foundry.documents.BaseItem({ name: "Plate", type: "armor" });
const weaponItem = new foundry.documents.BaseItem({ name: "Sword", type: "weapon" });

expectType<Promise<foundry.documents.BaseItem<"armor"> | undefined>>(armorItem.update({ system: { armorValue: 24 } }));
expectType<Promise<foundry.documents.BaseItem<"armor"> | undefined>>(armorItem.update({ system: armorModel }));
expectType<Promise<foundry.documents.BaseItem<"weapon"> | undefined>>(
  weaponItem.update({ system: { attackSpeed: 1, damagePerHit: 2 } }),
);
expectType<Promise<foundry.documents.BaseItem<"weapon"> | undefined>>(weaponItem.update({ system: weaponModel }));
expectError(weaponItem.update({ system: { foo: "bar" } }));

expectType<object>(armorItem.updateSource({ system: { armorValue: 24 } }));
expectType<object>(armorItem.updateSource({ system: armorModel }));
expectType<object>(weaponItem.updateSource({ system: { attackSpeed: 1, damagePerHit: 2 } }));
expectType<object>(weaponItem.updateSource({ system: weaponModel }));
expectError(weaponItem.updateSource({ system: { foo: "bar" } }));

expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseItem>>(weaponItem.effects);
expectType<ActiveEffectData>(weaponItem._source.effects[0]);
expectType<EffectDurationData>(weaponItem._source.effects[0].duration);
expectType<BaseItem | undefined>(weaponItem.parent?.items.get("", { strict: true }));

expectType<"armor">(armorItem.type);
expectType<ArmorModel>(armorItem.system);
expectType<number | null | undefined>(armorItem._source.system.armorValue);
expectType<number | null | undefined>(armorItem.system._source.armorValue);
expectError(armorItem._source.system.weight);
expectType<number | null | undefined>(armorItem.system.armorValue);
expectType<number>(armorItem.system.weight);

expectType<"weapon">(weaponItem.type);
expectType<WeaponModel>(weaponItem.system);
expectType<number>(weaponItem._source.system.attackSpeed);
expectType<number>(weaponItem._source.system.damagePerHit);
expectType<number>(weaponItem.system._source.attackSpeed);
expectType<number>(weaponItem.system._source.damagePerHit);
expectError(weaponItem._source.system.damage);
expectType<number>(weaponItem.system.attackSpeed);
expectType<number>(weaponItem.system.damagePerHit);
expectType<number>(weaponItem.system.damage);

declare const unknownItem: foundry.documents.BaseItem;
expectType<"armor" | "weapon">(unknownItem.type);
expectType<ArmorModel | WeaponModel>(unknownItem.system);

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
declare global {
  interface FlagConfig {
    Item: {
      "my-system": {
        countable: boolean;
      };
    };
  }
}
expectType<{ countable: boolean }>(weaponItem.flags["my-system"]);

expectType<boolean>(weaponItem.getFlag("my-system", "countable"));
expectType<never>(weaponItem.getFlag("my-system", "unknown-key"));
expectType<unknown>(weaponItem.getFlag("another-system", "value"));

expectType<Promise<BaseItem>>(weaponItem.setFlag("my-system", "countable", true));
expectError(weaponItem.setFlag("my-system", "countable", 2));
expectError(weaponItem.setFlag("my-system", "unknown-key", 2));
expectType<Promise<BaseItem>>(weaponItem.setFlag("another-system", "value", true));
