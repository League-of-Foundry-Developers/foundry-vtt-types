import { expectTypeOf } from "vitest";
import { AdaptiveFragmentChannelMixin } from "#client/canvas/rendering/mixins/_module.mjs";

class MyFragmentChannelShader extends AdaptiveFragmentChannelMixin(BaseSamplerShader) {}

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
expectTypeOf(myFCSInstance.uniforms).toExtend<AbstractBaseShader.Uniforms>();
