import { expectTypeOf, test } from "vitest";

declare const someRenderer: PIXI.Renderer;

test("foundry/client/canvas/framebuffer-snapshot", () => {
  const { FramebufferSnapshot } = foundry.canvas;

  const myFS = new FramebufferSnapshot();

  expectTypeOf(myFS.framebufferTexture).toEqualTypeOf<PIXI.RenderTexture>();
  expectTypeOf(myFS.getFramebufferTexture(someRenderer)).toEqualTypeOf<PIXI.RenderTexture>();
});
