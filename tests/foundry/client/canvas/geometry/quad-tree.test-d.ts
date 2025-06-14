import { expectTypeOf } from "vitest";
import { Quadtree, CanvasQuadtree } from "#client/canvas/geometry/_module.mjs";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

expectTypeOf(Quadtree.INDICES).toExtend<Record<keyof Quadtree.Indices, Quadtree.INDICES>>();

type TCI = Token.Implementation;
declare const someToken: TCI;
declare const someRect: PIXI.Rectangle;
declare const collisionTest: (o: Quadtree.Object<TCI>, rect: Canvas.Rectangle) => boolean;

const myQuadtree = new Quadtree<TCI>({ x: undefined, y: null, height: 100, width: 100 });

expectTypeOf(myQuadtree.all).toEqualTypeOf<Quadtree.Object<TCI>[]>();
expectTypeOf(myQuadtree.objects).toEqualTypeOf<Quadtree.Object<TCI>[]>();
expectTypeOf(myQuadtree.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myQuadtree.root).toEqualTypeOf<Quadtree<TCI>>();
expectTypeOf(myQuadtree.split()).toEqualTypeOf<Quadtree<TCI>>();
expectTypeOf(myQuadtree.visualize({ objects: true })).toEqualTypeOf<void>();

expectTypeOf(myQuadtree.insert({ r: someToken.bounds, t: someToken })).toEqualTypeOf<Quadtree<TCI>[]>();
expectTypeOf(myQuadtree.update({ r: someRect, t: someToken })).toEqualTypeOf<Quadtree<TCI>[]>();
expectTypeOf(myQuadtree.remove(someToken)).toEqualTypeOf<typeof myQuadtree>();

expectTypeOf(myQuadtree.getObjects(someToken.bounds, { collisionTest })).toEqualTypeOf<Set<TCI>>();
expectTypeOf(myQuadtree.getLeafNodes(someRect)).toEqualTypeOf<Quadtree<TCI>[]>();
expectTypeOf(myQuadtree.getChildNodes(someRect)).toEqualTypeOf<Quadtree<TCI>[]>();
expectTypeOf(myQuadtree.getAdjacentNodes()).toEqualTypeOf<Quadtree<TCI>[]>();

const myCanvasQuadtree = new CanvasQuadtree<TCI>();

expectTypeOf(myCanvasQuadtree.bounds).toEqualTypeOf<PIXI.Rectangle>();
