import { expectType } from "tsd";

declare const drawing: Drawing;

const hud = new DrawingHUD();
expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<Drawing | undefined>(hud.object);
hud.bind(drawing);
expectType<MaybePromise<object>>(hud.getData());
expectType<void>(hud.setPosition());
