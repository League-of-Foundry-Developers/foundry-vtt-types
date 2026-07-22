import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import AmbientSoundPalette = foundry.applications.sheets.palette.AmbientSoundPalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: AmbientSoundPalette;

expectTypeOf(palette).toEqualTypeOf<AmbientSoundPalette>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyObject>();

expectTypeOf(AmbientSoundPalette.DEFAULT_OPTIONS).toEqualTypeOf<AmbientSoundPalette.DefaultOptions>();
expectTypeOf(AmbientSoundPalette.SETTING_KEY).toBeString();
expectTypeOf(AmbientSoundPalette.documentName).toBeString();
expectTypeOf(AmbientSoundPalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(AmbientSoundPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
