import { expectTypeOf } from "vitest";

const myQuadTree = new CanvasQuadtree();

let myTokenDocument: any;

const myToken = new Token(myTokenDocument);

// TODO: I'm unclear on the end result typing here tbh
expectTypeOf(myQuadTree.getObjects(myToken.bounds)).toEqualTypeOf<Set<unknown>>();
