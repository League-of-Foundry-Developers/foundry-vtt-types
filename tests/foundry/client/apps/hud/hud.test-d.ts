import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

class MyPlaceableHud extends BasePlaceableHUD<Token> {}

declare const token: Token;

const hud = new MyPlaceableHud();
expectTypeOf(hud.object).toEqualTypeOf<Token | undefined>();

expectTypeOf(hud.layer).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(hud.bind(token)).toEqualTypeOf<void>();
expectTypeOf(hud.clear()).toEqualTypeOf<void>();

expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
