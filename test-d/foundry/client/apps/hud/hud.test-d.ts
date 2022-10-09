import { expectType } from "tsd";

class MyPlaceableHud extends BasePlaceableHUD<Token> {}

declare const token: Token;

const hud = new MyPlaceableHud();
expectType<Token | undefined>(hud.object);

expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<void>(hud.bind(token));
expectType<void>(hud.clear());

expectType<MaybePromise<object>>(hud.getData());
