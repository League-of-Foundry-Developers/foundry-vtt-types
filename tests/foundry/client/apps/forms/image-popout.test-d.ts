import { expectTypeOf } from "vitest";
import type { MaybePromise } from "../../../../../src/utils/index.d.mts";

const imagePopout = new ImagePopout("");
expectTypeOf(imagePopout.object).toEqualTypeOf<string>();
expectTypeOf(ImagePopout.defaultOptions).toEqualTypeOf<ImagePopoutOptions>();
expectTypeOf(imagePopout.options).toEqualTypeOf<ImagePopoutOptions>();
expectTypeOf(imagePopout.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(imagePopout.render(true)).toEqualTypeOf<ImagePopout>();

expectTypeOf(imagePopout.isVideo).toEqualTypeOf<boolean>();
expectTypeOf(imagePopout.title).toEqualTypeOf<string>();
expectTypeOf(imagePopout.isTitleVisible()).toEqualTypeOf<boolean>();

expectTypeOf(ImagePopout.getImageSize("")).toEqualTypeOf<Promise<[width: number, height: number]>>();
expectTypeOf(ImagePopout.getVideoSize("")).toEqualTypeOf<Promise<[width: number, height: number]>>();
