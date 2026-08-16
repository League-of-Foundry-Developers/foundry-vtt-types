import { expectTypeOf } from "vitest";
import type { DeepReadonly } from "fvtt-types/utils";

import Canvas = foundry.canvas.Canvas;
import PolygonTree = foundry.data.PolygonTree;
import PolygonTreeNode = foundry.data.PolygonTreeNode;

declare const somePath: PIXI.Polygon.ClipperPath;
declare const somePolyTree: ClipperLib.PolyTree;
declare const someNode: PolygonTreeNode;

expectTypeOf(PolygonTreeNode["_fromClipperPath"](somePath, null)).toEqualTypeOf<PolygonTreeNode>();
expectTypeOf(PolygonTreeNode["_fromClipperPath"](somePath, someNode)).toEqualTypeOf<PolygonTreeNode>();
expectTypeOf(PolygonTree.fromClipperPolyTree(somePolyTree)).toEqualTypeOf<PolygonTree>();

const myTree = new PolygonTree();

expectTypeOf(myTree.parent).toEqualTypeOf<PolygonTreeNode | null>();
expectTypeOf(myTree.children).toEqualTypeOf<readonly PolygonTreeNode[]>();
expectTypeOf(myTree.depth).toBeNumber();
expectTypeOf(myTree.isHole).toBeBoolean();
expectTypeOf(myTree.isEmpty).toBeBoolean();
expectTypeOf(myTree.clipperPath).toEqualTypeOf<DeepReadonly<PIXI.Polygon.ClipperPath> | null>();
expectTypeOf(myTree.polygon).toEqualTypeOf<PIXI.Polygon | null>();
expectTypeOf(myTree.points).toEqualTypeOf<readonly number[] | null>();
expectTypeOf(myTree.path).toEqualTypeOf<readonly Canvas.Point[] | null>();

// The root node combines the bounds of all of its children, so this is never `null` in v14.
expectTypeOf(myTree.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myTree.area).toBeNumber();

for (const node of myTree) {
  expectTypeOf(node).toEqualTypeOf<PolygonTreeNode>();
}

expectTypeOf(myTree.findContainingNode({ x: 5, y: 10 })).toEqualTypeOf<PolygonTreeNode | null>();
expectTypeOf(myTree.testPoint({ x: 5, y: 10 })).toBeBoolean();
expectTypeOf(myTree.testPoint({ x: 5, y: 10 }, 20)).toBeBoolean();
expectTypeOf(myTree.testCircle({ x: 500, y: 7 }, 500)).toEqualTypeOf<-1 | 0 | 1>();
expectTypeOf(myTree.findClosestPoint({ x: 5, y: 10 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(myTree.polygons).toEqualTypeOf<readonly PIXI.Polygon[]>();
expectTypeOf(myTree.clipperPaths).toEqualTypeOf<DeepReadonly<PIXI.Polygon.ClipperPath[]>>();
expectTypeOf(myTree.triangulation).toEqualTypeOf<PolygonTree.Triangulation>();
expectTypeOf(myTree.triangulation.vertices).toEqualTypeOf<Float32Array>();
expectTypeOf(myTree.triangulation.indices).toEqualTypeOf<Uint16Array | Uint32Array>();

declare const someGraphics: PIXI.Graphics;
expectTypeOf(myTree.drawShape(someGraphics)).toBeVoid();

declare const somePolygon: PIXI.Polygon;
expectTypeOf(myTree.intersectPolygon(somePolygon)).toEqualTypeOf<PolygonTree>();
expectTypeOf(
  myTree.intersectPolygon(somePolygon, {
    clipType: ClipperLib.ClipType.ctUnion,
    fillType: undefined,
  }),
).toEqualTypeOf<PolygonTree>();
expectTypeOf(myTree.intersectClipper(somePath)).toEqualTypeOf<PolygonTree>();
expectTypeOf(
  myTree.intersectClipper(somePath, { fillType: ClipperLib.PolyFillType.pftNonZero }),
).toEqualTypeOf<PolygonTree>();

expectTypeOf(myTree.sampleInterior()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(myTree.sampleInterior({ x: 0, y: 0 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(myTree.sampleBoundary()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(myTree.sampleBoundary({ x: 0, y: 0 })).toEqualTypeOf<Canvas.Point>();

// The v13 names remain available from `regionShapes` as deprecated value-only aliases.
/* eslint-disable @typescript-eslint/no-deprecated */
expectTypeOf(foundry.data.regionShapes.RegionPolygonTree).toEqualTypeOf<typeof PolygonTree>();
expectTypeOf(foundry.data.regionShapes.RegionPolygonTreeNode).toEqualTypeOf<typeof PolygonTreeNode>();
/* eslint-enable @typescript-eslint/no-deprecated */
