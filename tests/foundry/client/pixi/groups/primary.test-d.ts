import { expectTypeOf } from "vitest";

expectTypeOf(PrimaryCanvasGroup.groupName).toMatchTypeOf<keyof CONFIG.Canvas.Groups>();
//TODO: uncomment the following when we have a fix for losing mixin static properties
//expectTypeOf(PrimaryCanvasGroup.tearDownChildren).toEqualTypeOf<boolean>();
const myMesh = new SpriteMesh();

const myPrimaryGroup = new PrimaryCanvasGroup(myMesh);
expectTypeOf(myPrimaryGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();
