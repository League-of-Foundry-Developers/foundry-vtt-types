import { expectTypeOf } from "vitest";
import type { EmptyObject, InterfaceToObject } from "../../../../src/utils/index.d.mts";
import BaseActiveEffect = foundry.documents.BaseActiveEffect;
import Document = foundry.abstract.Document;
import fields = foundry.data.fields;

class TestActiveEffect<
  out SubType extends BaseActiveEffect.SubType = BaseActiveEffect.SubType,
> extends BaseActiveEffect<SubType> {}

// @ts-expect-error Active effects require a `name` in construction data
new TestActiveEffect();

// @ts-expect-error Active effects require a `name` in construction data
new TestActiveEffect({});

// @ts-expect-error - Name cannot be undefined.
new TestActiveEffect({ name: undefined });

const fullSource = {
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
} as const;

// TODO: infer type from creation data
const fullTestAE = new TestActiveEffect<"base">(fullSource);

new TestActiveEffect({
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

new TestActiveEffect({
  name: "Stuff +1", // necessary for construction
  changes: null,
  duration: null,
  _stats: null,
});

new TestActiveEffect({
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

new TestActiveEffect({
  name: "Stuff +1", // necessary for construction
  changes: undefined,
  duration: undefined,
  _stats: undefined,
});

expectTypeOf(fullTestAE).toEqualTypeOf<TestActiveEffect<"base">>();

expectTypeOf(fullTestAE._id).toEqualTypeOf<string | null>();
expectTypeOf(fullTestAE.name).toBeString();
// @ts-expect-error EffectChangeData is used as an argument interface, so it would match the AssignmentType of the schema,
// but not InitializedType, due to `undefined` always being a valid assignment to fields with an `initial` set
expectTypeOf(fullTestAE.changes).toEqualTypeOf<ActiveEffect.EffectChangeData[]>();
const firstChange = fullTestAE.changes[0]!;

expectTypeOf(firstChange.key).toBeString();
expectTypeOf(firstChange.value).toBeString();
expectTypeOf(firstChange.mode).toEqualTypeOf<CONST.ACTIVE_EFFECT_MODES>();
expectTypeOf(firstChange.priority).toEqualTypeOf<number | null | undefined>();

expectTypeOf(fullTestAE.disabled).toBeBoolean();
expectTypeOf(fullTestAE.duration.combat).toEqualTypeOf<Combat.Implementation | null>();
expectTypeOf(fullTestAE.transfer).toBeBoolean();
expectTypeOf(fullTestAE.statuses).toEqualTypeOf<Set<string>>();
expectTypeOf(fullTestAE.sort).toBeNumber();
expectTypeOf(fullTestAE.flags).toEqualTypeOf<
  InterfaceToObject<ActiveEffect.CoreFlags> & InterfaceToObject<Document.CoreFlags>
>();

// document-specific flags
expectTypeOf(fullTestAE.flags.core?.overlay).toEqualTypeOf<boolean | undefined>();

expectTypeOf(fullTestAE._stats).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.fields.DocumentStatsField.Schema>
>();

// The following fields can't really be `undefined` because they have `initial`s, see https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3055
expectTypeOf(fullTestAE.img).toEqualTypeOf<string | null | undefined>();
expectTypeOf(fullTestAE.duration.startTime).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.duration.seconds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.duration.rounds).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.duration.turns).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.duration.startRound).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.duration.startTurn).toEqualTypeOf<number | null | undefined>();
expectTypeOf(fullTestAE.origin).toEqualTypeOf<string | null | undefined>();
expectTypeOf(fullTestAE.tint).toEqualTypeOf<Color | undefined>();

// non-schema:
declare const someUser: User.Implementation;
expectTypeOf(fullTestAE.canUserModify(someUser, "create")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "delete")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "update")).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "create", {})).toBeBoolean();
expectTypeOf(fullTestAE.canUserModify(someUser, "create", fullTestAE.toObject())).toBeBoolean();

expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER")).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", {})).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", { exact: true })).toBeBoolean();
expectTypeOf(fullTestAE.testUserPermission(someUser, "OBSERVER", { exact: null })).toBeBoolean();

// migrateData and shimData overridden with no signature changes

// deprecated since v12 until v14
expectTypeOf(fullTestAE.label).toBeString();
expectTypeOf((fullTestAE.label = "foo")).toBeString();

expectTypeOf(fullTestAE.icon).toEqualTypeOf<string | null | undefined>();
expectTypeOf((fullTestAE.icon = "path/to/tex.png")).toBeString();

// Document template static overrides

expectTypeOf(TestActiveEffect["_initializationOrder"]()).toEqualTypeOf<Generator<[string, fields.DataField.Any]>>();
expectTypeOf(TestActiveEffect.implementation).toEqualTypeOf<ActiveEffect.ImplementationClass>();
expectTypeOf(TestActiveEffect.baseDocument).toEqualTypeOf<typeof BaseActiveEffect>();
expectTypeOf(TestActiveEffect.collectionName).toEqualTypeOf<"effects">();
expectTypeOf(TestActiveEffect.documentName).toEqualTypeOf<"ActiveEffect">();
expectTypeOf(TestActiveEffect.TYPES).toEqualTypeOf<BaseActiveEffect.SubType[]>();
expectTypeOf(TestActiveEffect.hasTypeData).toEqualTypeOf<true>();
expectTypeOf(TestActiveEffect.hierarchy).toExtend<EmptyObject>();

expectTypeOf(TestActiveEffect.createDocuments([])).branded.toEqualTypeOf<Promise<ActiveEffect.Stored[]>>();
expectTypeOf(TestActiveEffect.updateDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Implementation[]>>();
expectTypeOf(TestActiveEffect.deleteDocuments([])).toEqualTypeOf<Promise<ActiveEffect.Implementation[]>>();

// TODO: should error, AE creation requires a parent
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();
expectTypeOf(TestActiveEffect.create(fullSource)).branded.toEqualTypeOf<Promise<ActiveEffect.Stored | undefined>>();

expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX")).toEqualTypeOf<ActiveEffect.Implementation | null>();
expectTypeOf(TestActiveEffect.get("XXXXXSomeIDXXXXX", {})).toEqualTypeOf<ActiveEffect.Implementation | null>();
expectTypeOf(
  TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: "some.pack" }),
).toEqualTypeOf<ActiveEffect.Implementation | null>();
expectTypeOf(
  TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: null }),
).toEqualTypeOf<ActiveEffect.Implementation | null>();
expectTypeOf(
  TestActiveEffect.get("XXXXXSomeIDXXXXX", { pack: undefined }),
).toEqualTypeOf<ActiveEffect.Implementation | null>();

// no hierarchy, no collections
expectTypeOf(TestActiveEffect.getCollectionName("literally anything")).toBeNull();

declare const user: User.Implementation;
declare const nonBaseAE: ActiveEffect.Implementation;
declare const createDataArray: ActiveEffect.CreateData[];
declare const someItem: Item.Implementation;

const effect = someItem.effects.get("effect")!;

