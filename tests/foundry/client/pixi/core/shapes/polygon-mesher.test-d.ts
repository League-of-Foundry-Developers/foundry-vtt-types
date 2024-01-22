import { expectTypeOf } from "vitest";

const myPolygonMesher = new PolygonMesher([1, 2]);

const myGeometry = new PIXI.Geometry();

expectTypeOf(myPolygonMesher.triangulate(myGeometry)).toEqualTypeOf<PIXI.Geometry>();
