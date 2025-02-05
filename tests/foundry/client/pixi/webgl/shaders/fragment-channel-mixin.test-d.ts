import { expectTypeOf } from "vitest";

class MyFragmentChannelShader extends AdaptiveFragmentChannelMixin(BaseSamplerShader) {}

//TODO: figure out how to make this return the mixed shader or filter class
expectTypeOf(MyFragmentChannelShader.create({ channel: "r", foo: 0.5, bar: [1, 0] })).toEqualTypeOf<
  PIXI.Shader | PIXI.Filter
>();
if (MyFragmentChannelShader.adaptiveFragmentShader) {
  expectTypeOf(MyFragmentChannelShader.adaptiveFragmentShader).toEqualTypeOf<
    (channel: AdaptiveFragmentChannelMixin.Channel) => string
  >();
} else {
  expectTypeOf(MyFragmentChannelShader.adaptiveFragmentShader).toEqualTypeOf<null>();
}

declare const someProgram: PIXI.Program;
const myFCSInstance = new MyFragmentChannelShader(someProgram, { baz: 32 });
expectTypeOf(myFCSInstance.uniforms).toMatchTypeOf<AbstractBaseShader.Uniforms>();
