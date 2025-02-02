import { expectTypeOf } from "vitest";

declare const somePoly: PIXI.Polygon;
declare const someGometry: PIXI.Geometry;

expectTypeOf(PolygonMesher.getClipperPathFromPoints(somePoly, 3)).toEqualTypeOf<ClipperLib.Path>();

const myPolygonMesher = new PolygonMesher([1, 2, 3, 4], {
  depthInner: null,
  depthOuter: 7,
  interleaved: true,
  miterLimit: undefined,
  normalize: null,
  offset: 50,
  radius: 200,
  x: 202,
  y: 303,
});

expectTypeOf(myPolygonMesher.triangulate(someGometry)).toEqualTypeOf<PIXI.Geometry>();
