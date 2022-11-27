import { expectAssignable, expectType } from "tsd";

type TilesLayer = unknown; // FIXME: remove when TilesLayer is typed

const myCanvas = new Canvas();
expectAssignable<Record<string, CONFIG.Canvas.LayerDefinition<ConstructorOf<CanvasLayer>>>>(Canvas.layers);
expectType<Promise<Canvas>>(myCanvas.draw(new Scene({ name: "My Scene" })));

expectType<LightingLayer | null>(myCanvas.getLayerByEmbeddedName("AmbientLight"));
expectType<SoundsLayer | null>(myCanvas.getLayerByEmbeddedName("AmbientSound"));
expectType<DrawingsLayer | null>(myCanvas.getLayerByEmbeddedName("Drawing"));
expectType<NotesLayer | null>(myCanvas.getLayerByEmbeddedName("Note"));
expectType<TemplateLayer | null>(myCanvas.getLayerByEmbeddedName("MeasuredTemplate"));
expectType<TilesLayer | null>(myCanvas.getLayerByEmbeddedName("Tile"));
expectType<TokenLayer | null>(myCanvas.getLayerByEmbeddedName("Token"));
expectType<WallsLayer | null>(myCanvas.getLayerByEmbeddedName("Wall"));
expectType<null>(myCanvas.getLayerByEmbeddedName("any-string"));

expectType<Promise<boolean | void>>(myCanvas.animatePan());
expectType<Promise<boolean | void>>(myCanvas.animatePan({}));
expectType<Promise<boolean | void>>(myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, speed: 10 }));

expectType<Promise<boolean | void>>(myCanvas.recenter());
expectType<Promise<boolean | void>>(myCanvas.recenter({}));
expectType<Promise<boolean | void>>(myCanvas.recenter({ x: null, y: null, scale: null }));
expectType<Promise<boolean | void>>(myCanvas.recenter({ x: 100, y: 100, scale: 1 }));

expectType<void>(
  myCanvas.addPendingOperation("Canvas.recenter", myCanvas.recenter, myCanvas, { x: 100, y: 100, scale: 1 })
);
