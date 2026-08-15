import { expectTypeOf } from "vitest";

const intPoint = new ClipperLib.IntPoint(50, 50);
declare const otherIntPoint: ClipperLib.IntPoint;
declare const someEdge: ClipperLib.TEdge;
const dblPoint = new ClipperLib.DoublePoint(intPoint);

expectTypeOf(ClipperLib.IntPoint.op_Equality(intPoint, otherIntPoint)).toEqualTypeOf<boolean>();
expectTypeOf(dblPoint.X).toEqualTypeOf<number>();

const clipper = new ClipperLib.Clipper(4 & 2);
const paths = new ClipperLib.Paths();
const polyTree = new ClipperLib.PolyTree();

expectTypeOf(
  clipper.Execute(
    ClipperLib.ClipType.ctDifference,
    paths,
    ClipperLib.PolyFillType.pftNegative,
    ClipperLib.PolyFillType.pftEvenOdd,
  ),
).toEqualTypeOf<boolean>();
expectTypeOf(
  clipper.Execute(
    ClipperLib.ClipType.ctDifference,
    polyTree,
    ClipperLib.PolyFillType.pftNegative,
    ClipperLib.PolyFillType.pftEvenOdd,
  ),
).toEqualTypeOf<boolean>();
expectTypeOf(clipper.Execute(ClipperLib.ClipType.ctDifference, polyTree)).toEqualTypeOf<boolean>();
expectTypeOf(clipper.Execute(ClipperLib.ClipType.ctDifference, paths)).toEqualTypeOf<boolean>();

expectTypeOf(ClipperLib.Clipper.$baseCtor).toEqualTypeOf<typeof ClipperLib.ClipperBase>();
expectTypeOf(ClipperLib.PolyTree.$baseCtor).toEqualTypeOf<typeof ClipperLib.PolyNode>();

expectTypeOf(clipper.UpdateEdgeIntoAEL(someEdge)).toEqualTypeOf<ClipperLib.TEdge>();
expectTypeOf(clipper.IntersectPoint(someEdge, someEdge, intPoint)).toEqualTypeOf<boolean | undefined>();

expectTypeOf(
  ClipperLib.Clipper.SimplifyPolygon(paths[0]!, ClipperLib.PolyFillType.pftNonZero),
).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(ClipperLib.Clipper.SimplifyPolygons(paths)).toEqualTypeOf<ClipperLib.Paths>();
expectTypeOf(
  ClipperLib.Clipper.SimplifyPolygons(paths, ClipperLib.PolyFillType.pftNonZero),
).toEqualTypeOf<ClipperLib.Paths>();

expectTypeOf(ClipperLib.Clipper.ClosedPathsFromPolyTree(polyTree)).toEqualTypeOf<ClipperLib.Paths>();

const clipperOffset = new ClipperLib.ClipperOffset(20, 0.25);

expectTypeOf(
  clipperOffset.AddPath(paths[0]!, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon),
).toEqualTypeOf<void>();
expectTypeOf(clipperOffset.OffsetPoint(0, 0, ClipperLib.JoinType.jtMiter)).toEqualTypeOf<number>();
