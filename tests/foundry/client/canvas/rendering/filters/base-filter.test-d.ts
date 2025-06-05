import { expectTypeOf } from "vitest";
import { AbstractBaseFilter } from "#client/canvas/rendering/filters/_module.mjs";
import { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.mjs";

class TestFilter extends AbstractBaseFilter {}

const testFilterInstance = TestFilter.create();
expectTypeOf(testFilterInstance).toEqualTypeOf<TestFilter>();

expectTypeOf(TestFilter.vertexShader).toEqualTypeOf<string | undefined>();
expectTypeOf(TestFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();

expectTypeOf(testFilterInstance.padding).toExtend<number>();
