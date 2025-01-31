import { expectTypeOf } from "vitest";

const intPoint = new ClipperLib.IntPoint(50, 50);
declare const otherIntPoint: ClipperLib.IntPoint;
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
