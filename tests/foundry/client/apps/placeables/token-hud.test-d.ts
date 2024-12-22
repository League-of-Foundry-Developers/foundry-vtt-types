import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const token: Token;

const hud = new TokenHUD();
expectTypeOf(hud.layer).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(hud.object).toEqualTypeOf<Token | undefined>();
hud.bind(token);

expectTypeOf(hud.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(hud.setPosition()).toEqualTypeOf<void>();
