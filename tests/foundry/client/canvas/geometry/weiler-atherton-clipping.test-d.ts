import { expectTypeOf } from "vitest";

import WeilerAthertonClipper = foundry.canvas.geometry.WeilerAthertonClipper;

expectTypeOf(WeilerAthertonClipper.CLIP_TYPES).toExtend<
  Record<keyof WeilerAthertonClipper.ClipTypes, WeilerAthertonClipper.CLIP_TYPES>
>();
expectTypeOf(WeilerAthertonClipper.INTERSECTION_TYPES).toExtend<
  Record<keyof WeilerAthertonClipper.IntersectionTypes, WeilerAthertonClipper.INTERSECTION_TYPES>
>();

declare const someRect: PIXI.Rectangle;
declare const someCircle: PIXI.Circle;
declare const somePolygon: PIXI.Polygon;

expectTypeOf(WeilerAthertonClipper.union(somePolygon, someRect)).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.union(somePolygon, someRect, {
    density: 5,
    includeEndpoints: false,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.union(somePolygon, someRect, {
    density: undefined,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();

expectTypeOf(WeilerAthertonClipper.intersect(somePolygon, someCircle)).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.intersect(somePolygon, someCircle, {
    density: 2,
    includeEndpoints: true,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.intersect(somePolygon, someCircle, {
    density: undefined,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();

// @ts-expect-error combine requires passing a clipType in options
WeilerAthertonClipper.combine(somePolygon, someRect);
expectTypeOf(
  WeilerAthertonClipper.combine(somePolygon, someRect, {
    clipType: WeilerAthertonClipper.CLIP_TYPES.UNION,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.combine(somePolygon, someRect, {
    clipType: WeilerAthertonClipper.CLIP_TYPES.INTERSECT,
    canMutate: false,
    density: 7,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.combine(somePolygon, someRect, {
    clipType: WeilerAthertonClipper.CLIP_TYPES.UNION,
    canMutate: undefined,
    density: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();

expectTypeOf(
  WeilerAthertonClipper.testForEnvelopment(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.UNION),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.testForEnvelopment(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
    density: 7,
    includeEndpoints: true,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();
expectTypeOf(
  WeilerAthertonClipper.testForEnvelopment(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
    density: undefined,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<PIXI.Polygon[]>();

new WeilerAthertonClipper(somePolygon, someRect);
new WeilerAthertonClipper(somePolygon, someRect, WeilerAthertonClipper.CLIP_TYPES.UNION);
new WeilerAthertonClipper(somePolygon, someRect, WeilerAthertonClipper.CLIP_TYPES.UNION, {
  density: undefined,
  includeEndpoints: undefined,
});
const myWAC = new WeilerAthertonClipper(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
  density: 3,
  includeEndpoints: true,
});

expectTypeOf(myWAC.polygon).toEqualTypeOf<PIXI.Polygon>();
expectTypeOf(myWAC.clipObject).toEqualTypeOf<WeilerAthertonClipper.ClipObject>();
expectTypeOf(myWAC.config.clipType).toExtend<WeilerAthertonClipper.CLIP_TYPES>();
expectTypeOf(myWAC.config.clipOpts.includeEndpoints).toEqualTypeOf<boolean | undefined>();
