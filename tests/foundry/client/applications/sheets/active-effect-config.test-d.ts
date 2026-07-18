import { expectTypeOf } from "vitest";

declare const doc: ActiveEffect.Implementation;
const activeEffectConfig = new foundry.applications.sheets.ActiveEffectConfig({ document: doc });

expectTypeOf(activeEffectConfig.document).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(
  foundry.applications.sheets.ActiveEffectConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.ActiveEffectConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.ActiveEffectConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare class _TestActiveEffectConfigSubclass extends foundry.applications.sheets.ActiveEffectConfig {
  protected override _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void;
}
