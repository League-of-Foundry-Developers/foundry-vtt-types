import { expectTypeOf } from "vitest";

import PolygonMesher = foundry.canvas.geometry.PolygonMesher;

declare const somePoly: PIXI.Polygon;
declare const someGeometry: PIXI.Geometry;

expectTypeOf(PolygonMesher.getClipperPathFromPoints(somePoly, 3)).toEqualTypeOf<ClipperLib.Path>();

new PolygonMesher(somePoly);
const myPolygonMesher = new PolygonMesher([1, 2, 3, 4], {
  depthInner: 2,
  depthOuter: 1,
  interleaved: true,
  miterLimit: undefined,
  normalize: false,
  offset: 50,
  radius: 200,
  scale: 10e6,
  x: 202,
  y: 303,
});

expectTypeOf(myPolygonMesher.triangulate(someGeometry)).toEqualTypeOf<PIXI.Geometry>();
