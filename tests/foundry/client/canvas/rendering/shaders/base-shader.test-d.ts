import { expectTypeOf } from "vitest";

const { AbstractBaseShader } = foundry.canvas.rendering.shaders;

class TestShader extends AbstractBaseShader {}

expectTypeOf(TestShader.defaultUniforms.foo).toEqualTypeOf<AbstractBaseShader.UniformValue | undefined>();
expectTypeOf(TestShader.defaultUniforms.bar).toEqualTypeOf<AbstractBaseShader.UniformValue | undefined>();

// BaseShaderMixin tests
expectTypeOf(TestShader.WAVE()).toEqualTypeOf<string>();
expectTypeOf(TestShader.FBM(2, 1.6)).toEqualTypeOf<string>();
expectTypeOf(TestShader.VORONOI).toEqualTypeOf<string>();

const testShaderInstance = TestShader.create({
  alpha: 1.0,
  ratio: 0.5,
  colorDim: [0.5, 0.5, 0.5],
  colorBright: [1.0, 1.0, 1.0],
  time: 0,
  intensity: 5,
});
testShaderInstance.uniforms.darkness = false;

// @ts-expect-error - string is not a valid UniformValue
TestShader.create({ foo: "bar" });
