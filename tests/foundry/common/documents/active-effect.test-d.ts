import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseActiveEffect = foundry.documents.BaseActiveEffect;
import Document = foundry.abstract.Document;

class TestAE extends BaseActiveEffect {}

// @ts-expect-error Active effects require a `name` in construction data
let myAE = new TestAE();

// @ts-expect-error Active effects require a `name` in construction data
myAE = new TestAE({});

myAE = new TestAE({
  _id: "XXXXXSomeIDXXXXX",
  name: "Stuff +1", // necessary for construction
  img: "path/to/tex.webp",
  type: "base",
  system: {},
  changes: [
    {
      key: "system.stuff.value",
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      priority: 60,
      value: "1",
    },
  ],
  disabled: true,
  duration: {
    startTime: 1700000,
    seconds: 300,
    combat: "CCCCCSomeIDCCCCC",
    rounds: 20,
    turns: 3,
    startRound: 1,
    startTurn: 3,
  },
  description: "Increment your Stuff",
  origin: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
  tint: "#C8888C",
  transfer: true,
  statuses: ["invisible", "flying"],
  sort: 7,
  flags: {
    core: {
      overlay: true,
    },
  },
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: "Compendium.mysystem.pack-id.Item.YYYYYSomeIDYYYYY.ActiveEffect.ZZZZZSomeIDZZZZZ",
    duplicateSource: "Item.WWWWWSomeIDWWWWW.ActiveEffect.VVVVVSomeIDVVVVV",
  },
});
myAE = new TestAE({
  _id: null,
  name: "Stuff +1", // necessary for construction
  img: null,
  type: null,
  system: null,
  changes: [
    {
      key: null,
      mode: null,
      priority: null,
      value: null,
    },
  ],
  disabled: null,
  duration: {
    startTime: null,
    seconds: null,
    combat: null,
    rounds: null,
    turns: null,
    startRound: null,
    startTurn: null,
  },
  description: null,
  origin: null,
  tint: null,
  transfer: null,
  statuses: null,
  sort: null,
  flags: null,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: null,
    duplicateSource: null,
  },
});
myAE = new TestAE({
  name: "Stuff +1", // necessary for construction
  changes: null,
  duration: null,
  _stats: null,
});
myAE = new TestAE({
  _id: undefined,
  name: "Stuff +1", // necessary for construction
  img: undefined,
  type: undefined,
  system: undefined,
  changes: [
    {
      key: undefined,
      mode: undefined,
      priority: undefined,
      value: undefined,
    },
  ],
  disabled: undefined,
  duration: {
    startTime: undefined,
    seconds: undefined,
    combat: undefined,
    rounds: undefined,
    turns: undefined,
    startRound: undefined,
    startTurn: undefined,
  },
  description: undefined,
  origin: undefined,
  tint: undefined,
  transfer: undefined,
  statuses: undefined,
  sort: undefined,
  flags: undefined,
  _stats: {
    // coreVersion, systemId, systemVersion, createdTime, modifiedTime, and lastModifiedBy are managed by the server and ignored if passed
    compendiumSource: undefined,
    duplicateSource: undefined,
  },
});
myAE = new TestAE({
  name: "Stuff +1", // necessary for construction
  changes: undefined,
  duration: undefined,
  _stats: undefined,
});

expectTypeOf(myAE).toEqualTypeOf<BaseActiveEffect>();

expectTypeOf(myAE._id).toEqualTypeOf<string | null>();
expectTypeOf(myAE.name).toBeString();
const firstChange = myAE.changes[0];
if (firstChange) {
  expectTypeOf(firstChange.key).toBeString();
  expectTypeOf(firstChange.value).toBeString();
  expectTypeOf(firstChange.mode).toEqualTypeOf<CONST.ACTIVE_EFFECT_MODES | null>();
  expectTypeOf(firstChange.priority).toEqualTypeOf<number | null | undefined>();
}
expectTypeOf(myAE.disabled).toBeBoolean();
expectTypeOf(myAE.duration.combat).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(myAE.transfer).toBeBoolean();
expectTypeOf(myAE.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(myAE.sort).toBeNumber();
expectTypeOf(myAE.flags).toEqualTypeOf<
  InterfaceToObject<ActiveEffect.CoreFlags> & InterfaceToObject<Document.CoreFlags>
>();

// document-specific flags
expectTypeOf(myAE.flags.core?.overlay).toEqualTypeOf<boolean | undefined>();

expectTypeOf(myAE._stats).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.fields.DocumentStatsField.Schema>
>();

// The following fields can't really be `undefined` because they have `initial`s, see https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3055
expectTypeOf(myAE.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(myAE.duration.startTime).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.duration.seconds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.duration.rounds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.duration.turns).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.duration.startRound).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.duration.startTurn).toEqualTypeOf<number | null | undefined>();
expectTypeOf(myAE.origin).toEqualTypeOf<string | null | undefined>();
expectTypeOf(myAE.tint).toEqualTypeOf<Color | undefined>();

// non-schema:
declare const someUser: User.Implementation;
expectTypeOf(myAE.canUserModify(someUser, "create")).toBeBoolean();
expectTypeOf(myAE.canUserModify(someUser, "delete")).toBeBoolean();
expectTypeOf(myAE.canUserModify(someUser, "update")).toBeBoolean();
expectTypeOf(myAE.canUserModify(someUser, "create", {})).toBeBoolean();
expectTypeOf(myAE.canUserModify(someUser, "create", myAE.toObject())).toBeBoolean();

expectTypeOf(myAE.testUserPermission(someUser, "OBSERVER")).toBeBoolean();
expectTypeOf(myAE.testUserPermission(someUser, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)).toBeBoolean();
expectTypeOf(myAE.testUserPermission(someUser, "OBSERVER", {})).toBeBoolean();
expectTypeOf(myAE.testUserPermission(someUser, "OBSERVER", { exact: true })).toBeBoolean();
expectTypeOf(myAE.testUserPermission(someUser, "OBSERVER", { exact: null })).toBeBoolean();

expectTypeOf(myAE.label).toBeString();
expectTypeOf((myAE.label = "foo")).toBeString();

expectTypeOf(myAE.icon).toEqualTypeOf<string | null | undefined>();
expectTypeOf((myAE.icon = "path/to/tex.png")).toBeString();

// TODO: move to ActiveEffect (non-Base) test file
// expectTypeOf(foundry.documents.BaseActiveEffect.create({})).toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();
// expectTypeOf(foundry.documents.BaseActiveEffect.createDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
// expectTypeOf(foundry.documents.BaseActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();
// expectTypeOf(foundry.documents.BaseActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect[]>>();

const activeEffect = await foundry.documents.BaseActiveEffect.create({}, { temporary: true });
if (activeEffect) {
  expectTypeOf(activeEffect.parent).toEqualTypeOf<Actor.Implementation | Item.Implementation | null>();

  expectTypeOf(activeEffect.changes).toEqualTypeOf<ActiveEffect.EffectChangeData[]>();
}
