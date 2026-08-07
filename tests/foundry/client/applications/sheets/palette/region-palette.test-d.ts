import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import RegionPalette = foundry.applications.sheets.palette.RegionPalette;

declare const palette: RegionPalette;
declare const context: RegionPalette.RenderContext;
declare const submitEvent: SubmitEvent;
declare const form: HTMLFormElement;
declare const submitData: DocumentSheetV2.SubmitData<RegionDocument.Implementation>;

expectTypeOf(RegionPalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
expectTypeOf(palette.controlled).toEqualTypeOf<RegionDocument.Implementation[]>();
expectTypeOf(context.visibilities).toEqualTypeOf<foundry.applications.sheets.RegionConfig.VisibilityChoice[]>();
expectTypeOf(context.restrictionTypes).toEqualTypeOf<
  foundry.applications.sheets.RegionConfig.RestrictionTypeChoice[]
>();
expectTypeOf(context.color).toEqualTypeOf<Color | null>();
expectTypeOf(palette["_processSubmitData"](submitEvent, form, submitData)).toEqualTypeOf<
  Promise<DocumentSheetV2.SubmitResult<RegionDocument.Implementation>>
>();

class CustomRegionPalette extends RegionPalette {
  protected override _applyPreset(formData: AnyObject, options?: RegionPalette.RenderOptions): void {
    super._applyPreset(formData, options);
  }
}

expectTypeOf(CustomRegionPalette).toExtend<RegionPalette.AnyConstructor>();
