import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

// Foundry does not re-export the mixin from `sheets/_module.mjs`, so it is imported directly.
import type TokenApplicationMixin from "#client/applications/sheets/token/mixin.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import TokenConfig = foundry.applications.sheets.TokenConfig;

declare const sheet: TokenConfig;
declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const changeEvent: Event;

// New in V14: `TokenConfig` is reparented from `DocumentSheetV2` onto `PlaceableConfig`, so it now
// carries the preview lifecycle rather than implementing its own.
expectTypeOf(sheet).toExtend<PlaceableConfig<TokenDocument.Implementation>>();
expectTypeOf(sheet.options.preview).toBeBoolean();

expectTypeOf(sheet.isPrototype).toEqualTypeOf<false>();
expectTypeOf(sheet.token).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(sheet.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(sheet["_fields"]).toEqualTypeOf<TokenDocument.Implementation["schema"]["fields"]>();
expectTypeOf(sheet.isVisible).toBeBoolean();

expectTypeOf(sheet["_prepareAppearanceTab"]()).toEqualTypeOf<Promise<TokenApplicationMixin.AppearanceTabContext>>();

declare const changes: DocumentSheetV2.SubmitData<TokenDocument.Implementation>;
expectTypeOf(sheet["_previewChanges"](changes)).toBeVoid();

declare const context: DeepPartial<TokenConfig.RenderContext>;
declare const options: DeepPartial<TokenConfig.RenderOptions>;
expectTypeOf(sheet["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();

declare const formConfig: ApplicationV2.FormConfiguration;
expectTypeOf(sheet["_onChangeForm"](formConfig, changeEvent)).toBeVoid();
expectTypeOf(sheet["_onChangeBar"](changeEvent)).toBeVoid();

expectTypeOf(sheet["_processSubmitData"](event, form, changes)).toEqualTypeOf<
  Promise<DocumentSheetV2.SubmitResult<TokenDocument.Implementation>>
>();

/* Render context */

declare const renderContext: TokenConfig.RenderContext;

// Supplied by `PlaceableConfig`, not by the mixin.
expectTypeOf(renderContext.model).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(renderContext.gridUnits).toBeString();
expectTypeOf(renderContext.selectableLevels).toEqualTypeOf<PlaceableConfig.LevelChoice[]>();

// Supplied by `DocumentSheetV2`.
expectTypeOf(renderContext.document).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(renderContext.source).toEqualTypeOf<TokenDocument.Implementation["_source"]>();
expectTypeOf(renderContext.rootId).toBeString();

// Supplied by the mixin.
expectTypeOf(renderContext.tabClasses).toBeString();
expectTypeOf(renderContext.isPrototype).toBeBoolean();
expectTypeOf(renderContext.displayModes).toEqualTypeOf<Record<CONST.TOKEN_DISPLAY_MODES, string>>();

class CustomTokenConfig extends TokenConfig {
  protected override _onChangeBar(event: Event): void {
    super._onChangeBar(event);
  }

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[] {
    return super._prepareButtons();
  }

  protected override _processChanges(submitData: TokenApplicationMixin.SubmitData): void {
    super._processChanges(submitData);
  }
}

expectTypeOf(CustomTokenConfig).toExtend<TokenConfig.AnyConstructor>();
