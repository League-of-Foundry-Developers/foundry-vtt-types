import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

// Foundry does not re-export the mixin from `sheets/_module.mjs`, so it is imported directly.
import type TokenApplicationMixin from "#client/applications/sheets/token/mixin.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import FormDataExtended = foundry.applications.ux.FormDataExtended;
import PrototypeTokenConfig = foundry.applications.sheets.PrototypeTokenConfig;
import PrototypeToken = foundry.data.PrototypeToken;

declare const sheet: PrototypeTokenConfig;

expectTypeOf(sheet["_fields"]).toEqualTypeOf<PrototypeToken.Schema>();
declare const prototype: PrototypeToken;

expectTypeOf(PrototypeTokenConfig.DEFAULT_OPTIONS).toEqualTypeOf<PrototypeTokenConfig.DefaultOptions>();
expectTypeOf(new PrototypeTokenConfig({ prototype })).toEqualTypeOf<PrototypeTokenConfig>();
// @ts-expect-error The prototype token is required.
new PrototypeTokenConfig();

expectTypeOf(sheet.isPrototype).toEqualTypeOf<true>();
expectTypeOf(sheet.title).toBeString();
expectTypeOf(sheet.token).toEqualTypeOf<PrototypeToken>();
expectTypeOf(sheet["_preview"]).toEqualTypeOf<PrototypeToken | null>();
expectTypeOf(sheet["_fields"]).toEqualTypeOf<PrototypeToken.Schema>();
expectTypeOf(sheet.isVisible).toBeBoolean();

// Unlike `TokenConfig#actor`, this is non-nullable — it is the prototype's parent Actor.
expectTypeOf(sheet.actor).toEqualTypeOf<Actor.Implementation>();

declare const options: DeepPartial<PrototypeTokenConfig.RenderOptions>;
declare const configuration: DeepPartial<PrototypeTokenConfig.Configuration>;

// Throws rather than returning `false` when the sheet is not visible.
expectTypeOf(sheet["_canRender"](options)).toEqualTypeOf<boolean | void>();
expectTypeOf(sheet["_initializeApplicationOptions"](configuration)).toEqualTypeOf<PrototypeTokenConfig.Configuration>();

expectTypeOf(sheet["_prepareContext"]({ ...options, isFirstRender: true })).toEqualTypeOf<
  Promise<PrototypeTokenConfig.RenderContext>
>();
expectTypeOf(sheet["_prepareAppearanceTab"]()).toEqualTypeOf<Promise<PrototypeTokenConfig.AppearanceTabContext>>();
expectTypeOf(sheet["_prepareButtons"]()).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

declare const context: DeepPartial<PrototypeTokenConfig.RenderContext>;
expectTypeOf(sheet["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(sheet["_onClose"](options)).toBeVoid();

declare const closingOptions: ApplicationV2.ClosingOptions;
expectTypeOf(sheet["_tearDown"](closingOptions)).toBeVoid();

declare const submitData: TokenApplicationMixin.SubmitData;
expectTypeOf(sheet["_previewChanges"](submitData)).toBeVoid();

declare const event: SubmitEvent;
declare const form: HTMLFormElement;
declare const formData: FormDataExtended;
expectTypeOf(sheet["_processFormData"](event, form, formData)).toEqualTypeOf<TokenApplicationMixin.SubmitData>();
expectTypeOf(sheet["_processFormData"](null, form, formData)).toEqualTypeOf<TokenApplicationMixin.SubmitData>();

/* Configuration */

expectTypeOf<PrototypeTokenConfig.Configuration["prototype"]>().toEqualTypeOf<PrototypeToken>();
expectTypeOf<
  PrototypeTokenConfig.InputOptions<PrototypeTokenConfig.Configuration>["prototype"]
>().toEqualTypeOf<PrototypeToken>();

/* Render context */

declare const renderContext: PrototypeTokenConfig.RenderContext;

// The preview clone, not the prototype token itself.
expectTypeOf(renderContext.document).toEqualTypeOf<PrototypeToken>();
expectTypeOf(renderContext.model).toEqualTypeOf<PrototypeToken>();
expectTypeOf(renderContext.source).toEqualTypeOf<PrototypeToken["_source"]>();
expectTypeOf(renderContext.rootId).toBeString();
expectTypeOf(renderContext.gridUnits).toBeString();
expectTypeOf(renderContext.fields).toEqualTypeOf<PrototypeToken["schema"]["fields"]>();

/* Image preview */

declare const appearance: PrototypeTokenConfig.AppearanceTabContext;
expectTypeOf(appearance.imagePreview).toEqualTypeOf<PrototypeTokenConfig.ImagePreviewContext | undefined>();

declare const imagePreview: PrototypeTokenConfig.ImagePreviewContext;
expectTypeOf(imagePreview.src).toBeString();
expectTypeOf(imagePreview.cls).toBeString();
expectTypeOf(imagePreview.isVideo).toBeBoolean();

// Only present for wildcard images.
expectTypeOf(imagePreview.hasPrev).toEqualTypeOf<boolean | undefined>();
expectTypeOf(imagePreview.hasNext).toEqualTypeOf<boolean | undefined>();
expectTypeOf(imagePreview.current).toEqualTypeOf<number | undefined>();
expectTypeOf(imagePreview.total).toEqualTypeOf<number | undefined>();

class CustomPrototypeTokenConfig extends PrototypeTokenConfig {
  protected override _previewChanges(changes: TokenApplicationMixin.SubmitData): void {
    super._previewChanges(changes);
  }

  protected override _prepareButtons(): ApplicationV2.FormFooterButton[] {
    return super._prepareButtons();
  }

  protected override _tearDown(options: ApplicationV2.ClosingOptions): void {
    super._tearDown(options);
  }
}

expectTypeOf(CustomPrototypeTokenConfig).toExtend<PrototypeTokenConfig.AnyConstructor>();
