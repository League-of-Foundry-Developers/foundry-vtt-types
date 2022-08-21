import { expectAssignable, expectError, expectType } from "tsd";

const myCanvas = new Canvas();
expectType<StoredDocument<Scene> | null>(myCanvas.scene);
expectType<Canvas.Dimensions | null>(myCanvas.dimensions);
expectType<HeadsUpDisplay | null>(myCanvas.hud);
expectType<Array<[(args: any[]) => void, any, any[]]>>(myCanvas.pendingOperations);
expectType<PerceptionManager>(myCanvas.perception);
expectType<boolean>(myCanvas.ready);
expectType<boolean>(myCanvas.loading);
expectType<boolean>(myCanvas.initialized);
expectType<number>(myCanvas.blurDistance);
expectType<PIXI.filters.BlurFilter[]>(myCanvas.blurFilters);
expectType<MouseInteractionManager | undefined>(myCanvas.mouseInteractionManager);
expectType<MouseInteractionManager | null>(myCanvas.currentMouseManager);
expectType<void>(myCanvas.initialize());
expectType<string | null>(myCanvas.id);
expectAssignable<Record<string, CONFIG.Canvas.LayerDefinition<ConstructorOf<CanvasLayer>>>>(Canvas.layers);
expectType<CanvasLayer[]>(myCanvas.layers);
expectType<CanvasLayer | null>(myCanvas.activeLayer);
expectType<Promise<void>>(myCanvas.tearDown());
expectType<Promise<Canvas>>(myCanvas.draw(new Scene({ name: "My Scene" })));
expectError(Canvas.getDimensions());
expectError(Canvas.getDimensions({}));
const scene = canvas?.scene;
if (scene) {
  expectType<Canvas.Dimensions>(Canvas.getDimensions(scene.data));
}
expectType<Canvas.Dimensions>(
  Canvas.getDimensions({
    grid: 100,
    gridDistance: 10,
    padding: 10,
    shiftX: 10,
    shiftY: 10
  })
);
expectType<Canvas.Dimensions>(
  Canvas.getDimensions({
    width: 100,
    height: 100,
    grid: 100,
    gridDistance: 10,
    padding: 0,
    shiftX: 0,
    shiftY: 0
  })
);

expectType<BackgroundLayer | null>(myCanvas.getLayerByEmbeddedName("Tile"));
expectType<DrawingsLayer | null>(myCanvas.getLayerByEmbeddedName("Drawing"));
expectType<WallsLayer | null>(myCanvas.getLayerByEmbeddedName("Wall"));
expectType<TemplateLayer | null>(myCanvas.getLayerByEmbeddedName("MeasuredTemplate"));
expectType<NotesLayer | null>(myCanvas.getLayerByEmbeddedName("Note"));
expectType<TokenLayer | null>(myCanvas.getLayerByEmbeddedName("Token"));
expectType<SoundsLayer | null>(myCanvas.getLayerByEmbeddedName("AmbientSound"));
expectType<LightingLayer | null>(myCanvas.getLayerByEmbeddedName("AmbientLight"));
expectType<null>(myCanvas.getLayerByEmbeddedName("any-string"));

expectType<void>(myCanvas.activateLayer("background"));
expectType<void>(myCanvas.activateLayer("foreground"));
expectType<void>(myCanvas.activateLayer("drawings"));
expectType<void>(myCanvas.activateLayer("grid"));
expectType<void>(myCanvas.activateLayer("walls"));
expectType<void>(myCanvas.activateLayer("templates"));
expectType<void>(myCanvas.activateLayer("notes"));
expectType<void>(myCanvas.activateLayer("tokens"));
expectType<void>(myCanvas.activateLayer("lighting"));
expectType<void>(myCanvas.activateLayer("sounds"));
expectType<void>(myCanvas.activateLayer("sight"));
expectType<void>(myCanvas.activateLayer("effects"));
expectType<void>(myCanvas.activateLayer("controls"));
expectError<void>(myCanvas.activateLayer("another-string"));

expectType<void>(myCanvas.pan());
expectType<void>(myCanvas.pan({}));
expectType<void>(myCanvas.pan({ x: null, y: null, scale: null }));
expectType<void>(myCanvas.pan({ x: 100, y: 100, scale: 1 }));

expectType<Promise<boolean>>(myCanvas.animatePan());
expectType<Promise<boolean>>(myCanvas.animatePan({}));
expectType<Promise<boolean>>(myCanvas.animatePan({ x: 100, y: 100, scale: 1, duration: 250, speed: 10 }));

expectType<Promise<boolean>>(myCanvas.recenter());
expectType<Promise<boolean>>(myCanvas.recenter({}));
expectType<Promise<boolean>>(myCanvas.recenter({ x: null, y: null, scale: null }));
expectType<Promise<boolean>>(myCanvas.recenter({ x: 100, y: 100, scale: 1 }));

expectType<PIXI.filters.BlurFilter>(myCanvas.createBlurFilter());

expectType<void>(
  myCanvas.addPendingOperation("Canvas.recenter", myCanvas.recenter, myCanvas, { x: 100, y: 100, scale: 1 })
);
expectType<void>(myCanvas.triggerPendingOperations());
