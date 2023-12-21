import { expectTypeOf } from "vitest";
class TestShader extends AbstractBaseShader {
  constructor(program: PIXI.Program, uniforms: AbstractBaseShader.Uniforms) {
    super(program, uniforms);
    this.defaults = this._defaults;
  }

  defaults: AbstractBaseShader["_defaults"];
}

// const testShader = TestShader.create();
expectTypeOf(TestShader.defaultUniforms.foo).toEqualTypeOf<AbstractBaseShader.UniformValue>();
expectTypeOf(TestShader.defaultUniforms.bar).toEqualTypeOf<AbstractBaseShader.UniformValue>();

const testShader2 = TestShader.create({
  alpha: 1.0,
  ratio: 0.5,
  colorDim: [0.5, 0.5, 0.5],
  colorBright: [1.0, 1.0, 1.0],
  time: 0,
  intensity: 5,
});
testShader2.uniforms.darkness = false;

// @ts-expect-error - create requires a constructor for TestShader
TestShader.create({ foo: "bar" });
