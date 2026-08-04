import { expectTypeOf } from "vitest";

import ElevatedSurfaceExposureGenerator = foundry.canvas.geometry.ElevatedSurfaceExposureGenerator;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;
import RegionPolygonTree = foundry.data.regionShapes.RegionPolygonTree;

declare const somePolygon: PointSourcePolygon.Any;

new ElevatedSurfaceExposureGenerator(somePolygon);
new ElevatedSurfaceExposureGenerator(somePolygon, {});
new ElevatedSurfaceExposureGenerator(somePolygon, { threshold: undefined });
const generator = new ElevatedSurfaceExposureGenerator(somePolygon, { threshold: 5 });

// @ts-expect-error a source polygon is required
new ElevatedSurfaceExposureGenerator();

expectTypeOf(generator.polygon).toEqualTypeOf<PointSourcePolygon.Any>();
expectTypeOf(generator.threshold).toBeNumber();
expectTypeOf(generator.result).toEqualTypeOf<RegionPolygonTree | null>();
expectTypeOf(generator.compute()).toEqualTypeOf<RegionPolygonTree | null>();

expectTypeOf(ElevatedSurfaceExposureGenerator.compute(somePolygon)).toEqualTypeOf<RegionPolygonTree | null>();
expectTypeOf(
  ElevatedSurfaceExposureGenerator.compute(somePolygon, { threshold: 10 }),
).toEqualTypeOf<RegionPolygonTree | null>();
