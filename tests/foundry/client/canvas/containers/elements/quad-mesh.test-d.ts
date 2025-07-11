import { expectTypeOf } from "vitest";

import QuadMesh = foundry.canvas.containers.QuadMesh;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import BaseSamplerShader = foundry.canvas.rendering.shaders.BaseSamplerShader;

const myQM = new QuadMesh(BaseSamplerShader);

expectTypeOf(myQM.shader).toEqualTypeOf<AbstractBaseShader>();

expectTypeOf(myQM.blendMode).toEqualTypeOf<PIXI.BLEND_MODES>();
myQM.blendMode = PIXI.BLEND_MODES.SOFT_LIGHT; // Setter

expectTypeOf(myQM.setShaderClass(BaseSamplerShader)).toBeVoid();

declare const someRenderer: PIXI.Renderer;
expectTypeOf(myQM["_render"](someRenderer)).toBeVoid();
expectTypeOf(myQM["_calculateBounds"]()).toBeVoid();

expectTypeOf(myQM.containsPoint({ x: 500, y: 500 })).toEqualTypeOf<boolean>();
expectTypeOf(myQM.destroy()).toBeVoid();
