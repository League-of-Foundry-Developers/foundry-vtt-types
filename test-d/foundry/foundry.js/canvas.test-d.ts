import { expectAssignable, expectError, expectType } from 'tsd';

const myCanvas = new Canvas();
expectType<Scene | null>(myCanvas.scene);
expectType<Canvas.Dimensions | null>(myCanvas.dimensions);
expectType<HeadsUpDisplay | null>(myCanvas.hud);
expectType<Array<[(args: any[]) => void, any, any[]]>>(myCanvas.pendingOperations);
expectType<PerceptionManager>(myCanvas.perception);
expectType<boolean>(myCanvas.ready);
expectType<boolean>(myCanvas.initialized);
expectType<number>(myCanvas.blurDistance);
expectType<PIXI.filters.BlurFilter[]>(myCanvas.blurFilters);
expectType<MouseInteractionManager | undefined>(myCanvas.mouseInteractionManager);
expectType<MouseInteractionManager | null>(myCanvas.currentMouseManager);
expectType<void>(myCanvas.initialize());
expectType<string | null>(myCanvas.id);
expectAssignable<Record<string, ConstructorOf<CanvasLayer>>>(Canvas.layers);
expectType<CanvasLayer[]>(myCanvas.layers);
expectType<CanvasLayer | null>(myCanvas.activeLayer);
expectType<Promise<void>>(myCanvas.tearDown());
expectType<Promise<Canvas>>(myCanvas.draw(new Scene({ name: 'My Scene' })));
expectError(Canvas.getDimensions());
expectType<Canvas.Dimensions>(Canvas.getDimensions({}));
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

expectType<BackgroundLayer | null>(myCanvas.getLayer('BackgroundLayer'));
expectType<DrawingsLayer | null>(myCanvas.getLayer('DrawingLayer'));
expectType<GridLayer | null>(myCanvas.getLayer('GridLayer'));
expectType<WallsLayer | null>(myCanvas.getLayer('WallsLayer'));
expectType<TemplateLayer | null>(myCanvas.getLayer('TemplateLayer'));
expectType<NotesLayer | null>(myCanvas.getLayer('NotesLayer'));
expectType<TokenLayer | null>(myCanvas.getLayer('TokenLayer'));
expectType<ForegroundLayer | null>(myCanvas.getLayer('ForegroundLayer'));
expectType<SoundsLayer | null>(myCanvas.getLayer('SoundsLayer'));
expectType<LightingLayer | null>(myCanvas.getLayer('LightingLayer'));
expectType<SightLayer | null>(myCanvas.getLayer('SightLayer'));
expectType<EffectsLayer | null>(myCanvas.getLayer('EffectsLayer'));
expectType<ControlsLayer | null>(myCanvas.getLayer('ControlsLayer'));
expectType<null>(myCanvas.getLayer('any string'));

expectType<BackgroundLayer | null>(myCanvas.getLayerByEmbeddedName('Tile'));
expectType<DrawingsLayer | null>(myCanvas.getLayerByEmbeddedName('Drawing'));
expectType<WallsLayer | null>(myCanvas.getLayerByEmbeddedName('Wall'));
expectType<TemplateLayer | null>(myCanvas.getLayerByEmbeddedName('MeasuredTemplate'));
expectType<NotesLayer | null>(myCanvas.getLayerByEmbeddedName('Note'));
expectType<TokenLayer | null>(myCanvas.getLayerByEmbeddedName('Token'));
expectType<SoundsLayer | null>(myCanvas.getLayerByEmbeddedName('AmbientSound'));
expectType<LightingLayer | null>(myCanvas.getLayerByEmbeddedName('AmbientLight'));
expectType<null>(myCanvas.getLayerByEmbeddedName('any-string'));

expectType<void>(myCanvas.activeLayer('background'));
expectType<void>(myCanvas.activeLayer('foreground'));
expectType<void>(myCanvas.activeLayer('drawings'));
expectType<void>(myCanvas.activeLayer('grid'));
expectType<void>(myCanvas.activeLayer('walls'));
expectType<void>(myCanvas.activeLayer('templates'));
expectType<void>(myCanvas.activeLayer('notes'));
expectType<void>(myCanvas.activeLayer('tokens'));
expectType<void>(myCanvas.activeLayer('lighting'));
expectType<void>(myCanvas.activeLayer('sounds'));
expectType<void>(myCanvas.activeLayer('sight'));
expectType<void>(myCanvas.activeLayer('effects'));
expectType<void>(myCanvas.activeLayer('controls'));
expectError<void>(myCanvas.activeLayer('another-string'));

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
  myCanvas.addPendingOperation('Canvas.recenter', myCanvas.recenter, myCanvas, { x: 100, y: 100, scale: 1 })
);
expectType<void>(myCanvas.triggerPendingOperations());
