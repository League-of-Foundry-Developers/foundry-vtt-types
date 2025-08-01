import { describe, expectTypeOf, test } from "vitest";

import PrimaryCanvasGroup = foundry.canvas.groups.PrimaryCanvasGroup;

import CanvasGroupMixin = foundry.canvas.groups.CanvasGroupMixin;
import PrimaryCanvasGroupAmbienceFilter = foundry.canvas.rendering.filters.PrimaryCanvasGroupAmbienceFilter;
import PrimaryGraphics = foundry.canvas.primary.PrimaryGraphics;
import PrimarySpriteMesh = foundry.canvas.primary.PrimarySpriteMesh;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import CachedContainer = foundry.canvas.containers.CachedContainer;
import layers = foundry.canvas.layers;

import Drawing = foundry.canvas.placeables.Drawing;
import Tile = foundry.canvas.placeables.Tile;
import Token = foundry.canvas.placeables.Token;

declare const spriteMesh: SpriteMesh;
declare const token: Token.Implementation;
declare const tile: Tile.Implementation;
declare const drawing: Drawing.Implementation;
declare const pixiPoint: PIXI.Point;
declare const renderer: PIXI.Renderer;

describe("PrimaryCanvasGroup Tests", () => {
  test("Construction", () => {
    new PrimaryCanvasGroup();
    new CONFIG.Canvas.groups.primary.groupClass();
    // Foundry will never call this with any arguments, the SpriteMesh has a default that always gets used
    new PrimaryCanvasGroup(spriteMesh);
    new CONFIG.Canvas.groups.primary.groupClass(spriteMesh);
  });

  test("Group name", () => {
    expectTypeOf(PrimaryCanvasGroup.groupName).toEqualTypeOf<"primary">();
  });

  const myPrimaryGroup = new CONFIG.Canvas.groups.primary.groupClass();

  test("Uncategorized", () => {
    expectTypeOf(PrimaryCanvasGroup.tearDownChildren).toEqualTypeOf<boolean>();

    expectTypeOf(myPrimaryGroup.eventMode).toEqualTypeOf<PIXI.EventMode>();

    expectTypeOf(PrimaryCanvasGroup.SORT_LAYERS).toExtend<
      Record<keyof PrimaryCanvasGroup.Sort_Layers, PrimaryCanvasGroup.SORT_LAYERS>
    >();
    expectTypeOf(PrimaryCanvasGroup.textureConfiguration).toEqualTypeOf<CachedContainer.TextureConfiguration>();

    expectTypeOf(myPrimaryGroup.clearColor).toEqualTypeOf<Color.RGBAColorVector>();
    expectTypeOf(myPrimaryGroup["_backgroundColor"]).toEqualTypeOf<Color.RGBColorVector | undefined>();
    expectTypeOf(myPrimaryGroup.videoMeshes).toEqualTypeOf<Set<PrimarySpriteMesh.Any>>();
    expectTypeOf(myPrimaryGroup.hoverFadeElevation).toBeNumber();

    expectTypeOf(PrimaryCanvasGroup.BACKGROUND_ELEVATION).toEqualTypeOf<number>();

    expectTypeOf(myPrimaryGroup["_ambienceFilter"]).toEqualTypeOf<PrimaryCanvasGroupAmbienceFilter | undefined>();
    expectTypeOf(myPrimaryGroup.backgroundSource).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | null>();
    expectTypeOf(myPrimaryGroup.foregroundSource).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | null>();

    expectTypeOf(myPrimaryGroup.refreshPrimarySpriteMesh()).toBeVoid();
    expectTypeOf(myPrimaryGroup.update()).toBeVoid();

    expectTypeOf(myPrimaryGroup["_draw"]({})).toEqualTypeOf<Promise<void>>();
    expectTypeOf(myPrimaryGroup["_render"](renderer)).toBeVoid();
    expectTypeOf(myPrimaryGroup["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

    expectTypeOf(myPrimaryGroup.sortChildren()).toBeVoid();
    expectTypeOf(PrimaryCanvasGroup["_compareObjects"](token, token)).toBeNumber();

    expectTypeOf(myPrimaryGroup["_onMouseMove"](pixiPoint, true)).toBeVoid();
  });

  test("Placeables", () => {
    expectTypeOf(myPrimaryGroup.drawings).toEqualTypeOf<Collection<PrimaryGraphics>>();
    expectTypeOf(myPrimaryGroup.tokens).toEqualTypeOf<Collection<PrimarySpriteMesh>>();
    expectTypeOf(myPrimaryGroup.tiles).toEqualTypeOf<Collection<PrimarySpriteMesh>>();

    expectTypeOf(myPrimaryGroup.addToken(token)).toEqualTypeOf<PrimarySpriteMesh>();
    expectTypeOf(myPrimaryGroup.removeToken(token)).toBeVoid();

    expectTypeOf(myPrimaryGroup.addTile(tile)).toEqualTypeOf<PrimarySpriteMesh>();
    expectTypeOf(myPrimaryGroup.removeTile(tile)).toBeVoid();

    expectTypeOf(myPrimaryGroup.addDrawing(drawing)).toEqualTypeOf<PrimaryGraphics>();
    expectTypeOf(myPrimaryGroup.removeDrawing(drawing)).toBeVoid();
  });

  test("Child groups", () => {
    // Core provides no groups that have this as parent
    // TODO: once group dynamic properties are typed, add and test a fake group with this as parent
  });

  test("Layers", () => {
    expectTypeOf(myPrimaryGroup.layers).toEqualTypeOf<CanvasGroupMixin.LayersFor<"primary">>();
    expectTypeOf(myPrimaryGroup.weather).toEqualTypeOf<layers.WeatherEffects>();
  });

  test("Hooks", () => {
    Hooks.on("drawPrimaryCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<PrimaryCanvasGroup.Implementation>();
    });

    Hooks.on("tearDownPrimaryCanvasGroup", (group) => {
      expectTypeOf(group).toEqualTypeOf<PrimaryCanvasGroup.Implementation>();
    });
  });

  test("Deprecated", () => {
    // deprecated since v12, until v14
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myPrimaryGroup.mapElevationToDepth(20)).toEqualTypeOf<number>();
  });
});
