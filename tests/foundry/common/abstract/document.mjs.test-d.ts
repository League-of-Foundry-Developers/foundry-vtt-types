import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;
import BaseActiveEffect = foundry.documents.BaseActiveEffect;

declare const configuredActiveEffect: Document.ToConfiguredInstance<typeof foundry.documents.BaseActiveEffect>;
expectTypeOf(configuredActiveEffect).toEqualTypeOf<ActiveEffect.Implementation>();

declare const helperConfigAE: Document.ToConfiguredInstance<typeof foundry.documents.BaseActiveEffect>;
expectTypeOf(helperConfigAE).toEqualTypeOf<ActiveEffect.Implementation>();

declare const baseActiveEffect: foundry.documents.BaseActiveEffect;

expectTypeOf(baseActiveEffect.toJSON().changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();
expectTypeOf(baseActiveEffect.toObject().changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();
expectTypeOf(baseActiveEffect.toObject(true).changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();
expectTypeOf(baseActiveEffect.toObject(false).changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();

const item = await Item.create({ name: "Some Item", type: "base" });
if (item) {
  expectTypeOf(item.toObject(false).effects[0]!.changes).toEqualTypeOf<ActiveEffect.ChangeData[]>();
  expectTypeOf(item.toObject().effects).toEqualTypeOf<
    foundry.data.fields.SchemaField.SourceData<BaseActiveEffect["schema"]["fields"]>[]
  >();
}

expectTypeOf(foundry.documents.BaseMacro.create({ name: "" })).branded.toEqualTypeOf<
  Promise<Macro.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: false })).branded.toEqualTypeOf<
  Promise<Macro.Stored | undefined>
>();
expectTypeOf(foundry.documents.BaseMacro.create({ name: "" }, { temporary: true })).toEqualTypeOf<
  Promise<Macro.Implementation | undefined>
>();

const _foo = await foundry.documents.BaseMacro.createDocuments([]);

expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: true })).toEqualTypeOf<
  Promise<Macro.Implementation[]>
>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([])).branded.toEqualTypeOf<
  Promise<Macro.Stored<Macro.SubType>[]>
>();
expectTypeOf(foundry.documents.BaseMacro.createDocuments([], { temporary: false })).branded.toEqualTypeOf<
  Promise<Macro.Stored<Macro.SubType>[]>
>();

expectTypeOf(foundry.documents.BaseMacro.updateDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
expectTypeOf(foundry.documents.BaseMacro.deleteDocuments([])).toEqualTypeOf<Promise<Macro.Implementation[]>>();
const user = await User.implementation.create({ name: "Some User" });
if (user) {
  expectTypeOf(user.testUserPermission(user, "NONE")).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "OBSERVER", {})).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "LIMITED", { exact: true })).toEqualTypeOf<boolean>();
  expectTypeOf(user.testUserPermission(user, "OWNER", { exact: false })).toEqualTypeOf<boolean>();
}

// test creation of embedded documents
declare const scene: Scene.Implementation;
expectTypeOf(scene.createEmbeddedDocuments("Note", [], { temporary: true })).toEqualTypeOf<
  Promise<NoteDocument.Implementation[] | undefined> // See #3271
>();
expectTypeOf(scene.createEmbeddedDocuments("Note", [], { temporary: false })).toEqualTypeOf<
  Promise<NoteDocument.Stored[] | undefined>
>();
expectTypeOf(scene.createEmbeddedDocuments("Note", [])).toEqualTypeOf<Promise<NoteDocument.Stored[] | undefined>>();

// verify that document lifecycle methods work with source data is possible

if (item) {
  expectTypeOf(Item.createDocuments([item.toObject()])).toEqualTypeOf<Promise<Item.Stored[]>>();
  expectTypeOf(Item.create(item.toObject())).toEqualTypeOf<Promise<Item.Stored | undefined>>();
  expectTypeOf(Item.updateDocuments([item.toObject()])).toEqualTypeOf<Promise<Item.Implementation[]>>();
  expectTypeOf(item.update(item.toObject())).toEqualTypeOf<Promise<Item.Stored | undefined>>();
  expectTypeOf(item.clone(item.toObject())).toEqualTypeOf<Item.Stored>();
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
