import { expectTypeOf } from "vitest";

declare const somePoly: PIXI.Polygon;

const defaultGraphics = new PIXI.Graphics();

expectTypeOf(defaultGraphics.drawPath(somePoly)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(defaultGraphics.drawSmoothedPath(1, 2, 3, 4, 5, 6)).toEqualTypeOf<typeof defaultGraphics>();
expectTypeOf(
  defaultGraphics.drawSmoothedPolygon([
    { x: 50, y: 50 },
    { x: 100, y: 100 },
  ]),
).toEqualTypeOf<typeof defaultGraphics>();

const legacyGraphics = new PIXI.LegacyGraphics();

expectTypeOf(legacyGraphics.drawPath(somePoly)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(legacyGraphics.drawSmoothedPath([1, 2, 3, 4, 5, 6], 2)).toEqualTypeOf<typeof legacyGraphics>();
expectTypeOf(
  legacyGraphics.drawSmoothedPolygon([
    { x: 50, y: 50 },
    { x: 100, y: 100 },
  ]),
).toEqualTypeOf<typeof legacyGraphics>();

const smoothGraphics = new PIXI.smooth.SmoothGraphics();

expectTypeOf(smoothGraphics.drawPath({ x: 50, y: 50 }, { x: 100, y: 100 })).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPath(1, 2, 3, 4, 5, 6)).toEqualTypeOf<typeof smoothGraphics>();
expectTypeOf(smoothGraphics.drawSmoothedPolygon(somePoly)).toEqualTypeOf<typeof smoothGraphics>();
