import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import PlaceablePaletteMixin = foundry.applications.sheets.palette.PlaceablePaletteMixin;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare class TestPalette extends PlaceablePaletteMixin(ApplicationV2) {}
declare const palette: TestPalette;

expectTypeOf(palette.controlled).toEqualTypeOf<foundry.abstract.Document.Any[]>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyObject>();
expectTypeOf(palette.documentClass).toEqualTypeOf<foundry.abstract.Document.AnyConstructor>();
expectTypeOf(palette.documentName).toBeString();
expectTypeOf(palette.isSelect).toBeBoolean();
expectTypeOf(palette.layer).toEqualTypeOf<foundry.canvas.layers.PlaceablesLayer.Any | null>();
expectTypeOf(palette.title).toBeString();
expectTypeOf(palette.isEditable).toBeBoolean();
expectTypeOf(palette.render()).toEqualTypeOf<Promise<void>>();

expectTypeOf(TestPalette.documentName).toBeString();
expectTypeOf(TestPalette.SETTING_KEY).toBeString();
expectTypeOf(TestPalette.COMMIT_TOOL).toEqualTypeOf<string | undefined>();
expectTypeOf(TestPalette.createData).toEqualTypeOf<AnyObject>();
expectTypeOf(TestPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
expectTypeOf(TestPalette.isActivePreset({})).toBeBoolean();
