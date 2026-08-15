import { expectTypeOf } from "vitest";

import AbstractWeatherShader = foundry.canvas.rendering.shaders.AbstractWeatherShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

declare class MyWeatherShader extends AbstractWeatherShader<{
  foo: number;
  bar: [number, number];
}> {}
const AWS = MyWeatherShader;
let myAWS;

expectTypeOf((myAWS = AWS.create())).toEqualTypeOf<AbstractWeatherShader>();

expectTypeOf(AWS.defaultUniforms).toEqualTypeOf<AbstractWeatherShader.CommonUniforms>();
expectTypeOf(AWS.commonUniforms).toEqualTypeOf<AbstractWeatherShader.CommonUniforms>();
expectTypeOf(AWS["_createVertexShader"]()).toEqualTypeOf<string>();

expectTypeOf(myAWS.speed).toEqualTypeOf<number>();
expectTypeOf(myAWS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

// dynamic properties
expectTypeOf(myAWS.foo).toBeNumber();
expectTypeOf(myAWS.bar).toEqualTypeOf<[number, number]>();
