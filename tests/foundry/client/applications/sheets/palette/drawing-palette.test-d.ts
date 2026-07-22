import { expectTypeOf } from "vitest";

import DrawingPalette = foundry.applications.sheets.palette.DrawingPalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: DrawingPalette;

expectTypeOf(palette).toEqualTypeOf<DrawingPalette>();

expectTypeOf(DrawingPalette.DEFAULT_OPTIONS).toEqualTypeOf<DrawingPalette.DefaultOptions>();
expectTypeOf(DrawingPalette.SETTING_KEY).toBeString();
expectTypeOf(DrawingPalette.documentName).toBeString();
expectTypeOf(DrawingPalette.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();
expectTypeOf(DrawingPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
expectTypeOf(DrawingPalette._migrateDefaultDrawingConfig()).toBeVoid();
