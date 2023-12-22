import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/types/utils.mts";

const hotbar = new Hotbar();
expectTypeOf(hotbar.page).toEqualTypeOf<number>();
expectTypeOf(hotbar.macros).toEqualTypeOf<Macro[]>();
expectTypeOf(hotbar.getData()).toEqualTypeOf<MaybePromise<object>>();

expectTypeOf(hotbar.collapse()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(hotbar.expand()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(hotbar.changePage()).toEqualTypeOf<void>();
expectTypeOf(hotbar.changePage(5)).toEqualTypeOf<void>();
expectTypeOf(hotbar.cyclePage()).toEqualTypeOf<void>();
expectTypeOf(hotbar.cyclePage(1)).toEqualTypeOf<void>();
expectTypeOf(hotbar.cyclePage(-1)).toEqualTypeOf<void>();
