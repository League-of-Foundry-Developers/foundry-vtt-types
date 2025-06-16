import { expectTypeOf } from "vitest";
import { InvisibilityFilter } from "#client/canvas/rendering/filters/_module.mjs";

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

expectTypeOf(InvisibilityFilter.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(InvisibilityFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

const myIF = InvisibilityFilter.create();
expectTypeOf(myIF).toEqualTypeOf<InvisibilityFilter>();
expectTypeOf(myIF.padding).toEqualTypeOf<number>();
