import { expectTypeOf } from "vitest";

const myGeometry = new PIXI.Geometry();

const myShader = AdaptiveLightingShader.create();

// Matches a call made in RenderedPointSource##createMesh
const myPointSourceMesh = new PointSourceMesh(myGeometry, myShader);
declare const someRect: PIXI.Rectangle;

expectTypeOf(myPointSourceMesh.geometry).toEqualTypeOf<PIXI.Geometry>();
expectTypeOf(myPointSourceMesh.addChild()).toEqualTypeOf<never>();
expectTypeOf(myPointSourceMesh.getLocalBounds(someRect)).toEqualTypeOf<PIXI.Rectangle>();
