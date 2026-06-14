import { describe, expectTypeOf, test } from "vitest";

import RegionGeometry = foundry.canvas.placeables.regions.RegionGeometry;
import Region = foundry.canvas.placeables.Region;

declare const someRegion: Region.Implementation;

describe("RegionGeometry Tests", () => {
  test("Construction", () => {
    // @ts-expect-error must supply a region
    new RegionGeometry();
    expectTypeOf(new RegionGeometry(someRegion)).toEqualTypeOf<RegionGeometry>();
  });

  const rg = new RegionGeometry(someRegion);

  test("Miscellaneous", () => {
    expectTypeOf(rg.region).toEqualTypeOf<Region.Implementation>();
    expectTypeOf(rg._clearBuffers()).toBeVoid();
    expectTypeOf(rg._updateBuffers()).toBeVoid();
  });
});
