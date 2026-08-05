import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import RegionConfig = foundry.applications.sheets.RegionConfig;
import ShapeConfig = foundry.applications.apps.ShapeConfig;

declare const doc: RegionDocument.Implementation;
const regionSheet = new RegionConfig({ document: doc });

expectTypeOf(regionSheet.document).toEqualTypeOf<RegionDocument.Implementation>();
expectTypeOf(regionSheet.options.preview).toBeBoolean();

expectTypeOf(RegionConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();
expectTypeOf(RegionConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(RegionConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: RegionConfig.RenderContext;
expectTypeOf(context.behaviors).toEqualTypeOf<RegionConfig.BehaviorContext[] | undefined>();
expectTypeOf(context.canCreateBehavior).toEqualTypeOf<boolean | undefined>();
expectTypeOf(context.visibilities).toEqualTypeOf<RegionConfig.VisibilityChoice[] | undefined>();
expectTypeOf(context.shapeContext).toEqualTypeOf<ShapeConfig.BaseShapeContext | undefined>();
expectTypeOf(context.attachableTokens).toEqualTypeOf<RegionConfig.TokenChoice[] | undefined>();
expectTypeOf(context.restrictionTypes).toEqualTypeOf<RegionConfig.RestrictionTypeChoice[] | undefined>();

class CustomRegionConfig extends RegionConfig {
  protected override _canDragStart(selector: string): boolean {
    return super._canDragStart(selector);
  }

  protected override _canDragDrop(selector: string): boolean {
    return super._canDragDrop(selector);
  }

  protected override _onDragStart(event: DragEvent): Promise<void> {
    return super._onDragStart(event);
  }

  protected override _onDragOver(event: DragEvent): void {
    super._onDragOver(event);
  }

  protected override _onDrop(event: DragEvent): Promise<void> {
    return super._onDrop(event);
  }

  protected override _updateLevelsSelectElement(event?: Event): void {
    super._updateLevelsSelectElement(event);
  }

  protected override _updateRestrictionEnabledElement(event?: Event): void {
    super._updateRestrictionEnabledElement(event);
  }
}

expectTypeOf(CustomRegionConfig).toExtend<RegionConfig.AnyConstructor>();
