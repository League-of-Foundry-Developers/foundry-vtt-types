import { expectTypeOf, test } from "vitest";

import AdaptiveFragmentChannelMixin = foundry.canvas.rendering.mixins.AdaptiveFragmentChannelMixin;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;
import BaseSamplerShader = foundry.canvas.rendering.shaders.BaseSamplerShader;

declare const someProgram: PIXI.Program;

test("foundry/client/canvas/rendering/mixins/fragment-channel-mixin", () => {
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
  const myFCSInstance = new MyFragmentChannelShader(someProgram, { baz: 32 });
  expectTypeOf(myFCSInstance.uniforms).toExtend<AbstractBaseShader.Uniforms>();
});
