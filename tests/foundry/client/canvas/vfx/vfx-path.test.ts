import { describe, expectTypeOf, test } from "vitest";

import VFXPath = foundry.canvas.vfx.VFXPath;

const point: VFXPath.BasePathPoint = { x: 0, y: 0, elevation: 0 };
const pointFull: VFXPath.BasePathPoint = {
  x: 0,
  y: 0,
  elevation: 0,
  rotation: 0,
  sort: 0,
  sortLayer: foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.TOKENS,
};

describe("VFXPath", () => {
  test("construction requires at least 2 points", () => {
    const path = new VFXPath([point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path).toBeObject();
  });

  test("pathPoints returns PathPoint array", () => {
    const path = new VFXPath([point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path.pathPoints).toEqualTypeOf<VFXPath.PathPoint[]>();
  });

  test("pathLength is a number", () => {
    const path = new VFXPath([point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path.pathLength).toEqualTypeOf<number>();
  });

  test("interpolatedPoint returns PathPoint", () => {
    const path = new VFXPath([point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path.interpolatedPoint(0.5)).toEqualTypeOf<VFXPath.PathPoint>();
    expectTypeOf(path.interpolatedPoint(0.5, 0)).toEqualTypeOf<VFXPath.PathPoint>();
  });

  test("interpolatedPointAtDistance returns PathPoint", () => {
    const path = new VFXPath([point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path.interpolatedPointAtDistance(50)).toEqualTypeOf<VFXPath.PathPoint>();
  });

  test("static getPathGenerator returns Generator function", () => {
    expectTypeOf(VFXPath.getPathGenerator("linear")).toEqualTypeOf<VFXPath.Generator>();
  });

  test("static create returns VFXPath", () => {
    const path = VFXPath.create("linear", [point, { x: 100, y: 100, elevation: 0 }]);
    expectTypeOf(path).toEqualTypeOf<VFXPath>();
  });

  test("PathPoint has required properties", () => {
    const pp: VFXPath.PathPoint = {
      x: 0,
      y: 0,
      rotation: 0,
      distance: 0,
      index: 0,
      elevation: 0,
      sort: 0,
      sortLayer: foundry.canvas.groups.PrimaryCanvasGroup.SORT_LAYERS.TOKENS,
    };
    expectTypeOf(pp.x).toEqualTypeOf<number>();
    expectTypeOf(pp.rotation).toEqualTypeOf<number>();
    expectTypeOf(pp.sortLayer).toEqualTypeOf<number | undefined>();
    expectTypeOf(pointFull.sortLayer).toEqualTypeOf<number | undefined>();
  });

  test("Generator type is callable", () => {
    const gen: VFXPath.Generator = (points, _params) => new VFXPath(points);
    expectTypeOf(gen).toBeFunction();
  });
});
