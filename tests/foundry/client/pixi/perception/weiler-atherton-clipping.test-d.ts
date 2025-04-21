import { expectTypeOf } from "vitest";

expectTypeOf(WeilerAthertonClipper.CLIP_TYPES).toExtend<
  Record<keyof WeilerAthertonClipper.ClipTypes, WeilerAthertonClipper.CLIP_TYPES>
>();
expectTypeOf(WeilerAthertonClipper.INTERSECTION_TYPES).toExtend<
  Record<keyof WeilerAthertonClipper.IntersectionTypes, WeilerAthertonClipper.INTERSECTION_TYPES>
>();

declare const someRect: PIXI.Rectangle;
declare const someCircle: PIXI.Circle;
declare const somePolygon: PIXI.Polygon;

expectTypeOf(
  WeilerAthertonClipper.union(somePolygon, someRect, {
    density: 5,
    includeEndpoints: false,
  }),
).toEqualTypeOf<Array<PIXI.Polygon>>();

expectTypeOf(
  WeilerAthertonClipper.intersect(somePolygon, someCircle, {
    density: 2,
    includeEndpoints: null,
  }),
).toEqualTypeOf<Array<PIXI.Polygon>>();

expectTypeOf(
  WeilerAthertonClipper.combine(somePolygon, someRect, {
    clipType: WeilerAthertonClipper.CLIP_TYPES.UNION,
    canMutate: false,
    density: undefined,
  }),
).toEqualTypeOf<Array<PIXI.Polygon>>();

expectTypeOf(
  WeilerAthertonClipper.testForEnvelopment(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
    density: null,
    includeEndpoints: undefined,
  }),
).toEqualTypeOf<Array<PIXI.Polygon>>();

const myWAC = new WeilerAthertonClipper(somePolygon, someCircle, WeilerAthertonClipper.CLIP_TYPES.INTERSECT, {
  density: 3,
  includeEndpoints: true,
});

expectTypeOf(myWAC.clipObject).toEqualTypeOf<PIXI.Rectangle | PIXI.Circle>();
expectTypeOf(myWAC.config.clipType).toExtend<WeilerAthertonClipper.CLIP_TYPES>();
if (myWAC.config.clipOpts.includeEndpoints) {
  expectTypeOf(myWAC.config.clipOpts.includeEndpoints).toEqualTypeOf<true>();
} else {
  expectTypeOf(myWAC.config.clipOpts.includeEndpoints).toEqualTypeOf<false | null | undefined>();
}
