import { expectType } from "tsd";

class MyPlaceableHud extends BasePlaceableHUD<Token> {}

declare const token: Token;

const hud = new MyPlaceableHud();
expectType<Token | undefined>(hud.object);

expectType<PlaceablesLayer<any> | undefined>(hud.layer);
expectType<void>(hud.bind(token));
expectType<void>(hud.clear());

expectType<
  ReturnType<foundry.data.TokenData["toJSON"]> & {
    id: string;
    classes: string;
    appId: number;
    isGM: boolean;
    icons: typeof CONFIG.controlIcons;
  }
>(hud.getData());
