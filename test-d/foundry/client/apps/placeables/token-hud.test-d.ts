import { expectType } from "tsd";

declare const token: Token;

const hud = new TokenHUD();
expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<Token | undefined>(hud.object);
hud.bind(token);

expectType<MaybePromise<object>>(hud.getData());
expectType<void>(hud.setPosition());
