import { expectTypeOf } from "vitest";

const { FramebufferSnapshot } = foundry.canvas;

const myFS = new FramebufferSnapshot();
declare const someRenderer: PIXI.Renderer;

expectTypeOf(myFS.framebufferTexture).toEqualTypeOf<PIXI.RenderTexture>();
expectTypeOf(myFS.getFramebufferTexture(someRenderer)).toEqualTypeOf<PIXI.RenderTexture>();
