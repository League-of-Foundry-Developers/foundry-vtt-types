import { describe, expectTypeOf, test } from "vitest";
import arcPath, { generateArcPoints } from "#client/canvas/vfx/paths/vfx-arc-path.mjs";
import weavePath, { generateWeavePoints } from "#client/canvas/vfx/paths/vfx-weave-path.mjs";

import VFXPath = foundry.canvas.vfx.VFXPath;

const p0: VFXPath.BasePathPoint = { x: 0, y: 0, elevation: 0 };
const p1: VFXPath.BasePathPoint = { x: 100, y: 100, elevation: 0 };

describe("arcPath", () => {
  test("returns VFXPath", () => {
    expectTypeOf(arcPath([p0, p1])).toEqualTypeOf<VFXPath>();
    expectTypeOf(arcPath([p0, p1], { peakRatio: 0.5 })).toEqualTypeOf<VFXPath>();
    expectTypeOf(generateArcPoints(p0, p1)).toEqualTypeOf<VFXPath.BasePathPoint[]>();
  });
});

describe("weavePath", () => {
  test("returns VFXPath", () => {
    expectTypeOf(weavePath([p0, p1])).toEqualTypeOf<VFXPath>();
    expectTypeOf(generateWeavePoints(p0, p1)).toEqualTypeOf<VFXPath.BasePathPoint[]>();
  });
});
