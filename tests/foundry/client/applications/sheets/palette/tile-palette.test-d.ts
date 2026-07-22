import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import TilePalette = foundry.applications.sheets.palette.TilePalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: TilePalette;

expectTypeOf(palette).toEqualTypeOf<TilePalette>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyObject>();

expectTypeOf(TilePalette.DEFAULT_OPTIONS).toEqualTypeOf<TilePalette.DefaultOptions>();
expectTypeOf(TilePalette.SETTING_KEY).toBeString();
expectTypeOf(TilePalette.documentName).toBeString();
expectTypeOf(TilePalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(TilePalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
