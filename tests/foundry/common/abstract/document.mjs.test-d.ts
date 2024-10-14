import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../src/types/utils.d.mts";
import type BaseActiveEffect from "../../../../src/foundry/common/documents/active-effect.d.mts";
import type { ConfiguredDocumentInstance, DatabaseOperationsFor } from "../../../../src/types/helperTypes.d.mts";

import type {
  DocumentOnCreateOptions,
  DocumentOnDeleteOptions,
  DocumentOnUpdateOptions,
  DocumentPreCreateOptions,
  DocumentPreDeleteOptions,
  DocumentPreUpdateOptions,
} from "../../../../src/foundry/common/abstract/document.d.mts";
import type {
  DatabaseCreateOperation,
  DatabaseDeleteOperation,
  DatabaseUpdateOperation,
} from "../../../../src/foundry/common/abstract/_types.d.mts";

declare const configuredActiveEffect: InstanceType<
  foundry.abstract.Document.ConfiguredClass<typeof foundry.documents.BaseActiveEffect>
>;
expectTypeOf(configuredActiveEffect).toEqualTypeOf<ActiveEffect>();

declare const helperConfigAE: ConfiguredDocumentInstance<typeof foundry.documents.BaseActiveEffect>;
expectTypeOf(helperConfigAE).toEqualTypeOf<ActiveEffect>();

const baseActiveEffect = new foundry.documents.BaseActiveEffect();

expectTypeOf(baseActiveEffect.toJSON().changes).toEqualTypeOf<EffectChangeData[]>();
expectTypeOf(baseActiveEffect.toObject().changes).toEqualTypeOf<EffectChangeData[]>();
expectTypeOf(baseActiveEffect.toObject(true).changes).toEqualTypeOf<EffectChangeData[]>();
expectTypeOf(baseActiveEffect.toObject(false).changes).toEqualTypeOf<EffectChangeData[]>();

const item = await Item.create({ name: "Some Item", type: "base" });
if (item) {
  expectTypeOf(item.toObject(false).effects[0].changes).toEqualTypeOf<EffectChangeData[]>();
  expectTypeOf(item.toObject().effects).toEqualTypeOf<
    foundry.data.fields.SchemaField.InnerPersistedType<BaseActiveEffect["schema"]["fields"]>[]
  >();
}

expectTypeOf(foundry.documents.BaseMacro.create({ name: "" })).toEqualTypeOf<
  Promise<StoredDocument<Macro> | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<Macro> | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: true })).toEqualTypeOf<
  Promise<Macro | undefined>
>();

expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: true })).toEqualTypeOf<
  Promise<Macro[] | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([])).toEqualTypeOf<
  Promise<StoredDocument<Macro>[] | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<Macro>[] | undefined>
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
declare const scene: Scene;
expectTypeOf(scene.createEmbeddedDocuments("Note", [], { temporary: true })).toEqualTypeOf<
  Promise<NoteDocument[] | undefined>
>();
expectTypeOf(scene.createEmbeddedDocuments("Note", [], { temporary: false })).toEqualTypeOf<
  Promise<StoredDocument<NoteDocument>[] | undefined>
>();
expectTypeOf(scene.createEmbeddedDocuments("Note", [])).toEqualTypeOf<
  Promise<StoredDocument<NoteDocument>[] | undefined>
>();

// verify that document lifecycle methods work with source data is possible

