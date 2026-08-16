import { expectTypeOf } from "vitest";

import AmbientLightPalette = foundry.applications.sheets.palette.AmbientLightPalette;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const palette: AmbientLightPalette;
declare const context: AmbientLightPalette.RenderContext;

expectTypeOf(AmbientLightPalette.SETTING_KEY).toBeString();
expectTypeOf(AmbientLightPalette.documentName).toEqualTypeOf<foundry.abstract.Document.PlaceableType>();
expectTypeOf(palette.controlled).toEqualTypeOf<AmbientLightDocument.Implementation[]>();
expectTypeOf(context.partId).toBeString();
expectTypeOf(context.isSelect).toBeBoolean();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
