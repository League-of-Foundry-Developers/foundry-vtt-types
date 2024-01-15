import { expectTypeOf } from "vitest";
import type EmbeddedCollection from "../../../../../src/foundry/common/abstract/embedded-collection.d.mts";

expectTypeOf(MapLayer.documentName).toEqualTypeOf<"Tile">();
expectTypeOf(MapLayer.layerOptions).toEqualTypeOf<MapLayer.LayerOptions>();
expectTypeOf(MapLayer.layerOptions.name).toEqualTypeOf<"background" | "foreground">();
expectTypeOf(MapLayer.layerOptions.objectClass).toEqualTypeOf<typeof Tile>();

expectTypeOf(new MapLayer()).toEqualTypeOf<MapLayer>();
expectTypeOf(new MapLayer({ bgPath: "/path/to/an/image.png", level: 1 })).toEqualTypeOf<MapLayer>();

const layer = new MapLayer();
expectTypeOf(layer.options).toEqualTypeOf<MapLayer.LayerOptions<"background">>();
expectTypeOf(layer.options.name).toEqualTypeOf<"background">();
expectTypeOf(layer.level).toEqualTypeOf<number>();
expectTypeOf(layer.bgPath).toEqualTypeOf<string | undefined>();
expectTypeOf(layer.bg).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(layer.bgSource).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | null>();
expectTypeOf(layer.hud).toEqualTypeOf<TileHUD>();
expectTypeOf(layer.isVideo).toEqualTypeOf<boolean>();
expectTypeOf(layer.tiles).toEqualTypeOf<Tile[]>();
expectTypeOf(layer.deactivate()).toEqualTypeOf<MapLayer>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<MapLayer>>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<MapLayer | undefined>>();

expectTypeOf(BackgroundLayer.layerOptions).toEqualTypeOf<MapLayer.LayerOptions<"background">>();

const bgLayer = new BackgroundLayer();
expectTypeOf(bgLayer.options.name).toEqualTypeOf<"background">();
expectTypeOf(bgLayer.getDocuments()).toEqualTypeOf<
  EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]
>();
expectTypeOf(bgLayer.storeHistory("create", new TileDocument().data)).toEqualTypeOf<void>();
expectTypeOf(bgLayer.storeHistory("update", new TileDocument().data)).toEqualTypeOf<void>();
expectTypeOf(bgLayer.storeHistory("delete", new TileDocument().data)).toEqualTypeOf<void>();

// @ts-expect-error - "new" is not a valid history type.
bgLayer.storeHistory("new", new TileDocument().data);

expectTypeOf(ForegroundLayer.layerOptions).toEqualTypeOf<MapLayer.LayerOptions<"foreground">>();

const fgLayer = new ForegroundLayer();
expectTypeOf(fgLayer.options.name).toEqualTypeOf<"foreground">();
expectTypeOf(fgLayer.getDocuments()).toEqualTypeOf<
  EmbeddedCollection<typeof TileDocument, foundry.data.SceneData> | TileDocument[]
>();
