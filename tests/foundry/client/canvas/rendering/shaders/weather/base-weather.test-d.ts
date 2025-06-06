import { expectTypeOf } from "vitest";
import { AbstractBaseShader, AbstractWeatherShader } from "#client/canvas/rendering/shaders/_module.mjs";

declare class MyWeatherShader extends AbstractWeatherShader<{
  foo: number;
  bar: [number, number];
}> {}
const AWS = MyWeatherShader;
let myAWS;

expectTypeOf(AWS.fragmentShader).toEqualTypeOf<string | AbstractBaseShader.FragmentShaderFunction>();
expectTypeOf(AWS.createProgram()).toEqualTypeOf<PIXI.Program>();
expectTypeOf(AWS.vertexShader).toEqualTypeOf<string>();
expectTypeOf((myAWS = AWS.create())).toEqualTypeOf<AbstractWeatherShader>();

expectTypeOf(myAWS.speed).toEqualTypeOf<number>();
expectTypeOf(myAWS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

// dynamic properties
expectTypeOf(myAWS.foo).toBeNumber();
expectTypeOf(myAWS.bar).toEqualTypeOf<[number, number]>();
