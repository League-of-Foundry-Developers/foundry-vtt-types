import { expectTypeOf } from "vitest";

import WallPalette = foundry.applications.sheets.palette.WallPalette;

declare const palette: WallPalette;

expectTypeOf(palette).toEqualTypeOf<WallPalette>();

expectTypeOf(WallPalette.DEFAULT_OPTIONS).toEqualTypeOf<WallPalette.DefaultOptions>();
expectTypeOf(WallPalette.SETTING_KEY).toBeString();
expectTypeOf(WallPalette.COMMIT_TOOL).toEqualTypeOf<string | undefined>();
expectTypeOf(WallPalette.documentName).toBeString();
expectTypeOf(WallPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();

declare const event: PointerEvent;
expectTypeOf(WallPalette.onClickPreset(event)).toBeVoid();
