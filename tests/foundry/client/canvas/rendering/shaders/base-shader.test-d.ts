import { expectTypeOf } from "vitest";

import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

class TestShader extends AbstractBaseShader {}

// BaseShaderMixin tests
expectTypeOf(TestShader.CONSTANTS).toBeString();
expectTypeOf(TestShader.PERCEIVED_BRIGHTNESS).toBeString();
expectTypeOf(TestShader.SIMPLEX_3D).toBeString();
expectTypeOf(TestShader.COLOR_SPACES).toBeString();

expectTypeOf(TestShader.FBM()).toBeString();
expectTypeOf(TestShader.FBM(undefined, undefined)).toBeString();
expectTypeOf(TestShader.FBM(42, 0.7)).toBeString();

expectTypeOf(TestShader.FBMHQ()).toBeString();
expectTypeOf(TestShader.FBMHQ(undefined, undefined, undefined, undefined)).toBeString();
expectTypeOf(TestShader.FBMHQ(7, "foo", "bar", "baz")).toBeString();

expectTypeOf(TestShader.PIE).toBeString();
expectTypeOf(TestShader.PRNG_LEGACY).toBeString();
expectTypeOf(TestShader.PRNG).toBeString();
expectTypeOf(TestShader.PRNG2D).toBeString();
expectTypeOf(TestShader.PRNG3D).toBeString();
expectTypeOf(TestShader.NOISE).toBeString();
expectTypeOf(TestShader.HSB2RGB).toBeString();

expectTypeOf(TestShader.WAVE()).toBeString();
expectTypeOf(TestShader.WAVE(undefined)).toBeString();
expectTypeOf(TestShader.WAVE("tan")).toBeString();
// @ts-expect-error "foo" is not a valid trig function
TestShader.WAVE("foo");

expectTypeOf(TestShader.ROTATION).toBeString();
expectTypeOf(TestShader.VORONOI).toBeString();
expectTypeOf(TestShader.GLSL1_COMPATIBILITY_VERTEX).toBeString();
expectTypeOf(TestShader.GLSL1_COMPATIBILITY_FRAGMENT).toBeString();

// AbstractBaseShader tests

expectTypeOf(TestShader.defaultUniforms["foo"]).toEqualTypeOf<AbstractBaseShader.UniformValue | undefined>();
expectTypeOf(TestShader.defaultUniforms["bar"]).toEqualTypeOf<AbstractBaseShader.UniformValue | undefined>();

const testShaderInstance = TestShader.create({
  alpha: 1.0,
  ratio: 0.5,
  colorDim: [0.5, 0.5, 0.5],
  colorBright: [1.0, 1.0, 1.0],
  time: 0,
  intensity: 5,
});
testShaderInstance.uniforms["darkness"] = false;

// @ts-expect-error - string is not a valid UniformValue
TestShader.create({ foo: "bar" });
