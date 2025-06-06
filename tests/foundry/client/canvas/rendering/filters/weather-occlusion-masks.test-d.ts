import { expectTypeOf } from "vitest";
import { WeatherOcclusionMaskFilter } from "#client/canvas/rendering/filters/_module.mjs";

const myWOMF = WeatherOcclusionMaskFilter.create();
expectTypeOf(myWOMF).toEqualTypeOf<WeatherOcclusionMaskFilter>();

expectTypeOf(WeatherOcclusionMaskFilter.vertexShader).toEqualTypeOf<string>();

expectTypeOf(myWOMF.elevation).toEqualTypeOf<number>();
