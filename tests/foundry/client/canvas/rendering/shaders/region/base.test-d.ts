import { expectTypeOf, test } from "vitest";

import RegionShader = foundry.canvas.rendering.shaders.RegionShader;

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

test("foundry/client/canvas/rendering/shaders/region/base", () => {
  const myRS = RegionShader.create();
  expectTypeOf(myRS).toEqualTypeOf<RegionShader>();

  expectTypeOf(myRS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
});
