import { describe, expectTypeOf, test } from "vitest";
import type arcPath from "#client/canvas/vfx/paths/vfx-arc-path.mjs";
import type { ArcPathOptions, ArcPathParams, generateArcPoints } from "#client/canvas/vfx/paths/vfx-arc-path.mjs";
import type splinePath from "#client/canvas/vfx/paths/vfx-spline-path.mjs";
import type {
  SplinePathOptions,
  SplinePathParams,
  generateSplinePoints,
} from "#client/canvas/vfx/paths/vfx-spline-path.mjs";
import type weavePath from "#client/canvas/vfx/paths/vfx-weave-path.mjs";
import type {
  WeavePathOptions,
  WeavePathParams,
  generateWeavePoints,
} from "#client/canvas/vfx/paths/vfx-weave-path.mjs";

import VFXPath = foundry.canvas.vfx.VFXPath;

describe("arcPath", () => {
  test("returns VFXPath", () => {
    expectTypeOf<ReturnType<typeof arcPath>>().toEqualTypeOf<VFXPath>();
    expectTypeOf<ReturnType<typeof generateArcPoints>>().toEqualTypeOf<VFXPath.Position[]>();
  });

  test("params omit the overwritten `auxiliary`", () => {
    expectTypeOf<ArcPathOptions>().toHaveProperty("auxiliary");
    expectTypeOf<ArcPathParams>().not.toHaveProperty("auxiliary");
    expectTypeOf<ArcPathParams>().toHaveProperty("peakHeight");
    expectTypeOf<ArcPathParams>().toHaveProperty("step");
  });
});

describe("splinePath", () => {
  test("returns VFXPath", () => {
    expectTypeOf<ReturnType<typeof splinePath>>().toEqualTypeOf<VFXPath>();
    expectTypeOf<ReturnType<typeof generateSplinePoints>>().toEqualTypeOf<VFXPath.Position[]>();
  });

  test("params omit the overwritten `auxiliary`", () => {
    expectTypeOf<SplinePathOptions>().toHaveProperty("auxiliary");
    expectTypeOf<SplinePathParams>().not.toHaveProperty("auxiliary");
    expectTypeOf<SplinePathParams>().toHaveProperty("tangentScale");
    expectTypeOf<SplinePathParams>().toHaveProperty("stepElevation");
  });
});

describe("weavePath", () => {
  test("returns VFXPath", () => {
    expectTypeOf<ReturnType<typeof weavePath>>().toEqualTypeOf<VFXPath>();
    expectTypeOf<ReturnType<typeof generateWeavePoints>>().toEqualTypeOf<VFXPath.Position[]>();
  });

  test("params omit the overwritten `auxiliary`", () => {
    expectTypeOf<WeavePathOptions>().toHaveProperty("auxiliary");
    expectTypeOf<WeavePathParams>().not.toHaveProperty("auxiliary");
    expectTypeOf<WeavePathParams>().toHaveProperty("amplitude");
    expectTypeOf<WeavePathParams>().toHaveProperty("step");
  });
});
