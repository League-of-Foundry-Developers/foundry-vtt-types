import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AmbientLightPalette = foundry.applications.sheets.palette.AmbientLightPalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: AmbientLightPalette;

expectTypeOf(palette).toEqualTypeOf<AmbientLightPalette>();

expectTypeOf(AmbientLightPalette.DEFAULT_OPTIONS).toEqualTypeOf<AmbientLightPalette.DefaultOptions>();
expectTypeOf(AmbientLightPalette.SETTING_KEY).toBeString();
expectTypeOf(AmbientLightPalette.documentName).toBeString();
expectTypeOf(AmbientLightPalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(AmbientLightPalette.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(AmbientLightPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

declare class _TestAmbientLightPaletteSubclass extends AmbientLightPalette {
  protected override _prepareContext(
    options: DeepPartial<AmbientLightPalette.RenderOptions> & { isFirstRender: boolean },
  ): Promise<AmbientLightPalette.RenderContext>;
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}
