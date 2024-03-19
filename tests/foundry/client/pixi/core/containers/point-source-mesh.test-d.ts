import { expectTypeOf } from "vitest";

const myGeometry = new PIXI.Geometry();

const myShader = AdaptiveLightingShader.create();

// Matches a call made in RenderedPointSource##createMesh
// @ts-expect-error This is a bonafide type error in the Foundry source
const myPointSourceMesh = new PointSourceMesh(myGeometry, myShader);

expectTypeOf(myPointSourceMesh.addChild()).toEqualTypeOf<never>();
