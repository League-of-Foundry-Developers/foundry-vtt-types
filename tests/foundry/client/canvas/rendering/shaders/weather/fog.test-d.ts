import { expectTypeOf } from "vitest";

import FogShader = foundry.canvas.rendering.shaders.FogShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const myFS = FogShader.create();
expectTypeOf(myFS).toEqualTypeOf<FogShader>();

expectTypeOf(FogShader.OCTAVES(CONST.CANVAS_PERFORMANCE_MODES.HIGH)).toEqualTypeOf<string>();

expectTypeOf(myFS.speed).toEqualTypeOf<number>();
expectTypeOf(myFS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

// dynamic properties from `FogShader.DefaultUniforms`
expectTypeOf(myFS.intensity).toBeNumber();
expectTypeOf(myFS.rotation).toBeNumber();
expectTypeOf(myFS.slope).toBeNumber();
