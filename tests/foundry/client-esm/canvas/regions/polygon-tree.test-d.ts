import { expectTypeOf } from "vitest";
import type { ValueOf } from "../../../../../src/utils/index.d.mts";
import type RegionPolygonTree from "../../../../../src/foundry/client-esm/canvas/regions/polygon-tree.d.mts";

const RPT = foundry.canvas.regions.RegionPolygonTree;

declare const somePath: ClipperLib.Path;
declare const somePolyTree: ClipperLib.PolyTree;
declare const someOtherRPT: RegionPolygonTree;
type RegionPolygonTreeNode = ValueOf<RegionPolygonTree["children"]>;

expectTypeOf(RPT["_fromClipperPath"](somePath, null)).toEqualTypeOf<RegionPolygonTreeNode>();
expectTypeOf(RPT["_fromClipperPath"](somePath, someOtherRPT)).toEqualTypeOf<RegionPolygonTreeNode>();
expectTypeOf(RPT["_fromClipperPolyTree"](somePolyTree)).toEqualTypeOf<RegionPolygonTree>();

const myRPT = new RPT();

expectTypeOf(myRPT.parent).toEqualTypeOf<RegionPolygonTreeNode | null>();

// this is truly redundant given how we had to extract it above
expectTypeOf(myRPT.children).toEqualTypeOf<RegionPolygonTreeNode[]>();

expectTypeOf(myRPT.depth).toBeNumber();
expectTypeOf(myRPT.isHole).toBeBoolean();
expectTypeOf(myRPT.clipperPath).toEqualTypeOf<ClipperLib.Path | null>();
expectTypeOf(myRPT.polygon).toEqualTypeOf<PIXI.Polygon | null>();
expectTypeOf(myRPT.points).toEqualTypeOf<number[] | null>();
expectTypeOf(myRPT.bounds).toEqualTypeOf<PIXI.Rectangle | null>();

for (const node of myRPT) {
  expectTypeOf(node).toEqualTypeOf<RegionPolygonTreeNode>();
}

expectTypeOf(myRPT.testPoint({ x: 5, y: 10 })).toBeBoolean();
expectTypeOf(myRPT.testCircle({ x: 500, y: 7 }, 500)).toEqualTypeOf<-1 | 0 | 1>();
