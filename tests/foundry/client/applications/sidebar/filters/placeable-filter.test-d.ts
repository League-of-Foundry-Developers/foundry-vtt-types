import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import PlaceableFilter = foundry.applications.sidebar.filters.PlaceableFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const tab: PlaceableTab.Any;

const filter = new PlaceableFilter(tab);

expectTypeOf(filter).toEqualTypeOf<PlaceableFilter>();
expectTypeOf(filter.tab).toEqualTypeOf<PlaceableTab.Any>();

expectTypeOf(PlaceableFilter.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableFilter.DefaultOptions>();
expectTypeOf(PlaceableFilter.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare class _TestPlaceableFilterSubclass extends PlaceableFilter {
  protected override _canDetach(): false;
  protected override _prepareContext(
    options: DeepPartial<PlaceableFilter.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PlaceableFilter.RenderContext>;
  protected override _attachFrameListeners(): void;
}
