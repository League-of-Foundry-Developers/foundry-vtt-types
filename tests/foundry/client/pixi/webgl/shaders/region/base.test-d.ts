import { expectTypeOf } from "vitest";

let myRS;
declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(RegionShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myRS = RegionShader.create())).toEqualTypeOf<RegionShader>();

expectTypeOf(myRS._preRender(someMesh, someRenderer)).toEqualTypeOf<void>();
