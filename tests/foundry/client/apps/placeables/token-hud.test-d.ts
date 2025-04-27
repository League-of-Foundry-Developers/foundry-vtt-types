import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const tokenHUD = new TokenHUD();

expectTypeOf(tokenHUD.object).toEqualTypeOf<Token.Implementation | undefined>();
expectTypeOf(TokenHUD.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(tokenHUD.options).toEqualTypeOf<Application.Options>();
expectTypeOf(tokenHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(tokenHUD.render(true)).toEqualTypeOf<TokenHUD>();
expectTypeOf(tokenHUD.layer).toEqualTypeOf<TokenLayer.Any>();