if (item) {
  expectTypeOf(Item.createDocuments([item.toObject()])).toEqualTypeOf<Promise<StoredDocument<Item>[] | undefined>>();
  expectTypeOf(Item.create(item.toObject())).toEqualTypeOf<Promise<StoredDocument<Item> | undefined>>();
  expectTypeOf(Item.updateDocuments([item.toObject()])).toEqualTypeOf<Promise<Item[]>>();
  expectTypeOf(item.update(item.toObject())).toEqualTypeOf<Promise<StoredDocument<Item> | undefined>>();
  expectTypeOf(item.clone(item.toObject())).toEqualTypeOf<StoredDocument<Item>>();
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

// test the database operations
declare const dbo: ActiveEffect.DatabaseOperations;
expectTypeOf(dbo.create).toEqualTypeOf<DatabaseCreateOperation<ActiveEffect> & { animate?: boolean | undefined }>();
expectTypeOf(dbo.create).toEqualTypeOf<DatabaseOperationsFor<"ActiveEffect", "create">>();
expectTypeOf(dbo.update).toEqualTypeOf<DatabaseUpdateOperation<ActiveEffect> & { animate?: boolean | undefined }>();
expectTypeOf(dbo.update).toEqualTypeOf<DatabaseOperationsFor<"ActiveEffect", "update">>();
expectTypeOf(dbo.delete).toEqualTypeOf<DatabaseDeleteOperation & { animate?: boolean | undefined }>();
expectTypeOf(dbo.delete).toEqualTypeOf<DatabaseOperationsFor<"ActiveEffect", "delete">>();

// test the options
declare const pco: DocumentPreCreateOptions<"ActiveEffect">;
expectTypeOf(pco).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "create">, "data" | "noHook" | "pack" | "parent">
>();
declare const oco: DocumentOnCreateOptions<"ActiveEffect">;
expectTypeOf(oco).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "create">, "pack" | "parentUuid" | "syntheticActorUpdate">
>();

declare const puo: DocumentPreUpdateOptions<"ActiveEffect">;
expectTypeOf(puo).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "update">, "updates" | "restoreDelta" | "noHook" | "parent" | "pack">
>();
declare const ouo: DocumentOnUpdateOptions<"ActiveEffect">;
expectTypeOf(ouo).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "update">, "pack" | "parentUuid" | "syntheticActorUpdate">
>();

declare const pdo: DocumentPreDeleteOptions<"ActiveEffect">;
expectTypeOf(pdo).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "delete">, "ids" | "deleteAll" | "noHook" | "pack" | "parent">
>();
declare const odo: DocumentOnDeleteOptions<"ActiveEffect">;
expectTypeOf(odo).toEqualTypeOf<
  Omit<DatabaseOperationsFor<"ActiveEffect", "delete">, "deleteAll" | "pack" | "parentUuid" | "syntheticActorUpdate">
>();

// const combatant = new Combatant({}, {});
// expectTypeOf(combatant.flags["my-system"]).toEqualTypeOf<{ value: boolean; value2: number }>();
// expectTypeOf(combatant.flags["my-optional-system"]).toEqualTypeOf<{ value: boolean } | undefined>();

// expectTypeOf(combatant.getFlag("my-system", "value")).toEqualTypeOf<boolean>();
// expectTypeOf(combatant.getFlag("my-system", "value2")).toEqualTypeOf<number>();
// expectTypeOf(combatant.getFlag("my-system", "unknown-key")).toEqualTypeOf<never>();
// expectTypeOf(combatant.getFlag("another-system", "value")).toEqualTypeOf<unknown>();
// expectTypeOf(combatant.getFlag("my-optional-system", "value")).toEqualTypeOf<boolean | undefined>();

// expectTypeOf(combatant.setFlag("my-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

// // @ts-expect-error - the flag my-system.value is a boolean and not a number
// combatant.setFlag("my-system", "value", 2);

// // @ts-expect-error - the flag my-system.unknown-key doesn't exist
// combatant.setFlag("my-system", "unknown-key", 2);

// expectTypeOf(combatant.setFlag("my-optional-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

// // @ts-expect-error - an optional system with a required flag can't be assigned an undefined value
// combatant.setFlag("my-optional-system", "value", undefined);

// expectTypeOf(combatant.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<Combatant>>();

// expectTypeOf(combatant.unsetFlag("my-system", "value")).toEqualTypeOf<Promise<Combatant>>();
// expectTypeOf(combatant.unsetFlag("my-optional-system", "value")).toEqualTypeOf<Promise<Combatant>>();
// expectTypeOf(combatant.unsetFlag("another-system", "value")).toEqualTypeOf<Promise<Combatant>>();

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// class MyCombatant extends Combatant {
//   setSomeFlag() {
//     expectTypeOf(this.flags["my-system"]).toEqualTypeOf<{ value: boolean; value2: number }>();
//     expectTypeOf(this.flags["my-optional-system"]).toEqualTypeOf<{ value: boolean } | undefined>();

//     expectTypeOf(this.getFlag("my-system", "value")).toEqualTypeOf<boolean>();
//     expectTypeOf(this.getFlag("another-system", "value")).toEqualTypeOf<unknown>();

//     expectTypeOf(this.setFlag("my-system", "value", true)).toEqualTypeOf<Promise<this>>();
//     expectTypeOf(this.setFlag("another-system", "value", true)).toEqualTypeOf<Promise<this>>();
//   }
// }

// expectTypeOf(typeof foundry.abstract.Document).toEqualTypeOf<foundry.abstract.Document.AnyConstructor>();
