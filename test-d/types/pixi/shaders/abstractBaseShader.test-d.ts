import { expectError, expectType } from 'tsd';
import '../../../../index';

class TestShader extends AbstractBaseShader {
  constructor(program: PIXI.Program, uniforms: AbstractBaseShader.Uniforms) {
    super(program, uniforms);
    this.defaults = this._defaults;
  }

  defaults: AbstractBaseShader['_defaults'];
}

const testShader = TestShader.create();
expectType<AbstractBaseShader.UniformValue | undefined>(testShader.defaults.foo);
expectType<AbstractBaseShader.UniformValue | undefined>(testShader.defaults.bar);

const testShader2 = TestShader.create({
  alpha: 1.0,
  ratio: 0.5,
  colorDim: [0.5, 0.5, 0.5],
  colorBright: [1.0, 1.0, 1.0],
  time: 0,
  intensity: 5
});
testShader2.defaults.darkness = false;

expectError(TestShader.create({ foo: 'bar' }));
