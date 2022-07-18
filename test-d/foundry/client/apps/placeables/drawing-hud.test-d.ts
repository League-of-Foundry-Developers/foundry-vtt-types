import { expectType } from 'tsd';

declare const drawing: Drawing;

const hud = new DrawingHUD();
expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<Drawing | undefined>(hud.object);
hud.bind(drawing);
expectType<
  ReturnType<foundry.documents.BaseDrawing['toJSON']> & {
    id: string;
    classes: string;
    appId: number;
    isGM: boolean;
    icons: typeof CONFIG.controlIcons;
  } & {
    lockedClass: string;
    visibilityClass: string;
  }
>(hud.getData());
expectType<void>(hud.setPosition());
