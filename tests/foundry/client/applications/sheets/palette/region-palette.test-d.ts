import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial } from "fvtt-types/utils";

import RegionPalette = foundry.applications.sheets.palette.RegionPalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: RegionPalette;

expectTypeOf(palette).toEqualTypeOf<RegionPalette>();

expectTypeOf(RegionPalette.DEFAULT_OPTIONS).toEqualTypeOf<RegionPalette.DefaultOptions>();
expectTypeOf(RegionPalette.SETTING_KEY).toBeString();
expectTypeOf(RegionPalette.documentName).toBeString();
expectTypeOf(RegionPalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(RegionPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

declare class _TestRegionPaletteSubclass extends RegionPalette {
  protected override _applyPreset(formData: AnyObject, options?: DeepPartial<RegionPalette.RenderOptions>): AnyObject;
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: AnyObject,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<RegionDocument.Implementation>>;
}
