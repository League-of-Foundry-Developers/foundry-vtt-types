import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import type EmbeddedCollection from "../../../../src/foundry/common/abstract/embedded-collection.d.mts";
import BaseRegion = foundry.documents.BaseRegion;
import Document = foundry.abstract.Document;

class TestRegion extends BaseRegion {}

// Not sure know how to make this a specific type of behaviour *and* `.Implementation`
declare const someScriptBehavior: RegionBehavior<"executeScript">;
let myRegion;
myRegion = new TestRegion();
myRegion = new TestRegion({});
myRegion = new TestRegion({
  _id: "XXXXXSomeIDXXXXX",
  name: "Some Region",
  color: "#ABEFCD",
  shapes: [], //TODO: type properly once regionshapes PR is merged
  elevation: {
    bottom: 0,
    top: 50,
  },
  //@ts-expect-error excessively deep
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
  name: null,
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
myRegion = new TestRegion({ elevation: null });

myRegion = new TestRegion({
  _id: undefined,
  name: undefined,
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
myRegion = new TestRegion({ elevation: undefined });

expectTypeOf(myRegion).toEqualTypeOf<BaseRegion>();

expectTypeOf(myRegion._id).toEqualTypeOf<string | null>();
expectTypeOf(myRegion.name).toBeString();
expectTypeOf(myRegion.color).toEqualTypeOf<Color>();
// expectTypeOf(myRegion.shapes).toEqualTypeOf</* ??? */>()
expectTypeOf(myRegion.elevation.bottom).toEqualTypeOf<number | null>();
expectTypeOf(myRegion.elevation.top).toEqualTypeOf<number | null>();
expectTypeOf(myRegion.behaviors).toEqualTypeOf<
  //TODO: why?
  //@ts-expect-error this is resolving as EmbeddedCollection<any, ...
  EmbeddedCollection<typeof foundry.documents.BaseRegionBehavior, Region.Implementation>
>();
expectTypeOf(myRegion.visibility).toEqualTypeOf<CONST.REGION_VISIBILITY | null>();
expectTypeOf(myRegion.locked).toBeBoolean();
expectTypeOf(myRegion.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
