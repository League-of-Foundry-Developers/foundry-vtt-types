import { describe, expect, expectTypeOf, test } from "vitest";

import VFXPath = foundry.canvas.vfx.VFXPath;

const point: VFXPath.Position = { x: 0, y: 0, elevation: 0 };
const pointFull: VFXPath.Position = {
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
      control: 0,
    };
    expectTypeOf(pp.x).toEqualTypeOf<number>();
    expectTypeOf(pp.control).toEqualTypeOf<number>();
    expectTypeOf(pp.scale).toEqualTypeOf<foundry.canvas.Canvas.Point | undefined>();
    expectTypeOf(pp.rotation).toEqualTypeOf<number>();
    expectTypeOf(pp.sortLayer).toEqualTypeOf<number | undefined>();
    expectTypeOf(pointFull.sortLayer).toEqualTypeOf<number | undefined>();
  });

  test("construction accepts path options and positions without elevation", () => {
    const path = new VFXPath(
      [
        { x: 0, y: 0 },
        { x: 100, y: 100, scale: { x: 2, y: 2 } },
      ],
      {
        step: 0.5,
        stepElevation: true,
      },
    );
    expect(path.pathPoints.map((p) => p.control)).toEqual([0, 1]);
    expect(path.pathPoints[1]!.scale).toEqual({ x: 2, y: 2 });

    const controlled = new VFXPath(
      [
        { x: 0, y: 0, control: 0 },
        { x: 50, y: 50, control: 0.5 },
        { x: 100, y: 100, control: 1 },
      ] satisfies VFXPath.ControlledPosition[],
      { controlPoints: [point, { x: 100, y: 100, elevation: 10 }] },
    );
    expect(controlled.pathPoints[1]!.elevation).toBe(5);

    // Generated points without `controlPoints` are read as plain positions; their `control` is ignored.
    const generated: VFXPath.ControlledPosition[] = [
      { x: 0, y: 0, control: 0 },
      { x: 100, y: 100, control: 0.25 },
    ];
    expect(new VFXPath(generated).pathPoints.map((p) => p.control)).toEqual([0, 1]);

    // @ts-expect-error `controlPoints` requires points that carry their `control`
    void (() => new VFXPath([point, point], { controlPoints: [point, point] }));
    // @ts-expect-error `step` must be a number
    void (() => new VFXPath([point, point], { step: "half" }));
  });

  test("Generator type is callable", () => {
    const gen: VFXPath.Generator = (points, _params) => new VFXPath(points);
    expectTypeOf(gen).toBeFunction();
  });
});
