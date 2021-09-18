import { expectType } from 'tsd';

declare const tile: Tile;

const hud = new TileHUD();
expectType<ForegroundLayer | BackgroundLayer | undefined>(hud.layer);
expectType<Tile | undefined>(hud.object);
hud.bind(tile);
expectType<
  ReturnType<foundry.data.TileData['toJSON']> & {
    id: string;
    classes: string;
    appId: number;
    isGM: boolean;
    icons: typeof CONFIG.controlIcons;
  } & {
    isVideo: boolean;
    lockedClass: string;
    visibilityClass: string;
    overheadClass: string;
    underfootClass: string;
    videoIcon: string;
    videoTitle: string;
  }
>(hud.getData());
expectType<void>(hud.setPosition());
