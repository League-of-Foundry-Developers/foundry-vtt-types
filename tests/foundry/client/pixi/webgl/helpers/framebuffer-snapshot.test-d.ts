import { expectTypeOf } from "vitest";

const myFBS = new FramebufferSnapshot();
declare const someRenderer: PIXI.Renderer;

expectTypeOf(myFBS.getFramebufferTexture(someRenderer)).toEqualTypeOf<PIXI.RenderTexture>();
