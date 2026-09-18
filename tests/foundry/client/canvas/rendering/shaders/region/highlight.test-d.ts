import { expectTypeOf, test } from "vitest";

import HighlightRegionShader = foundry.canvas.rendering.shaders.HighlightRegionShader;

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

test("foundry/client/canvas/rendering/shaders/region/highlight", () => {
  const myHRS = HighlightRegionShader.create();
  expectTypeOf(myHRS).toEqualTypeOf<HighlightRegionShader>();

  expectTypeOf(myHRS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
});
