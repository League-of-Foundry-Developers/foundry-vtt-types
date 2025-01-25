import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "../../../../../src/utils/index.d.mts";

declare const font: NewFontDefinition;

const fontConfig = new FontConfig(font);
expectTypeOf(fontConfig.object).toEqualTypeOf<NewFontDefinition>();
expectTypeOf(FontConfig.defaultOptions).toEqualTypeOf<FontConfig.Options>();
expectTypeOf(fontConfig.options).toEqualTypeOf<FontConfig.Options>();
expectTypeOf(fontConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<FontConfig.FontConfigData>>>();
expectTypeOf(fontConfig.render(true)).toEqualTypeOf<FontConfig>();
