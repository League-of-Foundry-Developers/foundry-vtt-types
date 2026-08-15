import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

import FontConfig = foundry.applications.settings.menus.FontConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const app = new FontConfig();

expectTypeOf(FontConfig.DEFAULT_OPTIONS).toEqualTypeOf<FontConfig.DefaultOptions>();
expectTypeOf(FontConfig.FONT_TYPES).toEqualTypeOf<Readonly<FontConfig.FontTypes>>();
expectTypeOf(FontConfig.FONT_TYPES.FILE).toEqualTypeOf<"file">();
expectTypeOf(FontConfig.FONT_TYPES.SYSTEM).toEqualTypeOf<"system">();
expectTypeOf(FontConfig.SETTING).toBeString();

declare const definition: CONFIG.Font.FamilyDefinition;
declare const fontFace: CONFIG.Font.Definition;

expectTypeOf(FontConfig.getAvailableFonts()).toEqualTypeOf<string[]>();
expectTypeOf(FontConfig.getAvailableFontChoices()).toEqualTypeOf<Record<string, string>>();
expectTypeOf(FontConfig.loadFont("Amiri", definition)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(FontConfig.loadFont("Amiri", definition, { document })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(FontConfig._loadFonts()).toEqualTypeOf<Promise<void>>();
expectTypeOf(FontConfig._loadFonts({ timeout: 100 })).toEqualTypeOf<Promise<void>>();

expectTypeOf(app.object).toEqualTypeOf<FontConfig.NewFontDefinition>();

// Every property but `preview` and `type` is nulled out on each render.
declare const font: FontConfig.NewFontDefinition;
expectTypeOf(font.family).toEqualTypeOf<string | null>();
expectTypeOf(font.weight).toEqualTypeOf<number | null>();
expectTypeOf(font.style).toEqualTypeOf<string | null>();
expectTypeOf(font.src).toEqualTypeOf<string | null>();
expectTypeOf(font.preview).toBeString();
expectTypeOf(font.type).toEqualTypeOf<FontConfig.FontType>();

declare const context: FontConfig.RenderContext;
expectTypeOf(context.fonts).toEqualTypeOf<FontConfig.FontData[]>();
expectTypeOf(context.selected).toEqualTypeOf<CONFIG.Font.Definition | null | undefined>();
expectTypeOf(context.isSystemFont).toBeBoolean();
expectTypeOf(context.isFileFont).toBeBoolean();
expectTypeOf(context.font).toEqualTypeOf<FontConfig.NewFontDefinition>();
expectTypeOf(context.fontWeights).toEqualTypeOf<FontConfig.Choice<number>[]>();
expectTypeOf(context.fontStyles).toEqualTypeOf<FontConfig.Choice<string>[]>();
expectTypeOf(context.preview.family).toEqualTypeOf<string | null>();
expectTypeOf(context.preview.text).toBeString();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

class CustomFontConfig extends FontConfig {
  protected override _getDataForDefinition(
    family: string,
    definition: CONFIG.Font.FamilyDefinition,
  ): FontConfig.FontData[] {
    return super._getDataForDefinition(family, definition);
  }

  testProtected(event: PointerEvent, target: ApplicationV2.ActionTarget): void {
    expectTypeOf(CustomFontConfig._collectDefinitions()).toEqualTypeOf<
      Record<string, CONFIG.Font.FamilyDefinition>[]
    >();
    expectTypeOf(CustomFontConfig._createFontFace("Amiri", fontFace)).toEqualTypeOf<FontFace | null>();
    expectTypeOf(CustomFontConfig._formatFont("Amiri", fontFace)).toBeString();
    expectTypeOf(this._onClickAction(event, target)).toEqualTypeOf<MaybePromise<void>>();
    expectTypeOf(this._onAddFont()).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onDeleteFont(event)).toEqualTypeOf<Promise<void>>();
    expectTypeOf(this._onSelectFont(event)).toEqualTypeOf<void>();
  }
}

expectTypeOf(new CustomFontConfig()).toEqualTypeOf<CustomFontConfig>();
expectTypeOf(app.close()).toEqualTypeOf<Promise<FontConfig>>();
