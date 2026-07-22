import { expectTypeOf } from "vitest";

import NotePalette = foundry.applications.sheets.palette.NotePalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: NotePalette;

expectTypeOf(palette).toEqualTypeOf<NotePalette>();

expectTypeOf(NotePalette.DEFAULT_OPTIONS).toEqualTypeOf<NotePalette.DefaultOptions>();
expectTypeOf(NotePalette.SETTING_KEY).toBeString();
expectTypeOf(NotePalette.documentName).toBeString();
expectTypeOf(NotePalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(NotePalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

declare class _TestNotePaletteSubclass extends NotePalette {
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
  protected override _determineMultiFields(docs: foundry.abstract.Document.Any[]): Set<string>;
}
