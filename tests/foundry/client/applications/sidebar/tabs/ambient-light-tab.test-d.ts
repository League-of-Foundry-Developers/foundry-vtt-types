import { expectTypeOf } from "vitest";

import AmbientLightTab = foundry.applications.sidebar.tabs.AmbientLightTab;
import AmbientLightFilter = foundry.applications.sidebar.filters.AmbientLightFilter;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new AmbientLightTab({ collectionName: "lights", directory });

expectTypeOf(AmbientLightTab.FILTER_CLASS).toEqualTypeOf<AmbientLightFilter.AnyConstructor>();

// The constructor seeds five extra criteria on top of the inherited filter state.
expectTypeOf(tab._filterState).toEqualTypeOf<AmbientLightTab.FilterState>();
expectTypeOf(tab._filterState.animationType).toEqualTypeOf<
  foundry.canvas.sources.RenderedEffectSource.ConfiguredLightAnimations | "none" | null
>();
expectTypeOf(tab._filterState.color).toEqualTypeOf<string | null>();
expectTypeOf(tab._filterState.negative).toBeBoolean();
expectTypeOf(tab._filterState.walls).toBeBoolean();
expectTypeOf(tab._filterState.vision).toBeBoolean();
expectTypeOf(tab._filterState.levels).toEqualTypeOf<Set<string>>();

class CustomAmbientLightTab extends AmbientLightTab {
  override _applyFilters(): void {
    super._applyFilters();
  }

  protected override _matchesFilter(entry: PlaceableTab.PlaceableDocument): boolean {
    return super._matchesFilter(entry);
  }

  protected override _hasAdvancedFilters(): boolean {
    return super._hasAdvancedFilters();
  }
}

expectTypeOf(new CustomAmbientLightTab({ collectionName: "lights", directory })).toEqualTypeOf<CustomAmbientLightTab>();
