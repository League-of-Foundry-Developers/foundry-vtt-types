import { expectTypeOf } from "vitest";

class MyPlaceableHud extends BasePlaceableHUD<Token> {}

declare const token: Token;

const hud = new MyPlaceableHud();
expectTypeOf(hud.object).toEqualTypeOf<Token | undefined>();

expectTypeOf(hud.layer).toEqualTypeOf<PlaceablesLayer<any> | undefined>();
expectTypeOf(hud.bind(token)).toEqualTypeOf<void>();
expectTypeOf(hud.clear()).toEqualTypeOf<void>();

expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
