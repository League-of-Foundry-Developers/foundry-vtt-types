import { expectTypeOf } from "vitest";
import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare const font: FontConfig.NewFontDefinition;

const fontConfig = new FontConfig(font);
expectTypeOf(fontConfig.object).toEqualTypeOf<FontConfig.NewFontDefinition>();
expectTypeOf(FontConfig.defaultOptions).toEqualTypeOf<FontConfig.Options>();
expectTypeOf(fontConfig.options).toEqualTypeOf<FontConfig.Options>();
expectTypeOf(fontConfig.getData()).toEqualTypeOf<MaybePromise<GetDataReturnType<FontConfig.Data>>>();
expectTypeOf(fontConfig.render(true)).toEqualTypeOf<FontConfig>();
