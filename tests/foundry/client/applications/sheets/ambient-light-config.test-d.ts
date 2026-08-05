import { expectTypeOf } from "vitest";

import AmbientLightConfig = foundry.applications.sheets.AmbientLightConfig;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const doc: AmbientLightDocument.Implementation;
const lightConfig = new AmbientLightConfig({ document: doc });

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(lightConfig.preview).toEqualTypeOf<AmbientLightDocument.Implementation | null>();
expectTypeOf(lightConfig.changeTab("", "")).toEqualTypeOf<void>();
expectTypeOf(lightConfig.options.preview).toBeBoolean();

expectTypeOf(AmbientLightConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();

expectTypeOf(AmbientLightConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(AmbientLightConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare const context: AmbientLightConfig.RenderContext;
expectTypeOf(context.light).toEqualTypeOf<AmbientLightDocument.Implementation>();
expectTypeOf(context.model).toEqualTypeOf<AmbientLightDocument.Implementation>();
expectTypeOf(context.isDarkness).toBeBoolean();
expectTypeOf(context.gridUnits).toBeString();
expectTypeOf(context.selectableLevels).toEqualTypeOf<PlaceableConfig.LevelChoice[]>();

// The protected preview hooks are exercised through a subclass.
class CustomAmbientLightConfig extends AmbientLightConfig {
  protected override _previewChanges(
    changes: foundry.applications.api.DocumentSheetV2.SubmitData<AmbientLightDocument.Implementation>,
  ): void {
    super._previewChanges(changes);
  }

  protected override _resetPreview(): void {
    super._resetPreview();
  }

  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void {
    super._onChangeForm(formConfig, event);
  }
}

expectTypeOf(CustomAmbientLightConfig).toExtend<AmbientLightConfig.AnyConstructor>();
