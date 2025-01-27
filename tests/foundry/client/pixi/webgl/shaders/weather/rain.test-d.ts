import { expectTypeOf } from "vitest";

const RS = RainShader;
let myRS;

expectTypeOf(RS.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(RS.createProgram()).toEqualTypeOf<PIXI.Program>();
expectTypeOf((myRS = RS.create())).toEqualTypeOf<RainShader>();

expectTypeOf(myRS.speed).toEqualTypeOf<number>();
expectTypeOf(myRS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
