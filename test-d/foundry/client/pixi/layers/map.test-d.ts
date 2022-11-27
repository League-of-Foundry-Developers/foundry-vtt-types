import type EmbeddedCollection from "../../../../../src/foundry/common/abstract/embedded-collection.mjs";

import { expectError, expectType } from "tsd";

expectType<"Tile">(MapLayer.documentName);
expectType<MapLayer.LayerOptions>(MapLayer.layerOptions);
expectType<"background" | "foreground">(MapLayer.layerOptions.name);
expectType<typeof Tile>(MapLayer.layerOptions.objectClass);

expectType<MapLayer>(new MapLayer());
expectType<MapLayer>(new MapLayer({ bgPath: "/path/to/an/image.png", level: 1 }));

const layer = new MapLayer();
expectType<MapLayer.LayerOptions<"background">>(layer.options);
expectType<"background">(layer.options.name);
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

expectType<MapLayer.LayerOptions<"background">>(BackgroundLayer.layerOptions);

const bgLayer = new BackgroundLayer();
expectType<"background">(bgLayer.options.name);
expectType<EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]>(bgLayer.getDocuments());
expectType<void>(bgLayer.storeHistory("create", new TileDocument().data));
expectType<void>(bgLayer.storeHistory("update", new TileDocument().data));
expectType<void>(bgLayer.storeHistory("delete", new TileDocument().data));
expectError(bgLayer.storeHistory("new", new TileDocument().data));

expectType<MapLayer.LayerOptions<"foreground">>(ForegroundLayer.layerOptions);

const fgLayer = new ForegroundLayer();
expectType<"foreground">(fgLayer.options.name);
expectType<EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]>(fgLayer.getDocuments());
