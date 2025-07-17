import { describe, expectTypeOf, test } from "vitest";

import CachedContainer = foundry.canvas.containers.CachedContainer;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

declare const renderer: PIXI.Renderer;
declare const renderTexture: PIXI.RenderTexture;
declare const sprite: PIXI.Sprite;
declare const spriteMesh: foundry.canvas.containers.SpriteMesh;

describe("CachedContainer Tests", () => {
  test("Construction", () => {
    new CachedContainer(spriteMesh);
    new CachedContainer(sprite);
  });

  const container = new CachedContainer(sprite);

  test("Uncategorized", () => {
    expectTypeOf(CachedContainer.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();
    expectTypeOf(CachedContainer.resizeRenderTexture(renderer, renderTexture)).toBeVoid();

    expectTypeOf(container["_renderPaths"]).toEqualTypeOf<Map<PIXI.RenderTexture, CachedContainer.RenderOptions>>();

    expectTypeOf(container.clearColor).toEqualTypeOf<[number, number, number, number]>();
    expectTypeOf(container.displayed).toEqualTypeOf<boolean>();
    expectTypeOf(container.autoRender).toEqualTypeOf<boolean>();
    expectTypeOf(container.renderDirty).toEqualTypeOf<boolean>();
    expectTypeOf(container.renderTexture).toEqualTypeOf<PIXI.RenderTexture>();

    expectTypeOf(container.alphaMode).toBeUndefined();
    container.alphaMode = PIXI.ALPHA_MODES.PREMULTIPLY_ON_UPLOAD; // Setter only, no getter

    expectTypeOf(container.sprite).toEqualTypeOf<PIXI.Sprite | SpriteMesh | undefined>();
    container.sprite = Math.random() > 0.5 ? sprite : spriteMesh; // Setter

    expectTypeOf(container.createRenderTexture()).toEqualTypeOf<PIXI.RenderTexture>();
    expectTypeOf(
      container.createRenderTexture({
        renderFunction: (renderer: PIXI.Renderer) => {
          renderer.clear();
        },
        clearColor: [0.234, 0.6, 0.35, 0.8],
      }),
    ).toEqualTypeOf<PIXI.RenderTexture>();
    expectTypeOf(
      container.createRenderTexture({ clearColor: undefined, renderFunction: undefined }),
    ).toEqualTypeOf<PIXI.RenderTexture>();

    expectTypeOf(container.removeRenderTexture(renderTexture)).toBeVoid();
    expectTypeOf(container.removeRenderTexture(renderTexture, false)).toBeVoid();

    expectTypeOf(container.clear()).toEqualTypeOf<typeof container>();
    expectTypeOf(container.clear(false)).toEqualTypeOf<typeof container>();

    expectTypeOf(container.destroy()).toEqualTypeOf<void>();
    expectTypeOf(
      container.destroy({
        children: false,
        texture: false,
        baseTexture: false,
      }),
    ).toEqualTypeOf<void>();

    expectTypeOf(container.render(renderer)).toEqualTypeOf<void>();
  });
});
