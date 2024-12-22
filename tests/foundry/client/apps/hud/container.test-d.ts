import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const display = new HeadsUpDisplay();
expectTypeOf(display.token).toEqualTypeOf<TokenHUD>();
expectTypeOf(display.tile).toEqualTypeOf<TileHUD>();
expectTypeOf(display.drawing).toEqualTypeOf<DrawingHUD>();
expectTypeOf(display.bubbles).toEqualTypeOf<ChatBubbles>();
expectTypeOf(display.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(display.align()).toEqualTypeOf<void>();
