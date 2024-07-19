import { BaseRenderTexture, CLEAR_MODES, FilterState, FilterSystem, RenderTexture, Renderer } from "pixi.js";
import { expectTypeOf } from "vitest";

const f = new foundry.canvas.SMAAFilter();
const r = new Renderer();
const b = new BaseRenderTexture();

expectTypeOf(
  f.apply(new FilterSystem(r), new RenderTexture(b), new RenderTexture(b), CLEAR_MODES.AUTO, new FilterState()),
).toMatchTypeOf<void>();
