import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import RegionBehaviorConfig = foundry.applications.sheets.RegionBehaviorConfig;

declare const doc: RegionBehavior.Implementation;
const regionSheet = new RegionBehaviorConfig({ document: doc });

expectTypeOf(regionSheet.document).toEqualTypeOf<RegionBehavior.Implementation>();

expectTypeOf(
  RegionBehaviorConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(RegionBehaviorConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const context: RegionBehaviorConfig.RenderContext;
expectTypeOf(context.region).toEqualTypeOf<RegionBehavior.Implementation>();
expectTypeOf(context.fields).toEqualTypeOf<foundry.applications.types.FormNode[]>();
expectTypeOf(context.hint).toEqualTypeOf<string | undefined>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();

class CustomRegionBehaviorConfig extends RegionBehaviorConfig {
  protected override _getFields(): foundry.applications.types.FormNode[] {
    return super._getFields();
  }

  protected override _getButtons(): ApplicationV2.FormFooterButton[] {
    return super._getButtons();
  }
}

expectTypeOf(CustomRegionBehaviorConfig).toExtend<RegionBehaviorConfig.AnyConstructor>();
