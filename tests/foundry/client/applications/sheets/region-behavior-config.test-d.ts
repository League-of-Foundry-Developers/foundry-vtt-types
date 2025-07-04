import { expectTypeOf } from "vitest";
import type { FormFooterButton } from "../../../../../src/foundry/client/applications/_types.d.mts";

declare const doc: RegionBehavior.Implementation;
const regionSheet = new foundry.applications.sheets.RegionBehaviorConfig({ document: doc });

expectTypeOf(regionSheet._getButtons()).toEqualTypeOf<FormFooterButton[]>();

expectTypeOf(
  foundry.applications.sheets.RegionBehaviorConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.RegionBehaviorConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
