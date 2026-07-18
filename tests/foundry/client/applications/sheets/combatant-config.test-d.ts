import { expectTypeOf } from "vitest";

declare const doc: Combatant.Implementation;
const sheet = new foundry.applications.sheets.CombatantConfig({ document: doc });

expectTypeOf(sheet.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.CombatantConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.CombatantConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
