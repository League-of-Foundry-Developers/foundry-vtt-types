import { expectTypeOf } from "vitest";

expectTypeOf(PrimaryCanvasGroup.groupName).toEqualTypeOf<string>();

const myMesh = new SpriteMesh();

const myPrimaryGroup = new PrimaryCanvasGroup(myMesh);

expectTypeOf(myPrimaryGroup.layers).toEqualTypeOf<Record<string, CanvasLayer>>();
