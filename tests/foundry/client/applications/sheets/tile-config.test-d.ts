import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;
import TileConfig = foundry.applications.sheets.TileConfig;

declare const doc: TileDocument.Implementation;
const tileConfig = new TileConfig({ document: doc });

expectTypeOf(tileConfig.document).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(tileConfig.title).toBeString();

expectTypeOf(TileConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();
expectTypeOf(TileConfig.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: TileConfig.RenderContext;
expectTypeOf(context.tabClasses).toBeString();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
expectTypeOf(context.hasVideo).toEqualTypeOf<boolean | undefined>();
expectTypeOf(context.tab).toEqualTypeOf<ApplicationV2.Tab | undefined>();
