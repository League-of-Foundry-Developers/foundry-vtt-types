import { expectTypeOf } from "vitest";
import type { FixedInstanceType, InterfaceToObject, RemoveIndexSignatures, ValueOf } from "fvtt-types/utils";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import BaseRegion = foundry.documents.BaseRegion;
import Document = foundry.abstract.Document;
import type { BaseShapeData } from "../../../../src/foundry/common/data/data.d.mts";

class TestRegion extends BaseRegion {}

// Not sure know how to make this a specific type of behaviour *and* `.Implementation`
declare const someScriptBehavior: RegionBehavior<"executeScript">;
let myRegion;
// @ts-expect-error Region construction requires a `name`
myRegion = new TestRegion();
// @ts-expect-error Region construction requires a `name`
myRegion = new TestRegion({});

myRegion = new TestRegion({
  _id: "XXXXXSomeIDXXXXX",
  name: "Some Region",
  color: "#ABEFCD",
  //TODO: fix TypedSchemaField typing?
  shapes: [
    {
      type: "rectangle",
      x: 1500,
      y: 500,
      width: 200,
      height: 200,
      hole: false,
      rotation: 72,
    },
  ],
  elevation: {
    bottom: 0,
    top: 50,
  },
  //TODO: this errors intermittently. circularities?
  behaviors: [someScriptBehavior],
  visibility: CONST.REGION_VISIBILITY.GAMEMASTER,
  locked: true,
  flags: {
    core: {
      sheetLock: false,
    },
  },
});

myRegion = new TestRegion({
  _id: null,
  name: "Some Region",
  color: null,
  shapes: null,
  elevation: {
    bottom: null,
    top: null,
  },
  behaviors: null,
  visibility: null,
  locked: null,
  flags: null,
});
myRegion = new TestRegion({
  name: "Some Region",
  elevation: null,
});

myRegion = new TestRegion({
  _id: undefined,
  name: "Some Region",
  color: undefined,
  shapes: undefined,
  elevation: {
    bottom: undefined,
    top: undefined,
  },
  behaviors: undefined,
  visibility: undefined,
  locked: undefined,
  flags: undefined,
});
myRegion = new TestRegion({
  name: "Some Region",
  elevation: undefined,
});

expectTypeOf(myRegion).toEqualTypeOf<BaseRegion>();

expectTypeOf(myRegion._id).toEqualTypeOf<string | null>();
expectTypeOf(myRegion.name).toBeString();
expectTypeOf(myRegion.color).toEqualTypeOf<Color>();

//TODO: why is this wrong
expectTypeOf(myRegion.shapes).toEqualTypeOf<FixedInstanceType<ValueOf<RemoveIndexSignatures<BaseShapeData.Types>>>>();

expectTypeOf(myRegion.elevation.bottom).toEqualTypeOf<number | null>();
expectTypeOf(myRegion.elevation.top).toEqualTypeOf<number | null>();

expectTypeOf(myRegion.behaviors).toEqualTypeOf<
  //TODO: why is this is resolving as EmbeddedCollection<any, ...
  EmbeddedCollection<typeof foundry.documents.BaseRegionBehavior, Region.Implementation>
>();

expectTypeOf(myRegion.visibility).toEqualTypeOf<CONST.REGION_VISIBILITY | null>();
expectTypeOf(myRegion.locked).toBeBoolean();
expectTypeOf(myRegion.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
