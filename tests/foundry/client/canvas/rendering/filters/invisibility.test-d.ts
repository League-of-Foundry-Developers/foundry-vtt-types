import { expectTypeOf, test } from "vitest";

import InvisibilityFilter = foundry.canvas.rendering.filters.InvisibilityFilter;

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/filters/invisibility", () => {
  expectTypeOf(InvisibilityFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

  const myIF = InvisibilityFilter.create();
  expectTypeOf(myIF).toEqualTypeOf<InvisibilityFilter>();
  expectTypeOf(myIF.padding).toEqualTypeOf<number>();
});
