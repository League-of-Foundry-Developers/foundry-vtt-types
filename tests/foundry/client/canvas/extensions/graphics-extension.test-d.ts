import { expectTypeOf } from "vitest";

declare const somePoly: PIXI.Polygon;

const defaultGraphics = new PIXI.Graphics();
const pointsFlat = [10, 10, 20, 10, 20, 20, 10, 20];
const points = [
  { x: 10, y: 10 },
  { x: 20, y: 10 },
  { x: 20, y: 20 },
  { x: 10, y: 20 },
];

expectTypeOf(defaultGraphics.drawPath(...points)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawPath(...pointsFlat)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawPath(somePoly)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawPath(somePoly, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawPath(points, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawPath(pointsFlat, 2)).toEqualTypeOf<typeof defaultGraphics>();

expectTypeOf(defaultGraphics.drawSmoothedPath(...points)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(...pointsFlat)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(points)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(somePoly, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(points, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(pointsFlat, 2)).toEqualTypeOf<typeof defaultGraphics>();

expectTypeOf(defaultGraphics.drawSmoothedPolygon(...points)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPolygon(...pointsFlat)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPolygon(pointsFlat)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPolygon(somePoly, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPolygon(points, 2)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPolygon(pointsFlat, 2)).toEqualTypeOf<typeof defaultGraphics>();

const legacyGraphics = new PIXI.LegacyGraphics();

expectTypeOf(legacyGraphics.drawPath(...points)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawPath(...pointsFlat)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawPath(somePoly)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawPath(somePoly, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawPath(points, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawPath(pointsFlat, 2)).toEqualTypeOf<typeof legacyGraphics>();

expectTypeOf(legacyGraphics.drawSmoothedPath(...points)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath(...pointsFlat)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath(points)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath(somePoly, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath(points, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath(pointsFlat, 2)).toEqualTypeOf<typeof legacyGraphics>();

expectTypeOf(legacyGraphics.drawSmoothedPolygon(...points)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPolygon(...pointsFlat)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPolygon(pointsFlat)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPolygon(somePoly, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPolygon(points, 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPolygon(pointsFlat, 2)).toEqualTypeOf<typeof legacyGraphics>();

const smoothGraphics = new PIXI.smooth.SmoothGraphics();

expectTypeOf(smoothGraphics.drawPath(...points)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawPath(...pointsFlat)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawPath(somePoly)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawPath(somePoly, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawPath(points, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawPath(pointsFlat, 2)).toEqualTypeOf<typeof smoothGraphics>();

expectTypeOf(smoothGraphics.drawSmoothedPath(...points)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(...pointsFlat)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(points)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(somePoly, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(points, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(pointsFlat, 2)).toEqualTypeOf<typeof smoothGraphics>();

expectTypeOf(smoothGraphics.drawSmoothedPolygon(...points)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(...pointsFlat)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(pointsFlat)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(somePoly, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(points, 2)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(pointsFlat, 2)).toEqualTypeOf<typeof smoothGraphics>();
