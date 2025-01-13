import { expectTypeOf } from "vitest";

let myWOMF;

expectTypeOf(WeatherOcclusionMaskFilter.vertexShader).toEqualTypeOf<string>();
expectTypeOf((myWOMF = WeatherOcclusionMaskFilter.create())).toEqualTypeOf<WeatherOcclusionMaskFilter>();

expectTypeOf(myWOMF.elevation).toEqualTypeOf<number>();
