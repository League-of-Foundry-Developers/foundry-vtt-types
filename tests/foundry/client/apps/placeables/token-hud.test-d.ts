import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";
import type { Container, DisplayObject } from "pixi.js";

const tokenHUD = new TokenHUD();

expectTypeOf(tokenHUD.object).toEqualTypeOf<Token | undefined>();
expectTypeOf(TokenHUD.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(tokenHUD.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(tokenHUD.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(tokenHUD.render(true)).toEqualTypeOf<TokenHUD>();

expectTypeOf(tokenHUD.layer).toEqualTypeOf<Container<DisplayObject> | undefined>();
