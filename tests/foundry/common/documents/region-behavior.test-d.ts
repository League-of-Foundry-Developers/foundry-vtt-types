import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseRegionBehavior = foundry.documents.BaseRegionBehavior;
import Document = foundry.abstract.Document;

class TestRegionBehavior extends BaseRegionBehavior {}

let myRB;
// @ts-expect-error RegionBehavior requires a `type` for creation
myRB = new TestRegionBehavior();
// @ts-expect-error RegionBehavior requires a `type` for creation
myRB = new TestRegionBehavior({});
myRB = new TestRegionBehavior({
  _id: "XXXXXSomeIDXXXXX",
  name: "Some Behaviour",
  type: "executeScript", // required for creation
  system: {},
  disabled: true,
  flags: {
    core: {
      sheetLock: false,
    },
  },
  _stats: {
    compendiumSource: "Compendium.mysystem.pack-id.RegionBehavior.YYYYYSomeIDYYYYY",
    coreVersion: "12",
    createdTime: 123456789,
    duplicateSource: "Scene.ZZZZZSomeIDZZZZZ.Region.WWWWWSomeIDWWWWW.RegionBehavior.VVVVVSomeIDVVVVV",
    lastModifiedBy: "UUUUUSomeIDUUUUU",
    modifiedTime: 987654321,
    systemId: "pf2e",
    systemVersion: "6.10.2",
  },
});

myRB = new TestRegionBehavior({
  _id: null,
  name: null,
  type: "executeScript", // required for creation
  system: null,
  disabled: null,
  flags: null,
  _stats: {
    compendiumSource: null,
    coreVersion: null,
    createdTime: null,
    duplicateSource: null,
    lastModifiedBy: null,
    modifiedTime: null,
    systemId: null,
    systemVersion: null,
  },
});
myRB = new TestRegionBehavior({
  type: "executeScript", // required for creation
  _stats: null,
});

myRB = new TestRegionBehavior({
  _id: undefined,
  name: undefined,
  type: "executeScript", // required for creation
  system: undefined,
  disabled: undefined,
  flags: undefined,
  _stats: {
    compendiumSource: undefined,
    coreVersion: undefined,
    createdTime: undefined,
    duplicateSource: undefined,
    lastModifiedBy: undefined,
    modifiedTime: undefined,
    systemId: undefined,
    systemVersion: undefined,
  },
});
myRB = new TestRegionBehavior({
  type: "executeScript", // required for creation
  _stats: undefined,
});

expectTypeOf(myRB).toEqualTypeOf<BaseRegionBehavior>();

expectTypeOf(myRB._id).toEqualTypeOf<string | null>();
expectTypeOf(myRB.name).toBeString();
// TODO: fix somehow
// excessively deep error
// expectTypeOf(myRB.type).toEqualTypeOf<
//   foundry.data.fields.DocumentTypeField.InitializedType<
//     typeof BaseRegionBehavior,
//     foundry.data.fields.DocumentTypeField.DefaultOptions
//   >
// >();
// expectTypeOf(myRB.system).toEqualTypeOf</* ???? */>()
expectTypeOf(myRB.disabled).toBeBoolean();
expectTypeOf(myRB.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
expectTypeOf(myRB._stats).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.fields.DocumentStatsField.Schema>
>();
