import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const doc: RegionBehavior.Implementation;
const regionSheet = new foundry.applications.sheets.RegionBehaviorConfig({ document: doc });

expectTypeOf(regionSheet._getButtons()).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

expectTypeOf(
  foundry.applications.sheets.RegionBehaviorConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.RegionBehaviorConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
