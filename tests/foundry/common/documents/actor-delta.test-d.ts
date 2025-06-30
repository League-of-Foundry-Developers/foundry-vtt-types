import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;
import BaseActorDelta = foundry.documents.BaseActorDelta;
import Document = foundry.abstract.Document;
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";

class TestAD extends BaseActorDelta {}

declare const someToken: TokenDocument.Implementation;
// @ts-expect-error ActorDeltas require a valid `parent` to be passed in its `context`
new TestAD();

// @ts-expect-error ActorDeltas require a valid `parent` to be passed in its `context`
new TestAD(undefined, { strict: false });

let myDelta = new TestAD({}, { parent: someToken });

declare const someActor: Actor.Implementation;
expectTypeOf(TestAD.applyDelta(myDelta, someActor)).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(TestAD.applyDelta(myDelta, someActor, {})).toEqualTypeOf<Actor.Implementation | null>();
// @ts-expect-error parent is not allowed to be passed, as that context is used for the synthetic actor creation, its parent must be the same as the delta's parent
expectTypeOf(TestAD.applyDelta(myDelta, someActor, { parent: someToken })).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(
  TestAD.applyDelta(myDelta, someActor, {
    pack: "someModule.somePack",
    parentCollection: "foo",
    strict: false,
  }),
).toEqualTypeOf<Actor.Implementation | null>();

myDelta = new TestAD(
  {
    _id: "XXXXXSomeIDXXXXX",
    name: "Foo the Specific Bandit",
    type: "npc", // AD model doesn't enforce this being accurate
    img: "path/to/icon.webp",
    system: {},
    items: [
      {
        _id: "YYYYYSomeIDYYYYY",
        name: "Some Item",
        // not going to include the entire Item schema here, as this is already 'possibly infinite'
      },
    ],
    effects: [
      {
        _id: "ZZZZZSomeIDZZZZZ",
        name: "Some Effect",
        // not going to include the entire AE schema here
      },
    ],
    ownership: {
      UUUUUSomeIDUUUUU: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
    },
    flags: {
      core: {
        sheetLock: false,
      },
    },
  },
  { parent: someToken },
);
myDelta = new TestAD(
  {
    _id: null,
    name: null,
    type: null,
    img: null,
    system: null,
    items: null,
    effects: null,
    ownership: null,
    flags: null,
  },
  { parent: someToken },
);
myDelta = new TestAD(
  {
    _id: undefined,
    name: undefined,
    type: undefined,
    img: undefined,
    system: undefined,
    items: undefined,
    effects: undefined,
    ownership: undefined,
    flags: undefined,
  },
  { parent: someToken },
);

expectTypeOf(myDelta).toEqualTypeOf<BaseActorDelta>();

expectTypeOf(myDelta._id).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.name).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.type).toEqualTypeOf<string | null>();
expectTypeOf(myDelta.img).toEqualTypeOf<string | null>();
// overridden in template, ActorDelta's `system` field is just an ObjectField
expectTypeOf(myDelta.system).toEqualTypeOf<BaseActorDelta.SystemOfType<BaseActorDelta.SubType>>();
expectTypeOf(myDelta.items).toEqualTypeOf<EmbeddedCollectionDelta<Item.Implementation, ActorDelta.Implementation>>();
expectTypeOf(myDelta.effects).toEqualTypeOf<
  EmbeddedCollectionDelta<ActiveEffect.Implementation, ActorDelta.Implementation>
>();
expectTypeOf(myDelta.ownership).toEqualTypeOf<Record<string, CONST.DOCUMENT_OWNERSHIP_LEVELS> | null | undefined>();
expectTypeOf(myDelta.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();

// non-schema:
declare const someUser: User.Implementation;
expectTypeOf(myDelta.canUserModify(someUser, "create")).toBeBoolean();
expectTypeOf(myDelta.canUserModify(someUser, "delete")).toBeBoolean();
expectTypeOf(myDelta.canUserModify(someUser, "update")).toBeBoolean();
expectTypeOf(myDelta.canUserModify(someUser, "create", {})).toBeBoolean();
expectTypeOf(myDelta.canUserModify(someUser, "create", myDelta.toObject())).toBeBoolean();

expectTypeOf(myDelta.testUserPermission(someUser, "OBSERVER")).toBeBoolean();
expectTypeOf(myDelta.testUserPermission(someUser, CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED)).toBeBoolean();
expectTypeOf(myDelta.testUserPermission(someUser, "OBSERVER", {})).toBeBoolean();
expectTypeOf(myDelta.testUserPermission(someUser, "OBSERVER", { exact: true })).toBeBoolean();
expectTypeOf(myDelta.testUserPermission(someUser, "OBSERVER", { exact: null })).toBeBoolean();

// @ts-expect-error Tile is not a valid name of an embedded document of Actor
myDelta.getBaseCollection("Tile");
expectTypeOf(myDelta.getBaseCollection("ActiveEffect")).toEqualTypeOf<
  EmbeddedCollection<ActiveEffect.Implementation, Actor.Implementation> | undefined
>();
expectTypeOf(myDelta.getBaseCollection("Item")).toEqualTypeOf<
  EmbeddedCollection<Item.Implementation, Actor.Implementation> | undefined
>();
