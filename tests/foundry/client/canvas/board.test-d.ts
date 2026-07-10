import { expectTypeOf } from "vitest";

import Canvas = foundry.canvas.Canvas;
import DrawingsLayer = foundry.canvas.layers.DrawingsLayer;
import EnvironmentCanvasGroup = foundry.canvas.groups.EnvironmentCanvasGroup;
import HiddenCanvasGroup = foundry.canvas.groups.HiddenCanvasGroup;
import LightingLayer = foundry.canvas.layers.LightingLayer;
import NotesLayer = foundry.canvas.layers.NotesLayer;
import RegionLayer = foundry.canvas.layers.RegionLayer;
import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import TilesLayer = foundry.canvas.layers.TilesLayer;
import TokenLayer = foundry.canvas.layers.TokenLayer;
import SoundsLayer = foundry.canvas.layers.SoundsLayer;
import RenderedCanvasGroup = foundry.canvas.groups.RenderedCanvasGroup;
import WallsLayer = foundry.canvas.layers.WallsLayer;

const myCanvas = new Canvas();
declare const someScene: Scene.Implementation;
expectTypeOf(myCanvas.draw(someScene)).toEqualTypeOf<Promise<Canvas>>();

expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientLight")).toEqualTypeOf<LightingLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientSound")).toEqualTypeOf<SoundsLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Drawing")).toEqualTypeOf<DrawingsLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Note")).toEqualTypeOf<NotesLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("MeasuredTemplate")).toEqualTypeOf<TemplateLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Region")).toEqualTypeOf<RegionLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Tile")).toEqualTypeOf<TilesLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Token")).toEqualTypeOf<TokenLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Wall")).toEqualTypeOf<WallsLayer.Implementation | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("any-string")).toEqualTypeOf<null>();

expectTypeOf(myCanvas.getCollectionLayer("lights")).toEqualTypeOf<LightingLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("sounds")).toEqualTypeOf<SoundsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("drawings")).toEqualTypeOf<DrawingsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("notes")).toEqualTypeOf<NotesLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("regions")).toEqualTypeOf<RegionLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("templates")).toEqualTypeOf<TemplateLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("tiles")).toEqualTypeOf<TilesLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("tokens")).toEqualTypeOf<TokenLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("walls")).toEqualTypeOf<WallsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.getCollectionLayer("any-string")).toEqualTypeOf<undefined>();

expectTypeOf(myCanvas.animatePan({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(
  myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, easing: (pt: number) => pt }),
).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.animatePan({ x: 500, y: 500, scale: 10, speed: 6, easing: "easeInCircle" })).toEqualTypeOf<
  Promise<boolean | void>
>();

expectTypeOf(myCanvas.recenter()).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({ x: undefined, y: undefined, scale: undefined })).toEqualTypeOf<
  Promise<boolean | void>
>();
expectTypeOf(myCanvas.recenter({ x: 100, y: 100, scale: 1 })).toEqualTypeOf<Promise<boolean | void>>();

if (myCanvas.pendingRenderFlags) {
  myCanvas.pendingRenderFlags.OBJECTS.add(myCanvas.perception);
}

expectTypeOf(myCanvas.hidden).toEqualTypeOf<HiddenCanvasGroup | undefined>();
expectTypeOf(myCanvas.rendered).toEqualTypeOf<RenderedCanvasGroup.Implementation | undefined>();
expectTypeOf(myCanvas.environment).toEqualTypeOf<EnvironmentCanvasGroup.Implementation | undefined>();

expectTypeOf(myCanvas.controls).toEqualTypeOf<foundry.canvas.layers.ControlsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.drawings).toEqualTypeOf<foundry.canvas.layers.DrawingsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.interface!.grid).toEqualTypeOf<foundry.canvas.layers.GridLayer.Implementation>();
expectTypeOf(myCanvas.lighting).toEqualTypeOf<foundry.canvas.layers.LightingLayer.Implementation | undefined>();
expectTypeOf(myCanvas.regions).toEqualTypeOf<foundry.canvas.layers.RegionLayer.Implementation | undefined>();
expectTypeOf(myCanvas.sounds).toEqualTypeOf<foundry.canvas.layers.SoundsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.templates).toEqualTypeOf<foundry.canvas.layers.TemplateLayer.Implementation | undefined>();
expectTypeOf(myCanvas.tiles).toEqualTypeOf<foundry.canvas.layers.TilesLayer.Implementation | undefined>();
expectTypeOf(myCanvas.notes).toEqualTypeOf<foundry.canvas.layers.NotesLayer.Implementation | undefined>();
expectTypeOf(myCanvas.tokens).toEqualTypeOf<foundry.canvas.layers.TokenLayer.Implementation | undefined>();
expectTypeOf(myCanvas.walls).toEqualTypeOf<foundry.canvas.layers.WallsLayer.Implementation | undefined>();
expectTypeOf(myCanvas.weather).toEqualTypeOf<foundry.canvas.layers.WeatherEffects.Implementation | undefined>();
