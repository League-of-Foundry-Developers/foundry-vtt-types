import { expectTypeOf } from "vitest";

import Quadtree = foundry.canvas.geometry.Quadtree;
import CanvasQuadtree = foundry.canvas.geometry.CanvasQuadtree;
import Edge = foundry.canvas.geometry.edges.Edge;
import Token = foundry.canvas.placeables.Token;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import Canvas = foundry.canvas.Canvas;
import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;

expectTypeOf(Quadtree.INDICES).toExtend<Record<keyof Quadtree.Indices, Quadtree.INDICES>>();

declare const someToken: Token.Implementation;
declare const someRect: PIXI.Rectangle;

const myQuadtree = new Quadtree<Token.Implementation>({ x: 200, y: 700, height: 1000, width: 800 });

expectTypeOf(myQuadtree["_bounds"]).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myQuadtree.maxObjects).toBeNumber();
expectTypeOf(myQuadtree.maxDepth).toBeNumber();
expectTypeOf(myQuadtree.depth).toBeNumber();
expectTypeOf(myQuadtree.objects).toEqualTypeOf<Quadtree.Object<Token.Implementation>[]>();
expectTypeOf(myQuadtree.nodes).toEqualTypeOf<Quadtree<Token.Implementation>[]>();
expectTypeOf(myQuadtree.root).toEqualTypeOf<Quadtree<Token.Implementation>>();

expectTypeOf(myQuadtree.bounds).toEqualTypeOf<PIXI.Rectangle>();
myQuadtree.bounds = someRect; // Setter

expectTypeOf(myQuadtree.width).toBeNumber;
myQuadtree.width = 500; // Setter

expectTypeOf(myQuadtree.height).toBeNumber;
myQuadtree.height = 500; // Setter

expectTypeOf(myQuadtree.x).toBeNumber;
myQuadtree.x = 500; // Setter

expectTypeOf(myQuadtree.y).toBeNumber;
myQuadtree.y = 500; // Setter

expectTypeOf(myQuadtree.all).toEqualTypeOf<Quadtree.Object<Token.Implementation>[]>();

expectTypeOf(myQuadtree.setPosition(0, 0)).toEqualTypeOf<Quadtree<Token.Implementation>>();
expectTypeOf(myQuadtree.setDimensions(1200, 400)).toEqualTypeOf<Quadtree<Token.Implementation>>();
expectTypeOf(myQuadtree.split()).toEqualTypeOf<Quadtree<Token.Implementation>>();
expectTypeOf(myQuadtree.clear()).toEqualTypeOf<Quadtree<Token.Implementation>>();
expectTypeOf(myQuadtree.visualize({ objects: true })).toEqualTypeOf<void>();

expectTypeOf(myQuadtree.insert({ r: someToken.bounds, t: someToken })).toEqualTypeOf<
  Quadtree<Token.Implementation>[]
>();
expectTypeOf(myQuadtree.remove(someToken)).toEqualTypeOf<typeof myQuadtree>();
expectTypeOf(myQuadtree.update({ r: someRect, t: someToken })).toEqualTypeOf<Quadtree<Token.Implementation>[]>();

function collisionTestFunction(o: Quadtree.Object<Token.Implementation>, rect: Canvas.Rectangle) {
  if (o.t.isTargeted && rect.width > 500) return true;
  return false;
}

expectTypeOf(myQuadtree.getObjects(someRect)).toEqualTypeOf<Set<Token.Implementation>>();
expectTypeOf(myQuadtree.getObjects(someToken.bounds, { collisionTest: collisionTestFunction })).toEqualTypeOf<
  Set<Token.Implementation>
>();
expectTypeOf(myQuadtree.getObjects(someRect, { collisionTest: undefined })).toEqualTypeOf<Set<Token.Implementation>>();

expectTypeOf(myQuadtree.getLeafNodes(someRect)).toEqualTypeOf<Quadtree<Token.Implementation>[]>();
expectTypeOf(myQuadtree.getChildNodes(someRect)).toEqualTypeOf<Quadtree<Token.Implementation>[]>();
expectTypeOf(myQuadtree.getAdjacentNodes()).toEqualTypeOf<Quadtree<Token.Implementation>[]>();

expectTypeOf(myQuadtree.visualize()).toBeVoid();
expectTypeOf(myQuadtree.visualize({ objects: true })).toBeVoid();
expectTypeOf(myQuadtree.visualize({ objects: undefined })).toBeVoid();

// @ts-expect-error CanvasQuadtree has been limited to the types foundry has been known to pass
new CanvasQuadtree<foundry.canvas.sources.PointDarknessSource>();
new CanvasQuadtree<PrimarySpriteMesh>();
new CanvasQuadtree<Edge>();
new CanvasQuadtree<PlaceableObject.Any>();
const myCanvasQuadtree = new CanvasQuadtree<Token.Implementation>();

expectTypeOf(myCanvasQuadtree["_bounds"]).toEqualTypeOf<PIXI.Rectangle>();
