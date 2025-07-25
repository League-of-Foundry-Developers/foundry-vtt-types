import { expectTypeOf } from "vitest";

declare const doc: AmbientLightDocument.Implementation;
const lightConfig = new foundry.applications.sheets.AmbientLightConfig({ document: doc });

expectTypeOf(lightConfig.preview).toEqualTypeOf<AmbientLightDocument.Implementation | undefined>();
expectTypeOf(lightConfig.tabGroups).toEqualTypeOf<{ sheet: string }>();
expectTypeOf(lightConfig.changeTab("", "")).toEqualTypeOf<void>();

declare const formConfig: foundry.applications.api.ApplicationV2.FormConfiguration;
declare const event: Event;
expectTypeOf(lightConfig._onChangeForm(formConfig, event)).toEqualTypeOf<void>();

expectTypeOf(
  foundry.applications.sheets.AmbientLightConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();

expectTypeOf(foundry.applications.sheets.AmbientLightConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
