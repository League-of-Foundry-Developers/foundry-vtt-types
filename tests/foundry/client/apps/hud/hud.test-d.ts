import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/types/utils.d.mts";

class MyPlaceableHud extends BasePlaceableHUD<Token> {}

declare const token: Token;

const hud = new MyPlaceableHud();
expectTypeOf(hud.object).toEqualTypeOf<Token | undefined>();

expectTypeOf(hud.layer).toEqualTypeOf<PlaceablesLayer<any> | undefined>();
expectTypeOf(hud.bind(token)).toEqualTypeOf<void>();
expectTypeOf(hud.clear()).toEqualTypeOf<void>();

expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
