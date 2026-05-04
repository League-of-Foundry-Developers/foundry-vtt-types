import { expectTypeOf } from "vitest";

import AbstractBaseFilter = foundry.canvas.rendering.filters.AbstractBaseFilter;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

class TestFilter extends AbstractBaseFilter {}

const testFilterInstance = TestFilter.create();
expectTypeOf(testFilterInstance).toEqualTypeOf<TestFilter>();

expectTypeOf(TestFilter.vertexShader).toEqualTypeOf<string | undefined>();
expectTypeOf(TestFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

expectTypeOf(testFilterInstance.padding).toExtend<number>();
