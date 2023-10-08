import type { ActiveEffectDataSource } from "../../../../src/foundry/common/data/data.mjs/activeEffectData";
import type {
  EffectChangeData,
  EffectChangeDataProperties,
} from "../../../../src/foundry/common/data/data.mjs/effectChangeData";
import { expectError, expectType } from "tsd";

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectType<EffectChangeDataProperties[]>(baseActiveEffect.toJSON().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject().changes);
expectType<EffectChangeDataProperties[]>(baseActiveEffect.toObject(true).changes);
expectType<EffectChangeData[]>(baseActiveEffect.toObject(false).changes);

const item = await Item.create({ name: "Some Item", type: "weapon" });
if (item) {
  expectType<EffectChangeData[]>(item.toObject(false).effects[0].changes);
  expectType<ActiveEffectDataSource[]>(item.toObject().effects);
}

declare const bool: boolean;

expectType<Promise<Macro | undefined>>(foundry.documents.BaseMacro.create({ name: "" }, { temporary: bool }));
expectType<Promise<Macro | undefined>>(foundry.documents.BaseMacro.create({ name: "" }, { temporary: true }));
expectType<Promise<StoredDocument<Macro> | undefined>>(foundry.documents.BaseMacro.create({ name: "" }));
expectType<Promise<StoredDocument<Macro> | undefined>>(
  foundry.documents.BaseMacro.create({ name: "" }, { temporary: false }),
);

expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.createDocuments([], { temporary: bool }));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.createDocuments([], { temporary: true }));
expectType<Promise<StoredDocument<Macro>[]>>(foundry.documents.BaseMacro.createDocuments([]));
expectType<Promise<StoredDocument<Macro>[]>>(foundry.documents.BaseMacro.createDocuments([], { temporary: false }));

expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.updateDocuments([]));
expectType<Promise<Macro[]>>(foundry.documents.BaseMacro.deleteDocuments([]));
const user = await User.create({ name: "Some User" });
if (user) {
  expectType<boolean>(user.testUserPermission(user, "NONE"));
  expectType<boolean>(user.testUserPermission(user, "OBSERVER", {}));
  expectType<boolean>(user.testUserPermission(user, "LIMITED", { exact: true }));
  expectType<boolean>(user.testUserPermission(user, "OWNER", { exact: false }));
}

// test creation of embedded documents
declare const actor: Actor;
expectType<Promise<foundry.abstract.Document<any, Actor>[]>>(
  actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: true }),
);
expectType<Promise<foundry.abstract.Document<any, Actor>[]>>(
  actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: bool }),
);
expectType<Promise<StoredDocument<foundry.abstract.Document<any, Actor>>[]>>(
  actor.createEmbeddedDocuments("ActiveEffect", [], { temporary: false }),
);
expectType<Promise<StoredDocument<foundry.abstract.Document<any, Actor>>[]>>(
  actor.createEmbeddedDocuments("ActiveEffect", []),
);

// verify that document lifecycle methods work with source data is possible

if (item) {
  expectType<Promise<StoredDocument<Item>[]>>(Item.createDocuments([item.toObject()]));
  expectType<Promise<StoredDocument<Item> | undefined>>(Item.create(item.toObject()));
  expectType<Promise<Item[]>>(Item.updateDocuments([item.toObject()]));
  expectType<Promise<StoredDocument<Item> | undefined>>(item.update(item.toObject()));
  expectType<Item | Promise<Item | undefined>>(item.clone(item.toObject()));
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
expectType<{ value: boolean; value2: number }>(combatant.data.flags["my-system"]);
expectType<{ value: boolean } | undefined>(combatant.data.flags["my-optional-system"]);

expectType<boolean>(combatant.getFlag("my-system", "value"));
expectType<number>(combatant.getFlag("my-system", "value2"));
expectType<never>(combatant.getFlag("my-system", "unknown-key"));
expectType<unknown>(combatant.getFlag("another-system", "value"));
expectType<boolean | undefined>(combatant.getFlag("my-optional-system", "value"));

expectType<Promise<Combatant>>(combatant.setFlag("my-system", "value", true));
expectError(combatant.setFlag("my-system", "value", 2));
expectError(combatant.setFlag("my-system", "unknown-key", 2));
expectType<Promise<Combatant>>(combatant.setFlag("my-optional-system", "value", true));
expectError(combatant.setFlag("my-optional-system", "value", undefined));
expectType<Promise<Combatant>>(combatant.setFlag("another-system", "value", true));

expectType<Promise<Combatant>>(combatant.unsetFlag("my-system", "value"));
expectType<Promise<Combatant>>(combatant.unsetFlag("my-optional-system", "value"));
expectType<Promise<Combatant>>(combatant.unsetFlag("another-system", "value"));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyCombatant extends Combatant {
  setSomeFlag() {
    expectType<{ value: boolean; value2: number }>(this.data.flags["my-system"]);
    expectType<{ value: boolean } | undefined>(this.data.flags["my-optional-system"]);

    expectType<boolean>(this.getFlag("my-system", "value"));
    expectType<unknown>(this.getFlag("another-system", "value"));

    expectType<Promise<this>>(this.setFlag("my-system", "value", true));
    expectType<Promise<this>>(this.setFlag("another-system", "value", true));
  }
}
