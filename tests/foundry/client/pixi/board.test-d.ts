import { assertType, expectTypeOf } from "vitest";

type TilesLayer = unknown; // FIXME: remove when TilesLayer is typed

const myCanvas = new Canvas();
assertType<Record<string, CONFIG.Canvas.LayerDefinition<ConstructorOf<CanvasLayer>>>>(Canvas.layers);
expectTypeOf(myCanvas.draw(new Scene({ name: "My Scene" }))).toEqualTypeOf<Promise<Canvas>>();

expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientLight")).toEqualTypeOf<LightingLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("AmbientSound")).toEqualTypeOf<SoundsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Drawing")).toEqualTypeOf<DrawingsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Note")).toEqualTypeOf<NotesLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("MeasuredTemplate")).toEqualTypeOf<TemplateLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Tile")).toEqualTypeOf<TilesLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Token")).toEqualTypeOf<TokenLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("Wall")).toEqualTypeOf<WallsLayer | null>();
expectTypeOf(myCanvas.getLayerByEmbeddedName("any-string")).toEqualTypeOf<null>();

expectTypeOf(myCanvas.animatePan()).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.animatePan({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, speed: 10 })).toEqualTypeOf<
  Promise<boolean | void>
>();

expectTypeOf(myCanvas.recenter()).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({})).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({ x: null, y: null, scale: null })).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(myCanvas.recenter({ x: 100, y: 100, scale: 1 })).toEqualTypeOf<Promise<boolean | void>>();

expectTypeOf(
  myCanvas.addPendingOperation("Canvas.recenter", myCanvas.recenter, myCanvas, { x: 100, y: 100, scale: 1 }),
).toEqualTypeOf<void>();
