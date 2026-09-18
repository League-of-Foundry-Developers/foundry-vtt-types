import { expectTypeOf, test } from "vitest";

import WeatherOcclusionMaskFilter = foundry.canvas.rendering.filters.WeatherOcclusionMaskFilter;

test("foundry/client/canvas/rendering/filters/weather-occlusion-masks", () => {
  const myWOMF = WeatherOcclusionMaskFilter.create();
  expectTypeOf(myWOMF).toEqualTypeOf<WeatherOcclusionMaskFilter>();

  expectTypeOf(myWOMF.elevation).toEqualTypeOf<number>();
});
