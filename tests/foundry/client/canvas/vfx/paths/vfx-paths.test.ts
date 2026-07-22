import { describe, expectTypeOf, test } from "vitest";
import type arcPath from "#client/canvas/vfx/paths/vfx-arc-path.mjs";
import type { generateArcPoints } from "#client/canvas/vfx/paths/vfx-arc-path.mjs";
import type weavePath from "#client/canvas/vfx/paths/vfx-weave-path.mjs";
import type { generateWeavePoints } from "#client/canvas/vfx/paths/vfx-weave-path.mjs";

import VFXPath = foundry.canvas.vfx.VFXPath;

describe("arcPath", () => {
  test("returns VFXPath", () => {
    expectTypeOf<ReturnType<typeof arcPath>>().toEqualTypeOf<VFXPath>();
    expectTypeOf<ReturnType<typeof generateArcPoints>>().toEqualTypeOf<VFXPath.BasePathPoint[]>();
  });
});

describe("weavePath", () => {
  test("returns VFXPath", () => {
    expectTypeOf<ReturnType<typeof weavePath>>().toEqualTypeOf<VFXPath>();
    expectTypeOf<ReturnType<typeof generateWeavePoints>>().toEqualTypeOf<VFXPath.BasePathPoint[]>();
  });
});
