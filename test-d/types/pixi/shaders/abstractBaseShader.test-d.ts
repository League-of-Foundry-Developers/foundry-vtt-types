import '../../../../index';
import { expectType } from 'tsd';

class TestShader extends AbstractBaseShader {
  constructor(program: PIXI.Program, uniforms: Partial<Record<string, Uniform>>) {
    super(program, uniforms);
    this.defaults = this._defaults;
  }

  defaults: AbstractBaseShader['_defaults'];
}

const testShader = TestShader.create();
expectType<Uniform | undefined>(testShader.defaults.foo);
expectType<Uniform | undefined>(testShader.defaults.bar);

const testShader2 = TestShader.create({
  someUniform: { type: '1i', value: 42 },
  anotherUniform: { type: 'Matrix2fv', value: [1.1, 2.2, 3.3, 4.4] }
});
testShader2.defaults.yetAnotherUniform = { type: 'c', value: [0, 0, 0] };
