import { assertType, expectTypeOf } from "vitest";

const myCanvas = new Canvas();
assertType<Record<string, CONFIG.Canvas.LayerDefinition<CanvasLayer.AnyConstructor>>>(Canvas.layers);
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

expectTypeOf(myCanvas.animatePan({})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, easing: (pt: number) => pt }),
).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myCanvas.animatePan({ x: 500, y: 500, scale: 10, speed: 6, easing: "easeInCircle" })).toEqualTypeOf<
  Promise<boolean>
>();

expectTypeOf(myCanvas.recenter()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myCanvas.recenter({})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myCanvas.recenter({ x: null, y: null, scale: null })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(myCanvas.recenter({ x: 100, y: 100, scale: 1 })).toEqualTypeOf<Promise<boolean>>();

myCanvas.pendingRenderFlags.OBJECTS.add(myCanvas.perception);

expectTypeOf(myCanvas.hidden).toEqualTypeOf<HiddenCanvasGroup | undefined>();
expectTypeOf(myCanvas.rendered).toEqualTypeOf<RenderedCanvasGroup>();
expectTypeOf(myCanvas.environment).toEqualTypeOf<EnvironmentCanvasGroup>();
