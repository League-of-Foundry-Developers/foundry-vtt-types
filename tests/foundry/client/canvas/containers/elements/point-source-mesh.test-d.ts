import { expectTypeOf } from "vitest";

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

const myGeometry = new PIXI.Geometry();
const myShader = AdaptiveBackgroundShader.create();
declare const someState: PIXI.State;
declare const someRenderer: PIXI.Renderer;
declare const someRect: PIXI.Rectangle;

// Matches a call made in `RenderedPointSource##createMesh`, the only place Foundry calls `new`
const myPSM = new PointSourceMesh(myGeometry, myShader, someState);

expectTypeOf(myPSM.shader).toEqualTypeOf<typeof myShader>();
expectTypeOf(myPSM.addChild()).toEqualTypeOf<never>();
expectTypeOf(myPSM["_render"](someRenderer)).toEqualTypeOf<void>();
expectTypeOf(myPSM.getLocalBounds(someRect)).toEqualTypeOf<PIXI.Rectangle>();
