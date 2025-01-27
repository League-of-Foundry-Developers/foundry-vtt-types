import { expectTypeOf } from "vitest";

let myHRS;
declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(HighlightRegionShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myHRS = HighlightRegionShader.create())).toEqualTypeOf<HighlightRegionShader>();

expectTypeOf(myHRS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
