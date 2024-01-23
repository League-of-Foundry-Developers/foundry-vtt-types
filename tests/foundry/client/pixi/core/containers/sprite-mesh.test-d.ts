import { expectTypeOf } from "vitest";

const mySpriteMesh = new SpriteMesh();

expectTypeOf(mySpriteMesh.texture.baseTexture.resource).toEqualTypeOf<PIXI.Resource>();
