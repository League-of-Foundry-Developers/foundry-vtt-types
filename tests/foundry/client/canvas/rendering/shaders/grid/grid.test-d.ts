import { expectTypeOf, test } from "vitest";

import GridShader = foundry.canvas.rendering.shaders.GridShader;

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

declare const myGS: GridShader;

test("foundry/client/canvas/rendering/shaders/grid/grid", () => {
  expectTypeOf(GridShader.TYPE_UNIFORM).toEqualTypeOf<string>();
  expectTypeOf(GridShader.create()).toEqualTypeOf<GridShader>();
  expectTypeOf(myGS.configure({ style: 5 })).toEqualTypeOf<void>();
  expectTypeOf(myGS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
});
