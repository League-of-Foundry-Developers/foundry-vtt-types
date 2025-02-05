import { expectTypeOf } from "vitest";

const FS = FogShader;
let myFS;

expectTypeOf(FS.fragmentShader).toMatchTypeOf<AbstractBaseShader.FragmentShaderFunction>();
expectTypeOf(FS.fragmentShader(1)).toEqualTypeOf<string>();
expectTypeOf(FS.createProgram()).toEqualTypeOf<PIXI.Program>();
expectTypeOf(FS.OCTAVES(4)).toEqualTypeOf<string>();
expectTypeOf((myFS = FS.create())).toEqualTypeOf<FogShader>();

expectTypeOf(myFS.speed).toEqualTypeOf<number>();
expectTypeOf(myFS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
