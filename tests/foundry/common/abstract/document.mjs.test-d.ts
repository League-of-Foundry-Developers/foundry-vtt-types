import type { ActiveEffectDataSource } from "../../../../src/foundry/common/data/data.mjs/activeEffectData";
import type {
  EffectChangeData,
  EffectChangeDataProperties,
} from "../../../../src/foundry/common/data/data.mjs/effectChangeData";
import { expectTypeOf } from "vitest";

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectTypeOf(baseActiveEffect.toJSON().changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(baseActiveEffect.toObject().changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(baseActiveEffect.toObject(true).changes).toEqualTypeOf<EffectChangeDataProperties[]>();
expectTypeOf(baseActiveEffect.toObject(false).changes).toEqualTypeOf<EffectChangeData[]>();

const item = await Item.create({ name: "Some Item", type: "weapon" });
if (item) {
  expectTypeOf(item.toObject(false).effects[0].changes).toEqualTypeOf<EffectChangeData[]>();
  expectTypeOf(item.toObject().effects).toEqualTypeOf<ActiveEffectDataSource[]>();
}

declare const bool: boolean;

expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: bool })).toEqualTypeOf<
  Promise<Macro | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: true })).toEqualTypeOf<
  Promise<Macro | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" })).toEqualTypeOf<
  Promise<StoredDocument<Macro> | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<Macro> | undefined>
>();

expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: bool })).toEqualTypeOf<Promise<Macro[]>>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: true })).toEqualTypeOf<Promise<Macro[]>>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([])).toEqualTypeOf<Promise<StoredDocument<Macro>[]>>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<Macro>[]>
>();

expectTypeOf(foundry.documents.BaseMacro.updateDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
expectTypeOf(foundry.documents.BaseMacro.deleteDocuments([])).toEqualTypeOf<Promise<Macro[]>>();
const user = await User.create({ name: "Some User" });
if (user) {
  expectTypeOf(user.testUserPermission(user, "NONE")).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "OBSERVER", {})).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "LIMITED", { exact: true })).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "OWNER", { exact: false })).toEqualTypeOf<boolean>();
}

// test creation of embedded documents
declare const actor: Actor;
expectTypeOf(actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: true })).toEqualTypeOf<
  Promise<foundry.abstract.Document<any, Actor>[]>
>();
expectTypeOf(actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: bool })).toEqualTypeOf<
  Promise<foundry.abstract.Document<any, Actor>[]>
>();
expectTypeOf(actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<foundry.abstract.Document<any, Actor>>[]>
>();
expectTypeOf(actor.createEmbeddedDocuments("ActiveEffect", [])).toEqualTypeOf<
  Promise<StoredDocument<foundry.abstract.Document<any, Actor>>[]>
>();

// verify that document lifecycle methods work with source data is possible

if (item) {
  expectTypeOf(Item.createDocuments([item.toObject()])).toEqualTypeOf<Promise<StoredDocument<Item>[]>>();
  expectTypeOf(Item.create(item.toObject())).toEqualTypeOf<Promise<StoredDocument<Item> | undefined>>();
  expectTypeOf(Item.updateDocuments([item.toObject()])).toEqualTypeOf<Promise<Item[]>>();
  expectTypeOf(item.update(item.toObject())).toEqualTypeOf<Promise<StoredDocument<Item> | undefined>>();
  expectTypeOf(item.clone(item.toObject())).toEqualTypeOf<Item | Promise<Item | undefined>>();
}

declare global {
  interface FlagConfig {
    Combatant: {
      "my-system": {
        value: boolean;
        value2: number;
      };
      "my-optional-system"?: {
        value: boolean;
      };
    };
  }
}

const combatant = new Combatant({}, {});
expectTypeOf(combatant.data.flags["my-system"]).toEqualTypeOf<{ value: boolean; value2: number }>();
expectTypeOf(combatant.data.flags["my-optional-system"]).toEqualTypeOf<{ value: boolean } | undefined>();

expectTypeOf(combatant.getFlag("my-system", "value")).toEqualTypeOf<boolean>();
expectTypeOf(combatant.getFlag("my-system", "value2")).toEqualTypeOf<number>();
expectTypeOf(combatant.getFlag("my-system", "unknown-key")).toEqualTypeOf<never>();
expectTypeOf(combatant.getFlag("another-system", "value")).toEqualTypeOf<unknown>();
expectTypeOf(combatant.getFlag("my-optional-system", "value")).toEqualTypeOf<boolean | undefined>();

expectTypeOf(combatant.setFlag("my-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

// @ts-expect-error - the flag my-system.value is a boolean and not a number
combatant.setFlag("my-system", "value", 2);

// @ts-expect-error - the flag my-system.unknown-key doesn't exist
combatant.setFlag("my-system", "unknown-key", 2);

expectTypeOf(combatant.setFlag("my-optional-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

// @ts-expect-error - an optional system with a required flag can't be assigned an undefined value
combatant.setFlag("my-optional-system", "value", undefined);

expectTypeOf(combatant.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

expectTypeOf(combatant.unsetFlag("my-system", "value")).toEqualTypeOf<Promise<Combatant>>();
expectTypeOf(combatant.unsetFlag("my-optional-system", "value")).toEqualTypeOf<Promise<Combatant>>();
expectTypeOf(combatant.unsetFlag("another-system", "value")).toEqualTypeOf<Promise<Combatant>>();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyCombatant extends Combatant {
  setSomeFlag() {
    expectTypeOf(this.data.flags["my-system"]).toEqualTypeOf<{ value: boolean; value2: number }>();
    expectTypeOf(this.data.flags["my-optional-system"]).toEqualTypeOf<{ value: boolean } | undefined>();

    expectTypeOf(this.getFlag("my-system", "value")).toEqualTypeOf<boolean>();
    expectTypeOf(this.getFlag("another-system", "value")).toEqualTypeOf<unknown>();

    expectTypeOf(this.setFlag("my-system", "value", true)).toEqualTypeOf<Promise<this>>();
    expectTypeOf(this.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<this>>();
  }
}
