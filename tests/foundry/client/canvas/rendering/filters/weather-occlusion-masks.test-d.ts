import { expectTypeOf } from "vitest";

import WeatherOcclusionMaskFilter = foundry.canvas.rendering.filters.WeatherOcclusionMaskFilter;

const myWOMF = WeatherOcclusionMaskFilter.create();
expectTypeOf(myWOMF).toEqualTypeOf<WeatherOcclusionMaskFilter>();

expectTypeOf(myWOMF.elevation).toEqualTypeOf<number>();
