import { expectTypeOf } from "vitest";

declare const doc: AmbientLightDocument.Implementation;
const lightConfig = new foundry.applications.sheets.AmbientLightConfig({ document: doc });

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(lightConfig.preview).toEqualTypeOf<AmbientLightDocument.Implementation | null>();
expectTypeOf(lightConfig.tabGroups).toEqualTypeOf<Record<string, string | null>>();
expectTypeOf(lightConfig.changeTab("", "")).toEqualTypeOf<void>();

expectTypeOf(foundry.applications.sheets.AmbientLightConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  foundry.applications.sheets.PlaceableConfig.DefaultOptions<AmbientLightDocument.Implementation>
>();

expectTypeOf(foundry.applications.sheets.AmbientLightConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.AmbientLightConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare class _TestAmbientLightConfigSubclass extends foundry.applications.sheets.AmbientLightConfig {
  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void;
}
