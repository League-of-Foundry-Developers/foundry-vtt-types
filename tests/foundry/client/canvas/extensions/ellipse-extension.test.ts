import { describe, expect, expectTypeOf, test } from "vitest";

import Canvas = foundry.canvas.Canvas;

describe("foundry/client/canvas/extensions/ellipse-extension", () => {
  test("extendPIXIEllipse", () => {
    expectTypeOf(foundry.canvas.extensions.extendPIXIEllipse).toEqualTypeOf<() => void>();
    expect(foundry.canvas.extensions.extendPIXIEllipse).toBeTypeOf("function");
  });

  test("PIXI.Ellipse", () => {
    expectTypeOf(PIXI.Ellipse.approximateVertexDensity(64, 32)).toEqualTypeOf<number>();
    expectTypeOf(PIXI.Ellipse.approximateVertexDensity(64, 32, 2)).toEqualTypeOf<number>();
    expect(PIXI.Ellipse.approximateVertexDensity(64, 32)).toBeTypeOf("number");

    const ellipse = new PIXI.Ellipse(100, 100, 50, 25);
    const square = new PIXI.Polygon([0, 0, 200, 0, 200, 200, 0, 200]);
    const clipperPoints = square.toClipperPoints();

    expectTypeOf(ellipse.center).toEqualTypeOf<PIXI.Point>();
    expect(ellipse.center).toBeInstanceOf(PIXI.Point);

    expectTypeOf(ellipse.pointIsOn({ x: 150, y: 100 })).toEqualTypeOf<boolean>();
    expectTypeOf(ellipse.pointIsOn({ x: 150, y: 100 }, 1e-6)).toEqualTypeOf<boolean>();
    expect(ellipse.pointIsOn({ x: 150, y: 100 })).toBe(true);

    expectTypeOf(ellipse.pointAtAngle(0)).toEqualTypeOf<Canvas.Point>();
    expectTypeOf(ellipse.pointsBetween({ x: 150, y: 100 }, { x: 100, y: 125 })).toEqualTypeOf<Canvas.Point[]>();
    expectTypeOf(ellipse.pointsForArc(0, Math.PI, { density: 16, includeEndpoints: false })).toEqualTypeOf<
      Canvas.Point[]
    >();
    expectTypeOf(ellipse.toPolygon({ density: 16 })).toEqualTypeOf<PIXI.Polygon>();
    expect(ellipse.toPolygon()).toBeInstanceOf(PIXI.Polygon);
    expect(new PIXI.Ellipse(0, 0, 0, 10).pointsForArc(0, Math.PI)).toEqual([]);

    expectTypeOf(
      ellipse.intersectPolygon(square, { density: 16, clipType: ClipperLib.ClipType.ctUnion }),
    ).toEqualTypeOf<PIXI.Polygon>();
    expectTypeOf(ellipse.intersectClipper(clipperPoints, { density: 16 })).toEqualTypeOf<PIXI.Polygon.ClipperPath[]>();
    expect(ellipse.intersectPolygon(square)).toBeInstanceOf(PIXI.Polygon);
    expect(Array.isArray(ellipse.intersectClipper(clipperPoints)[0])).toBe(true);
  });
});
