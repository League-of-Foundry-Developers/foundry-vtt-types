import { expectTypeOf } from "vitest";

import AmbientLightTab = foundry.applications.sidebar.tabs.AmbientLightTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import AmbientLightFilter = foundry.applications.sidebar.filters.AmbientLightFilter;

declare const directory: PlaceableDirectory.Any;

const tab = new AmbientLightTab({ collectionName: "lights", directory });

expectTypeOf(tab).toEqualTypeOf<AmbientLightTab>();
expectTypeOf(tab._filterState).toEqualTypeOf<AmbientLightTab.FilterState>();
expectTypeOf(AmbientLightTab.FILTER_CLASS).toEqualTypeOf<AmbientLightFilter.AnyConstructor>();

declare class _TestAmbientLightTabSubclass extends AmbientLightTab {
  protected override _applyFilters(): void;
  protected override _clearFilters(): void;
  protected override _matchesFilter(entry: AmbientLightDocument.Implementation): boolean;
  protected override _hasAdvancedFilters(): boolean;
}
