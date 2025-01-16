import { expectTypeOf } from "vitest";

const AWS = AbstractWeatherShader;
let myAWS;

expectTypeOf(AWS.fragmentShader).toEqualTypeOf<string | AbstractBaseShader.FragmentShaderFunction>();
expectTypeOf(AWS.createProgram()).toEqualTypeOf<PIXI.Program>();
expectTypeOf(AWS.vertexShader).toEqualTypeOf<string>();
expectTypeOf((myAWS = AWS.create())).toEqualTypeOf<AbstractWeatherShader>();

expectTypeOf(myAWS.speed).toEqualTypeOf<number>();
expectTypeOf(myAWS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();
