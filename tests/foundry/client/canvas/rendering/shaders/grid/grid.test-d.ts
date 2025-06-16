import { expectTypeOf } from "vitest";

import GridShader = foundry.canvas.rendering.shaders.GridShader;

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(GridShader.TYPE_UNIFORM).toEqualTypeOf<string>();
expectTypeOf(GridShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(GridShader.create()).toEqualTypeOf<GridShader>();

declare const myGS: GridShader;
expectTypeOf(myGS.configure({ style: 5 })).toEqualTypeOf<void>();
expectTypeOf(myGS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
