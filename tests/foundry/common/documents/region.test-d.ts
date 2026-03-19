import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";

import BaseRegion = foundry.documents.BaseRegion;
import Document = foundry.abstract.Document;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;

class TestBaseRegion extends BaseRegion {
  get compendium() {
    return this.inCompendium
      ? (game.packs!.get(this.pack!) as foundry.documents.collections.CompendiumCollection.ForDocument<"Region">)
      : null;
  }
}

declare const someScriptBehavior: RegionBehavior.OfType<"executeScript">;

// @ts-expect-error Region construction requires a `name`
new TestBaseRegion();

// @ts-expect-error Region construction requires a `name`
new TestBaseRegion({});

new TestBaseRegion({
  _id: "XXXXXSomeIDXXXXX",
  name: "Some Region",
  color: "#ABEFCD",
  // TODO: fix TypedSchemaField typing?
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
  // TODO: this errors intermittently. circularities?
  behaviors: [someScriptBehavior],
  visibility: CONST.REGION_VISIBILITY.GAMEMASTER,
  locked: true,
  flags: {
    core: {
      sheetLock: false,
    },
  },
});

new TestBaseRegion({
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

new TestBaseRegion({
  name: "Some Region",
  elevation: null,
});

new TestBaseRegion({
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

const myRegion = new TestBaseRegion({
  name: "Some Region",
  elevation: undefined,
});

expectTypeOf(myRegion).toEqualTypeOf<TestBaseRegion>();

expectTypeOf(myRegion._id).toEqualTypeOf<string | null>();
expectTypeOf(myRegion.name).toBeString();
expectTypeOf(myRegion.color).toEqualTypeOf<Color>();
expectTypeOf(myRegion.shapes).toEqualTypeOf<
  Array<
    // TODO(LukeAbby): Arguably these merges shouldn't be being done as they're already a class instance.
    | ({ type: "rectangle" } & foundry.data.RectangleShapeData)
    | ({ type: "circle" } & foundry.data.CircleShapeData)
    | ({ type: "ellipse" } & foundry.data.EllipseShapeData)
    | ({ type: "polygon" } & foundry.data.PolygonShapeData)
  >
>();
expectTypeOf(myRegion.elevation.bottom).toEqualTypeOf<number | null>();
expectTypeOf(myRegion.elevation.top).toEqualTypeOf<number | null>();

expectTypeOf(myRegion.behaviors).toEqualTypeOf<
  EmbeddedCollection<RegionBehavior.Stored, RegionDocument.Implementation>
>();

expectTypeOf(myRegion.visibility).toEqualTypeOf<CONST.REGION_VISIBILITY | null>();
expectTypeOf(myRegion.locked).toBeBoolean();
expectTypeOf(myRegion.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
