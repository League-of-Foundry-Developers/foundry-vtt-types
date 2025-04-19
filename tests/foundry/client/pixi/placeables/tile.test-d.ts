import { expectTypeOf } from "vitest";

expectTypeOf(Tile.embeddedName).toEqualTypeOf<"Tile">();
expectTypeOf(Tile.createPreview({ x: 100, y: null })).toEqualTypeOf<Tile.Object>();

declare const doc: TileDocument.Implementation;
const tile = new CONFIG.Tile.objectClass(doc);
// declare const token: Token;

expectTypeOf(tile.frame).toEqualTypeOf<
  | (PIXI.Container & {
      border: PIXI.Graphics;
      handle: ResizeHandle;
    })
  | undefined
>();
expectTypeOf(tile.texture).toEqualTypeOf<PIXI.Texture | undefined>();
expectTypeOf(tile.tile).toEqualTypeOf<PIXI.Sprite | undefined>();
expectTypeOf(tile.bg).toEqualTypeOf<PIXI.Graphics | undefined>();
expectTypeOf(tile.occluded).toEqualTypeOf<boolean>();
expectTypeOf(tile.aspectRatio).toEqualTypeOf<number>();
expectTypeOf(tile.sourceElement).toEqualTypeOf<HTMLImageElement | HTMLVideoElement | undefined>();
expectTypeOf(tile.isVideo).toEqualTypeOf<boolean>();
expectTypeOf(tile.isRoof).toEqualTypeOf<boolean>();
expectTypeOf(tile.draw()).toEqualTypeOf<Promise<Tile.Object>>();
expectTypeOf(tile.refresh()).toEqualTypeOf<Tile.Object>();

// expectTypeOf(tile.play(true)).toEqualTypeOf<void>();
// expectTypeOf(tile.play(false, {})).toEqualTypeOf<void>();
// expectTypeOf(tile.play(false, { loop: true, offset: 10, volume: 10 })).toEqualTypeOf<void>();

// expectTypeOf(tile.updateOcclusion([token])).toEqualTypeOf<void>();

// expectTypeOf(tile.testOcclusion(token)).toEqualTypeOf<boolean>();
// expectTypeOf(tile.testOcclusion(token, {})).toEqualTypeOf<boolean>();
// expectTypeOf(tile.testOcclusion(token, { corners: false })).toEqualTypeOf<boolean>();

// expectTypeOf(tile.containsPixel(236, 154)).toEqualTypeOf<boolean>();

// expectTypeOf(tile.getRoofSprite()).toEqualTypeOf<PIXI.Sprite | undefined>();
// expectTypeOf(tile.swapLayer()).toEqualTypeOf<void>();
expectTypeOf(tile.activateListeners()).toEqualTypeOf<void>();
