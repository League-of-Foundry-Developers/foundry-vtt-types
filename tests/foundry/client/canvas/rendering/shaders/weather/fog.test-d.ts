import { expectTypeOf } from "vitest";
import { AbstractBaseShader, FogShader } from "#client/canvas/rendering/shaders/_module.mjs";

const myFS = FogShader.create();
expectTypeOf(myFS).toEqualTypeOf<FogShader>();

expectTypeOf(FogShader.fragmentShader).toExtend<AbstractBaseShader.FragmentShaderFunction>();
expectTypeOf(FogShader.fragmentShader(CONST.CANVAS_PERFORMANCE_MODES.LOW)).toEqualTypeOf<string>();
expectTypeOf(FogShader.createProgram()).toEqualTypeOf<PIXI.Program>();
expectTypeOf(FogShader.OCTAVES(CONST.CANVAS_PERFORMANCE_MODES.HIGH)).toEqualTypeOf<string>();

expectTypeOf(myFS.speed).toEqualTypeOf<number>();
expectTypeOf(myFS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

// dynamic properties from `FogShader.DefaultUniforms`
expectTypeOf(myFS.intensity).toBeNumber();
expectTypeOf(myFS.rotation).toBeNumber();
expectTypeOf(myFS.slope).toBeNumber();
