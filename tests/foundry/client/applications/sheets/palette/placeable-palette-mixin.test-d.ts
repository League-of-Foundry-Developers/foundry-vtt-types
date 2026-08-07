import { expectTypeOf } from "vitest";
import type { AnyMutableObject, AnyObject, DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import PlaceablePaletteMixin = foundry.applications.sheets.palette.PlaceablePaletteMixin;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import WallPalette = foundry.applications.sheets.palette.WallPalette;

// The mixin is constrained to `PlaceableConfig`, not bare `ApplicationV2`: its body assigns `_preview`, reads the
// `preview` option, and calls `super._processFormData`.
expectTypeOf<PlaceablePaletteMixin.BaseClass>().toEqualTypeOf<foundry.applications.sheets.PlaceableConfig.AnyConstructor>();

declare const palette: WallPalette;

expectTypeOf(palette.controlled).toEqualTypeOf<WallDocument.Implementation[]>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(palette.documentClass).toEqualTypeOf<foundry.abstract.Document.AnyConstructor>();
expectTypeOf(palette.documentName).toBeString();
expectTypeOf(palette.isSelect).toBeBoolean();
expectTypeOf(palette.title).toBeString();
expectTypeOf(palette.isEditable).toBeBoolean();

// `null` when the canvas has no layer registered for the palette's document name.
expectTypeOf(palette.layer).toEqualTypeOf<foundry.canvas.layers.PlaceablesLayer.Any | null>();

expectTypeOf(palette._dirtyFields).toEqualTypeOf<Set<string>>();
expectTypeOf(palette._multiFields).toEqualTypeOf<Set<string>>();

expectTypeOf(WallPalette.createData).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(WallPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
expectTypeOf(WallPalette.isActivePreset({})).toBeBoolean();

// Only `WallPalette` assigns `COMMIT_TOOL`, so it drops the mixin's `undefined`. The key itself stays `string` so a
// subclass can retarget it.
expectTypeOf(WallPalette.COMMIT_TOOL).toBeString();
expectTypeOf<PlaceablePaletteMixin.AnyMixedConstructor["COMMIT_TOOL"]>().toEqualTypeOf<string | undefined>();

/* Configuration and render options */

declare const config: PlaceablePaletteMixin.Configuration;
expectTypeOf(config.initialData).toEqualTypeOf<AnyObject>();

declare const renderOptions: PlaceablePaletteMixin.RenderOptions;
expectTypeOf(renderOptions.preset).toEqualTypeOf<AnyObject | undefined>();
expectTypeOf(renderOptions.preservePlacement).toEqualTypeOf<boolean | undefined>();

declare const context: PlaceablePaletteMixin.RenderContext;
expectTypeOf(context.rootId).toBeString();
expectTypeOf(context.isSelect).toBeBoolean();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

/* Protected hooks, exercised through a subclass. */

class CustomWallPalette extends WallPalette {
  protected override _applyPreset(
    formData: AnyObject,
    options?: PlaceablePaletteMixin.RenderOptions,
  ): AnyMutableObject | void {
    return super._applyPreset(formData, options);
  }

  protected override _determineMultiFields(docs: foundry.abstract.Document.Any[]): Set<string> {
    return super._determineMultiFields(docs);
  }

  protected override _setPlaceholder(element: HTMLElement): void {
    super._setPlaceholder(element);
  }

  protected override _configureRenderOptions(options: DeepPartial<WallPalette.RenderOptions>): void {
    super._configureRenderOptions(options);
  }

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void {
    super._onChangeForm(formConfig, event);
  }

  protected override _renderFrame(options: DeepPartial<WallPalette.RenderOptions>): Promise<HTMLElement> {
    return super._renderFrame(options);
  }

  protected override _onClose(options: DeepPartial<WallPalette.RenderOptions>): void {
    super._onClose(options);
  }

  protected static override _getDefaultLevelData(): AnyMutableObject {
    return super._getDefaultLevelData();
  }
}

expectTypeOf(CustomWallPalette).toExtend<WallPalette.AnyConstructor>();

declare namespace TokenPaletteConfig {
  interface RenderContext extends PlaceableConfig.RenderContext<TokenDocument.Implementation> {}
  interface Configuration extends PlaceableConfig.Configuration<TokenDocument.Implementation> {}
  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare class TokenPaletteConfig<
  RenderContext extends TokenPaletteConfig.RenderContext = TokenPaletteConfig.RenderContext,
  Configuration extends TokenPaletteConfig.Configuration = TokenPaletteConfig.Configuration,
  RenderOptions extends TokenPaletteConfig.RenderOptions = TokenPaletteConfig.RenderOptions,
> extends PlaceableConfig<TokenDocument.Implementation, RenderContext, Configuration, RenderOptions> {}

declare namespace TokenPalette {
  interface RenderContext extends TokenPaletteConfig.RenderContext, PlaceablePaletteMixin.RenderContext {}
  interface Configuration extends TokenPaletteConfig.Configuration, PlaceablePaletteMixin.Configuration {}
  interface RenderOptions extends TokenPaletteConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}
}

class TokenPalette extends PlaceablePaletteMixin(TokenPaletteConfig)<
  TokenPalette.RenderContext,
  TokenPalette.Configuration,
  TokenPalette.RenderOptions
> {
  static SETTING_KEY = "myModule.tokenPalette";

  static documentName = "Token" as const;

  static override COMMIT_TOOL = "select";

  // Fake override.
  override get controlled(): TokenDocument.Implementation[] {
    return super.controlled as TokenDocument.Implementation[];
  }

  protected override _applyPreset(
    formData: AnyObject,
    options?: PlaceablePaletteMixin.RenderOptions,
  ): AnyMutableObject | void {
    return super._applyPreset(formData, options);
  }

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void {
    super._onChangeForm(formConfig, event);
  }

  protected override _prepareContext(
    options: DeepPartial<TokenPalette.RenderOptions> & { isFirstRender: boolean },
  ): Promise<TokenPalette.RenderContext> {
    return super._prepareContext(options);
  }
}

declare const tokenPalette: TokenPalette;
expectTypeOf(tokenPalette.controlled).toEqualTypeOf<TokenDocument.Implementation[]>();
expectTypeOf(tokenPalette.document).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(tokenPalette.documentName).toBeString();
expectTypeOf(TokenPalette.SETTING_KEY).toBeString();
expectTypeOf(TokenPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
