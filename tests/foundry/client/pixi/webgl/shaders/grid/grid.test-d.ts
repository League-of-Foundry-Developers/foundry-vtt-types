import { expectTypeOf } from "vitest";

let myGS;
declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(GridShader.TYPE_UNIFORM).toEqualTypeOf<string>();
expectTypeOf(GridShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myGS = GridShader.create())).toEqualTypeOf<GridShader>();

expectTypeOf(myGS.configure({ style: 5 })).toEqualTypeOf<void>();
expectTypeOf(myGS._preRender(someMesh, someRenderer)).toEqualTypeOf<void>();
