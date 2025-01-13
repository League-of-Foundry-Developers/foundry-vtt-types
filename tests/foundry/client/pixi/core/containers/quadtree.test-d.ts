import { expectTypeOf } from "vitest";

const myCanvasQuadTree = new CanvasQuadtree();

declare const myToken: Token.ConfiguredInstance;
declare const collisionTest: (o: QuadtreeObject<object>, rect: Canvas.Rectangle) => boolean;

expectTypeOf(myCanvasQuadTree.getObjects(myToken.bounds, { collisionTest })).toEqualTypeOf<Set<object>>();
expectTypeOf(myCanvasQuadTree.getAdjacentNodes()).toEqualTypeOf<Quadtree<object>[]>();
expectTypeOf(CanvasQuadtree.INDICES).toMatchTypeOf<Record<string, number & Quadtree.INDICES>>();
