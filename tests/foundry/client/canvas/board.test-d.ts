import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import DrawingsLayer = foundry.canvas.layers.DrawingsLayer;
import EnvironmentCanvasGroup = foundry.canvas.groups.EnvironmentCanvasGroup;
import HiddenCanvasGroup = foundry.canvas.groups.HiddenCanvasGroup;
import LightingLayer = foundry.canvas.layers.LightingLayer;
import NotesLayer = foundry.canvas.layers.NotesLayer;
import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import TilesLayer = foundry.canvas.layers.TilesLayer;
import TokenLayer = foundry.canvas.layers.TokenLayer;
import SoundsLayer = foundry.canvas.layers.SoundsLayer;
import RenderedCanvasGroup = foundry.canvas.groups.RenderedCanvasGroup;
import WallsLayer = foundry.canvas.layers.WallsLayer;

const myCanvas = new Canvas();
declare const someScene: Scene.Implementation;
expectTypeOf(myCanvas.draw(someScene)).toEqualTypeOf<Promise<Canvas>>();

expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientLight")).toEqualTypeOf<LightingLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientSound")).toEqualTypeOf<SoundsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Drawing")).toEqualTypeOf<DrawingsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Note")).toEqualTypeOf<NotesLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("MeasuredTemplate")).toEqualTypeOf<TemplateLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Tile")).toEqualTypeOf<TilesLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Token")).toEqualTypeOf<TokenLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Wall")).toEqualTypeOf<WallsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("any-string")).toEqualTypeOf<null>();

expectTypeOf(myCanvas.animatePan({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, easing: (pt: number) => pt }),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.animatePan({ x: 500, y: 500, scale: 10, speed: 6, easing: "easeInCircle" })).toEqualTypeOf<
  Promise<boolean | void>
>();

expectTypeOf(myCanvas.recenter()).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({ x: null, y: null, scale: null })).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({ x: 100, y: 100, scale: 1 })).toEqualTypeOf<Promise<boolean | void>>();

myCanvas.pendingRenderFlags.OBJECTS.add(myCanvas.perception);

expectTypeOf(myCanvas.hidden).toEqualTypeOf<HiddenCanvasGroup | undefined>();
expectTypeOf(myCanvas.rendered).toEqualTypeOf<RenderedCanvasGroup>();
expectTypeOf(myCanvas.environment).toEqualTypeOf<EnvironmentCanvasGroup>();
