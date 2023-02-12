import { expectError, expectType } from "tsd";

import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.mjs";
import type { BaseItem } from "../../../../src/foundry/common/documents/module.mjs";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ArmorModel
  extends foundry.data.fields.SchemaField.InitializedType<ReturnType<typeof ArmorModel["defineSchema"]>> {}
class ArmorModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof ArmorModel["defineSchema"]>>,
  foundry.documents.BaseActor | null
> {
  static override defineSchema() {
    return {
      /** The protective value of the armor */
      armorValue: new foundry.data.fields.NumberField()
    };
  }

  /** Get the weight of the armor. */
  get weight(): number {
    return 42;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface WeaponModel
  extends foundry.data.fields.SchemaField.InitializedType<ReturnType<typeof WeaponModel["defineSchema"]>> {}
class WeaponModel extends foundry.abstract.DataModel<
  foundry.data.fields.SchemaField<ReturnType<typeof WeaponModel["defineSchema"]>>,
  foundry.documents.BaseActor | null
> {
  static override defineSchema() {
    return {
      /** The attack speed of the weapon */
      attackSpeed: new foundry.data.fields.NumberField<
        { nullable: false },
        foundry.data.fields.NumberField.DefaultAssignmentType,
        Exclude<foundry.data.fields.NumberField.DefaultInitializedType, null>,
        Exclude<foundry.data.fields.NumberField.DefaultPersistedType, null>
      >({
        nullable: false
      }),
      /** The damage per hit of the weapon */
      damagePerHit: new foundry.data.fields.NumberField<
        { nullable: false },
        foundry.data.fields.NumberField.DefaultAssignmentType,
        Exclude<foundry.data.fields.NumberField.DefaultInitializedType, null>,
        Exclude<foundry.data.fields.NumberField.DefaultPersistedType, null>
      >({
        nullable: false
      })
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

expectType<foundry.documents.BaseItem<"armor">>(new foundry.documents.BaseItem({ name: "plate", type: "armor" }));
expectType<foundry.documents.BaseItem<"weapon">>(new foundry.documents.BaseItem({ name: "plate", type: "weapon" }));
expectError(new foundry.documents.BaseItem({ name: "plate", type: "foo" }));

expectType<foundry.documents.BaseItem<"armor">>(
  new foundry.documents.BaseItem({ name: "plate", type: "armor", system: { armorValue: 42 } })
);
expectType<foundry.documents.BaseItem<"weapon">>(
  new foundry.documents.BaseItem({ name: "plate", type: "weapon", system: { attackSpeed: 1, damagePerHit: 2 } })
);
expectError(new foundry.documents.BaseItem({ name: "plate", type: "weapon", system: { foo: "bar" } }));

const armorItem = new foundry.documents.BaseItem({ name: "plate", type: "armor" });
const weaponItem = new foundry.documents.BaseItem({ name: "sword", type: "weapon" });

expectType<EmbeddedCollection<typeof ActiveEffect, foundry.documents.BaseItem>>(weaponItem.effects);
expectType<ActiveEffectData>(weaponItem._source.effects[0]);
expectType<EffectDurationData>(weaponItem._source.effects[0].duration);
expectType<Item | undefined>(weaponItem.parent?.items.get("", { strict: true }));

expectType<"armor">(armorItem.type);
expectType<ArmorModel>(armorItem.system);
expectType<number | null>(armorItem._source.system.armorValue);
expectType<number | null>(armorItem.system._source.armorValue);
expectError(armorItem._source.system.weight);
expectType<number | null>(armorItem.system.armorValue);
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

declare const unknownItem: foundry.documents.BaseItem<"armor" | "weapon">;
expectType<"armor" | "weapon">(unknownItem.type);
expectType<ArmorModel | WeaponModel>(unknownItem.system);

// Flags for Actor, Item, Card, and Cards documents can be configured via the FlagConfig. This is tested here.
// For configuring flags for actors and items via SourceConfig please have a look into baseActor.test-d.ts.
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
