import { expectTypeOf, test } from "vitest";

import AbstractBaseFilter = foundry.canvas.rendering.filters.AbstractBaseFilter;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

test("foundry/client/canvas/rendering/filters/base-filter", () => {
  class TestFilter extends AbstractBaseFilter {}

  const testFilterInstance = TestFilter.create();
  expectTypeOf(testFilterInstance).toEqualTypeOf<TestFilter>();

  expectTypeOf(TestFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

  expectTypeOf(TestFilter.create({ alpha: 1 }, { custom: true })).toEqualTypeOf<TestFilter>();

  expectTypeOf(testFilterInstance.padding).toExtend<number>();
  expectTypeOf(testFilterInstance["_configure"]({ custom: true })).toEqualTypeOf<void>();
});
