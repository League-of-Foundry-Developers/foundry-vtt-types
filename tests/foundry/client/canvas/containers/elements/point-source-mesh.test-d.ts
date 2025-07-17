import { describe, expectTypeOf, test } from "vitest";

import AdaptiveBackgroundShader = foundry.canvas.rendering.shaders.AdaptiveBackgroundShader;
import PointSourceMesh = foundry.canvas.containers.PointSourceMesh;

const myGeometry = new PIXI.Geometry();
const myShader = AdaptiveBackgroundShader.create();
declare const someState: PIXI.State;
declare const someRect: PIXI.Rectangle;

describe("PointSourceMesh Tests", () => {
  // Matches a call made in `RenderedPointSource##createMesh`, the only place Foundry calls `new`
  const myPSM = new PointSourceMesh(myGeometry, myShader, someState);

  test("Uncategorized", () => {
    // test the type param
    expectTypeOf(myPSM.shader).toEqualTypeOf<typeof myShader>();

    expectTypeOf(myPSM.geometry).toEqualTypeOf<PIXI.Geometry>();
    myPSM.geometry = myGeometry; // Setter

    expectTypeOf(myPSM.addChild()).toEqualTypeOf<never>();
    expectTypeOf(myPSM.addChildAt()).toEqualTypeOf<never>();

    expectTypeOf(myPSM.getLocalBounds(someRect)).toEqualTypeOf<PIXI.Rectangle>();
  });
});
