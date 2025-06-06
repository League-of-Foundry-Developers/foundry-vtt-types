import { expectTypeOf } from "vitest";
import { RegionShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myRS = RegionShader.create();
expectTypeOf(myRS).toEqualTypeOf<RegionShader>();

declare const someMesh: PIXI.Mesh;
declare const someRenderer: PIXI.Renderer;

expectTypeOf(RegionShader.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myRS["_preRender"](someMesh, someRenderer)).toEqualTypeOf<void>();
