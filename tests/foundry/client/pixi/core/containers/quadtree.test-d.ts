import { expectTypeOf } from "vitest";

const myQuadTree = new CanvasQuadtree();

let myTokenDocument: any;

const myToken = new Token(myTokenDocument);

expectTypeOf(myQuadTree.getObjects(myToken.bounds));