// TODO: better tests for the operation interfaces, beyond the minimum (probably in Document tests)
expectTypeOf(
  TestActiveEffect["_preCreateOperation"](
    [effect, nonBaseAE],
    { data: createDataArray, modifiedTime: 0, render: false, renderSheet: false },
    user,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  TestActiveEffect["_onCreateOperation"](
    [effect, nonBaseAE],
    { data: createDataArray, modifiedTime: 0, render: false, renderSheet: false },
    user,
  ),
).toEqualTypeOf<Promise<void>>();

declare const updateDataArray: ActiveEffect.UpdateData[];
expectTypeOf(
  TestActiveEffect["_preUpdateOperation"](
    [effect, nonBaseAE],
    { modifiedTime: 0, render: false, diff: true, recursive: true, pack: null, updates: updateDataArray },
    user,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  TestActiveEffect["_onUpdateOperation"](
    [effect, nonBaseAE],
    { modifiedTime: 0, render: false, diff: true, recursive: true, pack: null, updates: updateDataArray },
    user,
  ),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(
  TestActiveEffect["_preDeleteOperation"](
    [effect, nonBaseAE],
    { modifiedTime: 0, render: false, deleteAll: false, ids: ["YYYYYSomeIDYYYYY"] },
    user,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  TestActiveEffect["_onDeleteOperation"](
    [effect, nonBaseAE],
    { modifiedTime: 0, render: false, deleteAll: false, ids: ["YYYYYSomeIDYYYYY"] },
    user,
  ),
).toEqualTypeOf<Promise<void>>();

expectTypeOf(TestActiveEffect.hasSystemData).toEqualTypeOf<true>();
// shim methods and _logDataFieldMigration have no type changes from Document

// core's implementation for these three are actual no-ops, no point testing the modification context
expectTypeOf(TestActiveEffect["_onCreateDocuments"]([effect, nonBaseAE], {}));
expectTypeOf(TestActiveEffect["_onUpdateDocuments"]([effect, nonBaseAE], {}));
expectTypeOf(TestActiveEffect["_onDeleteDocuments"]([effect, nonBaseAE], {}));

expectTypeOf(TestActiveEffect["_schema"]).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();
expectTypeOf(TestActiveEffect.schema).toEqualTypeOf<fields.SchemaField<ActiveEffect.Schema>>();

expectTypeOf(
  TestActiveEffect.validateJoint({
    name: "foo",
    flags: {
      core: {
        overlay: true,
      },
    },
    _id: null,
    changes: [
      {
        key: "system.foo.bar",
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        priority: 2,
        value: "i don't know what AEs look like",
      },
    ],
    _stats: {
      compendiumSource: "something",
      duplicateSource: "else",
      coreVersion: "12",
      createdTime: 2,
      lastModifiedBy: "UUUUUSomeIDUUUUU",
      modifiedTime: 7,
      systemId: "dnd5e",
      systemVersion: "4.4",
    },
    description: "bar",
    disabled: false,
    duration: {
      combat: "ZZZZZSomeIDZZZZZ",
      rounds: 2,
      seconds: 12314,
      startRound: 1,
      startTime: 7,
      startTurn: 1,
      turns: 42,
    },
    img: "baz.webp",
    origin: "a uuid",
    sort: 2,
    statuses: [],
    system: {},
    tint: "#ABCDEF",
    transfer: true,
    type: "base",
  }),
).toBeVoid();

expectTypeOf(TestActiveEffect.fromSource(fullSource)).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(TestActiveEffect.fromSource(fullSource, {})).toEqualTypeOf<ActiveEffect.Implementation>();
expectTypeOf(TestActiveEffect.fromSource(fullSource)).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(TestActiveEffect.fromJSON("some JSON")).toEqualTypeOf<ActiveEffect.Implementation>();

// Document template instance overrides
expectTypeOf(fullTestAE.parentCollection).toEqualTypeOf<"effects" | null>();
expectTypeOf(fullTestAE.pack).toEqualTypeOf<string | null>();
// TODO: create fake subtype, test its `system`
// @ts-expect-error "base" system should be `{}` not `never`
expectTypeOf(fullTestAE.system).toBeNever();
expectTypeOf(fullTestAE.system).toEqualTypeOf<ActiveEffect.SystemOfType<"base">>();

expectTypeOf(fullTestAE.parent).toEqualTypeOf<Actor.Implementation | Item.Implementation | null>();

// @ts-expect-error updating without data is not allowed
expectTypeOf(fullTestAE.update()).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(fullTestAE.update({})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// context tests
expectTypeOf(fullTestAE.update({}, {})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update(
    {},
    {
      animate: true,
      broadcast: false,
      diff: true,
      modifiedTime: 7, // this should probably be `@deprecated` as passing it as input rather than inter-method communication makes no sense
      noHook: false,
      pack: "some.pack",
      parent: someItem,
      parentUuid: "some uuid",
      recursive: true,
      render: false,
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update(
    {},
    {
      animate: undefined,
      broadcast: undefined,
      diff: undefined,
      modifiedTime: undefined,
      noHook: undefined,
      pack: undefined,
      parent: undefined,
      parentUuid: undefined,
      recursive: undefined,
      render: undefined,
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// TODO: audit nullability of this interface
expectTypeOf(
  fullTestAE.update(
    {},
    {
      // animate not allowed to be null
      broadcast: null,
      // diff not allowed to be null
      // modifiedTime not allowed to be null
      noHook: null,
      pack: null,
      parent: null,
      parentUuid: null,
      // recursive not allowed to be null
      // render not allowed to be null
    },
  ),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// UpdateData tests

const fullUpdateData = {
  _id: "WWWWWSomeIDWWWWW", // `_id` has to be in UpdateData for batched updates, it would never make sense to include in a single update
  name: "New Name",
  _stats: {
    compendiumSource: "New UUID",
    duplicateSource: "New UUID",
    coreVersion: "13", // TODO: omit server-managed keys of _stats from UpdateData
  },
  changes: fullTestAE.changes.concat([
    {
      key: "name",
      mode: CONST.ACTIVE_EFFECT_MODES.ADD,
      priority: 1,
      value: " the Second",
    },
  ]),
  description: "New Description",
  disabled: false,
  duration: {
    combat: "CCCCCSomeIDCCCCC",
    rounds: 17,
    seconds: 42,
    startRound: 5,
    startTime: 37373737,
    startTurn: 2,
    turns: 24,
  },
  img: "new/path/to/img.png",
  // @ts-expect-error TODO: possibly include shims
  icon: "new/path/to/img.jpg",
  origin: "A UUID",
  statuses: ["status1", "status2"],
  tint: "#EDCBAF",
  transfer: true,
  sort: 32,
  flags: {
    core: {
      overlay: false,
      sheetClass: "someApplicationName",
      sheetLock: false,
    },
  },
  system: {
    // untouched "base" system should allow anything
    foo: "bar",
    baz: new Set<number>([1, 2, 3]), // gets serialized to `{}` without datamodel handling
  },
  // TODO: mock subtype to test
  type: "base",
} as const;
expectTypeOf(fullTestAE.update(fullUpdateData)).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    name: "some name", // no initial, can't be undefined
    changes: fullTestAE.changes.concat([
      {
        key: "name", // required, no initial
        mode: undefined, // should be allowed, because initial
        priority: undefined,
        value: " the Second", // required, no initial
      },
    ]),
    description: undefined,
    disabled: undefined,
    duration: {
      combat: undefined,
      rounds: undefined,
      seconds: undefined,
      startRound: undefined,
      startTime: undefined,
      startTurn: undefined,
      turns: undefined,
    },
    img: undefined,
    origin: undefined,
    statuses: undefined,
    tint: undefined,
    transfer: undefined,
    sort: undefined,
    flags: undefined,
    system: undefined,
    // TODO: mock subtype to test
    type: undefined,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    changes: undefined,
    duration: undefined,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    changes: fullTestAE.changes.concat([
      {
        key: "name", // required, no initial
        mode: null, // should be allowed, because initial
        priority: null,
        value: " the Second", // required, no initial
      },
    ]),
    description: null,
    disabled: null,
    duration: {
      combat: null,
      rounds: null,
      seconds: null,
      startRound: null,
      startTime: null,
      startTurn: null,
      turns: null,
    },
    img: null,
    origin: null,
    statuses: null,
    tint: null,
    transfer: null,
    sort: null,
    flags: null,
    system: null,
    type: null,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.update({
    changes: null,
    duration: null,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

expectTypeOf(fullTestAE.delete()).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(fullTestAE.delete({})).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
// TODO: audit DeleteOperation interface generally
expectTypeOf(
  fullTestAE.delete({
    animate: false,
    broadcast: true,
    deleteAll: false, // delete all what?
    modifiedTime: 42,
    noHook: false,
    pack: "some.pack",
    parent: someItem, // surely this isn't valid for a delete call
    parentUuid: "someUUID",
    render: false,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.delete({
    animate: undefined,
    broadcast: undefined,
    deleteAll: undefined,
    modifiedTime: undefined,
    noHook: undefined,
    pack: undefined,
    parent: undefined,
    parentUuid: undefined,
    render: undefined,
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();
expectTypeOf(
  fullTestAE.delete({
    // animate: not allowed to be null
    // broadcast: not allowed to be null
    // deleteAll: not allowed to be null
    // modifiedTime: not allowed to be null
    noHook: null,
    pack: null,
    parent: null,
    parentUuid: null,
    // render: not allowed to be null
  }),
).toEqualTypeOf<Promise<TestActiveEffect<"base"> | undefined>>();

// traverseEmbeddedDocuments is in the Document boilerplate template but has no signature changes yet

// TODO: wire up core flags to get/set/unsetFlag types
// TODO: mock up configured flags to test
expectTypeOf(fullTestAE.getFlag("core", "overlay")).toEqualTypeOf<boolean | undefined>();
expectTypeOf(fullTestAE.setFlag("core", "overlay", true)).toEqualTypeOf<Promise<TestActiveEffect<"base">>>();
expectTypeOf(fullTestAE.unsetFlag("core", "overlay")).toEqualTypeOf<Promise<TestActiveEffect<"base">>>();

expectTypeOf(
  fullTestAE["_preCreate"](
    fullSource,
    {
      modifiedTime: 7,
      render: true,
      renderSheet: false,
      animate: false,
      broadcast: true,
      clearFolder: true,
      clearOwnership: true,
      clearSort: true,
      fromCompendium: false,
      keepEmbeddedIds: true,
      keepId: false,
      parentUuid: "someParent",
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preCreate"](
    fullSource,
    {
      modifiedTime: 7, // required
      render: true, // required
      renderSheet: false, // required
      animate: undefined,
      broadcast: undefined,
      clearFolder: undefined,
      clearOwnership: undefined,
      clearSort: undefined,
      fromCompendium: undefined,
      keepEmbeddedIds: undefined,
      keepId: undefined,
      parentUuid: undefined,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preCreate"](
    fullSource,
    {
      modifiedTime: 7, // required
      render: true, // required
      renderSheet: false, // required
      // animate not allowed to be null
      // broadcast not allowed to be null
      clearFolder: null,
      clearOwnership: null,
      clearSort: null,
      // fromCompendium not allowed to be null
      // keepEmbeddedIds not allowed to be null
      // keepId not allowed to be null
      parentUuid: null,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  fullTestAE["_onCreate"](
    fullSource,
    {
      data: [fullSource],
      modifiedTime: 73,
      render: false,
      renderSheet: false,
      animate: true,
      broadcast: false,
      clearFolder: true,
      clearOwnership: false,
      clearSort: true,
      fromCompendium: true,
      keepEmbeddedIds: false,
      keepId: true,
      noHook: true,
      pack: "some.pack",
      parent: someItem,
      parentUuid: "SomeUUID",
      // deprecated since v12:
      temporary: false,
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onCreate"](
    fullSource,
    {
      data: [fullSource], // required
      modifiedTime: 73, // required
      render: false, // required
      renderSheet: false, // required
      // animate wil never be undefined
      // broadcast wil never be undefined
      // clearFolder wil never be undefined
      // clearOwnership wil never be undefined
      // clearSort wil never be undefined
      // fromCompendium wil never be undefined
      // keepEmbeddedIds wil never be undefined
      // keepId wil never be undefined
      // noHook wil never be undefined
      // pack wil never be undefined
      parent: null,
      // parentUuid not allowed to be undefined
      // deprecated since v12:
      temporary: undefined,
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onCreate"](
    fullSource,
    {
      data: [fullSource],
      modifiedTime: 73,
      render: false,
      renderSheet: false,
      // animate will never be null
      // broadcast will never be null
      clearFolder: null,
      clearOwnership: null,
      clearSort: null,
      // fromCompendium will never be null
      // keepEmbeddedIds will never be null
      // keepId will never be null
      // noHook will never be null
      pack: null,
      parent: null,
      parentUuid: null,
      // deprecated since v12:
      // TODO: `temporary` is only checked for `in`, it could be any set value and apply
      // temporary will never be null
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();

expectTypeOf(
  fullTestAE["_preUpdate"](
    fullUpdateData,
    {
      diff: true,
      modifiedTime: 8989898989,
      recursive: false,
      render: true,
      animate: false,
      broadcast: true,
      parentUuid: "someUUID",
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preUpdate"](
    fullUpdateData,
    {
      diff: true, // required
      modifiedTime: 8989898989, // required
      recursive: false, // required
      render: true, // required
      animate: undefined,
      broadcast: undefined,
      parentUuid: undefined,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preUpdate"](
    fullUpdateData,
    {
      diff: true, // required
      modifiedTime: 8989898989, // required
      recursive: false, // required
      render: true, // required
      // animate will never be null,
      broadcast: null,
      parentUuid: null,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  fullTestAE["_onUpdate"](
    fullUpdateData,
    {
      diff: true,
      modifiedTime: 123456789,
      pack: "some.pack",
      recursive: true,
      render: true,
      updates: [fullUpdateData],
      animate: false,
      broadcast: true,
      noHook: true,
      parent: someItem,
      parentUuid: "SomeUUID",
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onUpdate"](
    fullUpdateData,
    {
      diff: true, // required
      modifiedTime: 123456789, // required
      pack: "some.pack", // required
      recursive: true, // required
      render: true, // required
      updates: [fullUpdateData], // required
      // animate will never be undefined
      // broadcast will never be undefined
      // noHook will never be undefined
      parent: null,
      // parentUuid will never be undefined
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onUpdate"](
    fullUpdateData,
    {
      diff: true, // required
      modifiedTime: 123456789, // required
      pack: "some.pack", // required
      recursive: true, // required
      render: true, // required
      updates: [fullUpdateData], // required
      // animate will never be null,
      broadcast: null,
      noHook: null,
      parent: null,
      parentUuid: null,
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();

expectTypeOf(
  fullTestAE["_preDelete"](
    {
      modifiedTime: 7,
      render: false,
      animate: true,
      broadcast: true,
      parentUuid: "SomeUUID",
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preDelete"](
    {
      modifiedTime: 7, // required
      render: false, // required
      animate: undefined,
      broadcast: undefined,
      parentUuid: undefined,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  fullTestAE["_preDelete"](
    {
      modifiedTime: 7, // required
      render: false, // required
      // animate will never be null
      // broadcast will never be null
      parentUuid: null,
    },
    someUser,
  ),
).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  fullTestAE["_onDelete"](
    {
      deleteAll: false,
      ids: ["an", "array", "of", "IDs"],
      modifiedTime: 20000000,
      render: false,
      animate: false,
      broadcast: true,
      noHook: true,
      pack: "some.pack",
      parent: someItem,
      parentUuid: "SomeUUID",
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onDelete"](
    {
      deleteAll: false, // required
      ids: ["an", "array", "of", "IDs"], // required
      modifiedTime: 20000000, // required
      render: false, // required
      // animate will never be undefined,
      // broadcast will never be undefined,
      // noHook will never be undefined,
      // pack will never be undefined,
      parent: null,
      // parentUuid will never be undefined,
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
expectTypeOf(
  fullTestAE["_onDelete"](
    {
      deleteAll: false, // required
      ids: ["an", "array", "of", "IDs"], // required
      modifiedTime: 20000000, // required
      render: false, // required
      // broadcast will never be null,
      noHook: null,
      pack: null,
      parent: null,
      parentUuid: null,
    },
    "UUUUUSomeIDUUUUU",
  ),
).toBeVoid();
