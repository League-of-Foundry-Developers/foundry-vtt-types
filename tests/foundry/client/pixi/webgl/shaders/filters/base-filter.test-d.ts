import { expectTypeOf } from "vitest";

class TestFilter extends AbstractBaseFilter {}
let testFilterInstance;

expectTypeOf(TestFilter.vertexShader).toEqualTypeOf<string | undefined>();
expectTypeOf(TestFilter.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf((testFilterInstance = TestFilter.create())).toEqualTypeOf<TestFilter>();

expectTypeOf(testFilterInstance.padding).toMatchTypeOf<number>();
