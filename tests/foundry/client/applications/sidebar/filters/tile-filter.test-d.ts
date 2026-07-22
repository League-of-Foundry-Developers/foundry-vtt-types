import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import TileFilter = foundry.applications.sidebar.filters.TileFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const tab: PlaceableTab.Any;

const filter = new TileFilter(tab);

expectTypeOf(filter).toEqualTypeOf<TileFilter>();

expectTypeOf(TileFilter.DEFAULT_OPTIONS).toEqualTypeOf<TileFilter.DefaultOptions>();
expectTypeOf(TileFilter.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestTileFilterSubclass extends TileFilter {
  protected override _prepareContext(
    options: DeepPartial<TileFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<TileFilter.RenderContext>;
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}
