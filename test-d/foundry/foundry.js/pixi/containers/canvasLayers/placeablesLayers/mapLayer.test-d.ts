import { expectType } from 'tsd';

expectType<'Tile'>(MapLayer.documentName);
expectType<MapLayer.LayerOptions>(MapLayer.layerOptions);
expectType<'background' | 'foreground'>(MapLayer.layerOptions.name);
expectType<typeof Tile>(MapLayer.layerOptions.objectClass);
expectType<BackgroundLayer | ForegroundLayer | undefined>(MapLayer.instance);

expectType<MapLayer>(new MapLayer());
expectType<MapLayer>(new MapLayer({ bgPath: '/path/to/an/image.png', level: 1 }));

const layer = new MapLayer();
expectType<MapLayer.LayerOptions<'background'>>(layer.options);
expectType<'background'>(layer.options.name);
expectType<number>(layer.level);
expectType<string | undefined>(layer.bgPath);
expectType<PIXI.Sprite | undefined>(layer.bg);
expectType<HTMLImageElement | HTMLVideoElement | null>(layer.bgSource);
expectType<TileHUD>(layer.hud);
expectType<boolean>(layer.isVideo);
expectType<Tile[]>(layer.tiles);
expectType<MapLayer>(layer.deactivate());
expectType<Promise<MapLayer>>(layer.tearDown());
expectType<Promise<MapLayer | undefined>>(layer.draw());
